"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useActionState } from "react"
import { createProductAction, seedProductsAction } from "@/app/admin/actions"
import { CATEGORIES } from "@/lib/constants"

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [seedLoading, setSeedLoading] = useState(false)

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

      <div className="mb-6 rounded-xl border bg-card p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-medium">PHASE 1 — Ingestion</h4>
            <p className="text-sm text-muted-foreground">Import products, generate embeddings, and save them to Supabase.</p>
          </div>
          <Button
            variant="outline"
            disabled={seedLoading}
            onClick={async () => {
              setSeedLoading(true)
              try {
                await seedProductsAction()
                alert("Seed completed. Check Supabase to verify.")
              } catch (e: any) {
                alert("Seed failed: " + (e?.message || "Unknown error"))
              } finally {
                setSeedLoading(false)
              }
            }}
          >
            {seedLoading ? "Seeding..." : "Seed from PRODUCTS"}
          </Button>
        </div>

        <form action={createAction} className="mt-4 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm mb-1">Product name</label>
              <input
                name="name"
                className="w-full h-10 rounded-lg border border-border bg-background px-3"
                placeholder="e.g., iPhone 15 Pro Max"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Price (VND)</label>
              <input name="price" type="number" className="w-full h-10 rounded-lg border border-border bg-background px-3" placeholder="29990000" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select name="category" className="w-full h-10 rounded-lg border border-border bg-background px-3">
                <option value="">(Optional)</option>
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Brand</label>
              <input name="brand" className="w-full h-10 rounded-lg border border-border bg-background px-3" placeholder="Apple / Samsung / ..." />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Image URL (optional)</label>
            <input name="imageUrl" className="w-full h-10 rounded-lg border border-border bg-background px-3" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              className="w-full min-h-24 rounded-lg border border-border bg-background px-3 py-2"
              placeholder="Short description..."
            />
            <label className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input name="autoDescribe" type="checkbox" className="h-4 w-4" />
              If empty, generate the description from the image using Gemini Vision.
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={createPending}>
              {createPending ? "Saving..." : "Save product"}
            </Button>
            {createState?.success ? (
              <span className="text-sm text-foreground">{createState.message}</span>
            ) : createState?.success === false ? (
              <span className="text-sm text-destructive">{createState.error}</span>
            ) : null}
          </div>
        </form>
      </div>

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
