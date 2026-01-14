"use client"

import { useEffect, useMemo, useState } from "react"
import Cart from "@/components/cart/cart"
import Footer from "@/components/footer"
import { useCart } from "@/components/cart/cart-context"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const { getTotal, items } = useCart()
  const [code, setCode] = useState("")
  const [applied, setApplied] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])

  const subtotal = getTotal()
  const discount = useMemo(() => (applied === "SALE10" ? Math.round(subtotal * 0.1) : 0), [applied, subtotal])
  const shipping = useMemo(() => (subtotal - discount >= 10000000 || subtotal === 0 ? 0 : 30000), [subtotal, discount])
  const total = Math.max(0, subtotal - discount + shipping)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        if (data?.success) setProducts(data.data)
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  const applyCode = () => {
    if (code.trim().toUpperCase() === "SALE10") setApplied("SALE10")
    else setApplied(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero header */}
      <div className="bg-linear-to-r from-primary/10 via-accent/10 to-transparent border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-sm text-muted-foreground mb-2">Home / Cart</div>
          <h1 className="text-3xl font-bold">Your cart</h1>
          {!!items.length && (
            <div className="mt-1 text-sm text-muted-foreground">
              {items.reduce((s, i) => s + i.quantity, 0)} items in your cart
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Cart />
        </div>

        {/* Summary card */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border bg-card p-5 sticky top-24">
            <h2 className="text-lg font-semibold mb-3">Order summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{(subtotal / 1000000).toFixed(2)}M₫</span></div>
              <div className="flex justify-between">
                <span>Discount {applied ? `(${applied})` : ""}</span>
                <span className={applied ? "text-destructive" : "text-muted-foreground"}>-
                  {(discount / 1000000).toFixed(2)}M₫
                </span>
              </div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping ? `${(shipping / 1000000).toFixed(3)}M₫` : "Free"}</span></div>
              <div className="h-px my-2 bg-border" />
              <div className="flex justify-between font-semibold text-base"><span>Total</span><span>{(total / 1000000).toFixed(2)}M₫</span></div>
            </div>

            {/* Promo code */}
            <div className="mt-5">
              <label className="text-sm font-medium">Promo code</label>
              <div className="mt-1 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter a code (e.g., SALE10)"
                  className="flex-1 rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="button" onClick={applyCode} variant="outline">Apply</Button>
              </div>
              {applied === null && code && (
                <div className="text-xs text-muted-foreground mt-1">Invalid or unsupported code.</div>
              )}
            </div>

            <a href="/checkout" className="block mt-5">
              <Button className="w-full h-11">Proceed to checkout</Button>
            </a>
            <div className="text-xs text-muted-foreground mt-2">Free shipping on orders over 10,000,000₫</div>
          </div>
        </aside>
      </div>

      {/* Recommended products */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h3 className="text-lg font-semibold mb-4">Recommended for you</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <a key={p.id} href="#" className="group rounded-xl border p-3 hover:shadow transition bg-card">
              <div className="aspect-square bg-muted rounded-lg grid place-items-center overflow-hidden">
                <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-24 h-24 object-contain group-hover:scale-105 transition" />
              </div>
              <div className="mt-3 text-sm font-medium line-clamp-2">{p.name}</div>
              <div className="text-sm text-muted-foreground">{(p.price / 1000000).toFixed(1)}M₫</div>
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
 

