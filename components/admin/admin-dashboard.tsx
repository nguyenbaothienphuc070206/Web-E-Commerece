"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useActionState } from "react"
import { createProductAction, seedProductsAction } from "@/app/admin/actions"
import AdminLayout from "./admin-layout"
import DashboardOverview from "./dashboard-overview"
import ProductManagement from "./product-management"
import OrderManagement from "@/components/orders/order-management"

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [seedLoading, setSeedLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "customers" | "settings">("dashboard")

  const [createState, createAction, createPending] = useActionState(createProductAction, null)

  async function fetchAll() {
    setLoading(true)
    try {
      const [pRes, oRes] = await Promise.all([fetch("/api/products"), fetch("/api/orders")])
      const pJson = await pRes.json()
      const oJson = await oRes.json()
      if (pJson?.success) setProducts(pJson.data)
      if (oJson?.success) setOrders(oJson.data)
    } catch (e) {
      console.warn(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const lowStock = products.filter((p) => typeof p.stock === "number" && p.stock <= 5)

  const updateStock = async (productId: number, newStock: number) => {
    try {
      const res = await fetch("/api/products/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, stock: newStock }),
      })
      const data = await res.json()
      if (data?.success) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)))
      }
    } catch (e) {
      console.warn(e)
    }
  }

  // Calculate stats for dashboard
  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: new Set(orders.map(o => o.customer?.email)).size,
    revenueChange: 12.5,
    ordersChange: 8.3,
    productsChange: 3.2,
    customersChange: 15.7
  }

  const handleSeedProducts = async () => {
    setSeedLoading(true)
    try {
      const result = await seedProductsAction()
      if (result.success) {
        alert(result.message)
        await fetchAll()
      } else {
        alert("Error: " + result.error)
      }
    } catch (e: any) {
      alert("Seed failed: " + (e?.message || "Unknown error"))
    } finally {
      setSeedLoading(false)
    }
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && activeTab === "dashboard" && (
        <div className="space-y-6">
          <DashboardOverview
            stats={stats}
            recentOrders={orders.slice().reverse().slice(0, 5)}
            lowStockProducts={lowStock}
          />

          {/* Seed Products Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Generate Embeddings</h3>
                <p className="text-sm text-muted-foreground">
                  Generate AI embeddings for products that don't have them yet (required for semantic search)
                </p>
              </div>
              <Button
                variant="outline"
                disabled={seedLoading}
                onClick={handleSeedProducts}
                className="shrink-0"
              >
                {seedLoading ? "Generating..." : "Generate Embeddings"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === "products" && (
        <ProductManagement
          products={products}
          onUpdateStock={updateStock}
          onCreateProduct={createAction}
          createPending={createPending}
          createState={createState}
        />
      )}

      {!loading && activeTab === "orders" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Orders</h2>
            <p className="text-muted-foreground">Manage customer orders and track shipments</p>
          </div>
          <OrderManagement />
        </div>
      )}

      {!loading && activeTab === "customers" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Customers</h2>
            <p className="text-muted-foreground">View and manage customer information</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Customer management coming soon...</p>
          </div>
        </div>
      )}

      {!loading && activeTab === "settings" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Settings</h2>
            <p className="text-muted-foreground">Configure your store settings</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
