"use client"

import React from "react"
import { useCart } from "./cart-context"
import { Button } from "@/components/ui/button"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()

  if (!items.length) {
    return (
  <div className="p-10 rounded-2xl border bg-linear-to-br from-background to-accent/10 text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-accent-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Giỏ hàng của bạn trống</h3>
        <p className="text-muted-foreground mb-6">Hãy khám phá sản phẩm hấp dẫn và thêm vào giỏ hàng nhé.</p>
        <a href="/" className="inline-block">
          <Button>Tiếp tục mua sắm</Button>
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border bg-card/60 backdrop-blur px-4 py-3 flex items-center justify-between">
        <div className="font-semibold">Giỏ hàng ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</div>
        <button
          onClick={() => clearCart()}
          className="text-sm text-destructive hover:underline"
          aria-label="Clear cart"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Items */}
      <div className="divide-y rounded-xl border overflow-hidden bg-card">
        {items.map((it) => (
          <div
            key={it.productId}
            className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 hover:bg-accent/10 transition"
          >
            <img
              src={it.image || "/placeholder.svg"}
              alt={it.name}
              className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-md bg-muted"
            />
            <div className="min-w-0">
              <div className="font-medium truncate pr-4">{it.name}</div>
              <div className="text-sm text-muted-foreground">Đơn giá: {(it.price / 1000000).toFixed(1)}M₫</div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(it.productId, Math.max(1, it.quantity - 1))}
                  className="size-8 rounded-md border hover:bg-accent/20 grid place-items-center"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-10 text-center font-medium">{it.quantity}</div>
                <button
                  onClick={() => updateQuantity(it.productId, it.quantity + 1)}
                  className="size-8 rounded-md border hover:bg-accent/20 grid place-items-center"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFromCart(it.productId)}
                  className="ml-2 inline-flex items-center gap-1 text-sm text-destructive hover:underline"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Thành tiền</div>
              <div className="text-lg font-semibold">{((it.price * it.quantity) / 1000000).toFixed(1)}M₫</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <a href="/" className="inline-block">
          <Button variant="outline">← Tiếp tục mua sắm</Button>
        </a>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Tạm tính: <span className="font-semibold text-foreground">{(getTotal() / 1000000).toFixed(1)}M₫</span>
          </div>
          <a href="/checkout">
            <Button>Thanh toán</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
