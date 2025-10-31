"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

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
        // For demo, update client state
        setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)))
      }
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <section className="p-6 bg-background rounded">
      <h3 className="text-lg font-semibold mb-4">Admin Dashboard</h3>
      {loading && <div>Loading...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Products</h4>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground">Stock: {p.stock ?? "—"}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateStock(p.id, (p.stock || 0) + 5)}>
                    +5
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateStock(p.id, Math.max(0, (p.stock || 0) - 1))}>
                    -1
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h5 className="font-medium">Low stock</h5>
            {lowStock.length ? (
              <ul className="list-disc ml-5">
                {lowStock.map((l) => (
                  <li key={l.id}>{l.name} — {l.stock} left</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No low stock items</div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Recent Orders</h4>
          <div className="space-y-3">
            {orders.slice().reverse().map((o: any) => (
              <div key={o.id} className="p-3 border rounded">
                <div className="flex justify-between">
                  <div>#{o.id} — {(o.total / 1000000).toFixed(1)}M₫</div>
                  <div className="text-sm">{o.status}</div>
                </div>
                <div className="text-sm text-muted-foreground">{o.customer?.name || o.customer?.email}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
