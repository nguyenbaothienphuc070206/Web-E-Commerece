"use client"

import React, { useState, useMemo } from "react"
import { useCart } from "../cart/cart-context"
import PaymentOptions, { PaymentMethod } from "../payment/payment-options"
import { Button } from "@/components/ui/button"
import { Package, Tag } from "lucide-react"

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [payment, setPayment] = useState<PaymentMethod>("cod")
  const [promoCode, setPromoCode] = useState("")
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const subtotal = getTotal()
  const discount = useMemo(() => {
    if (appliedCode === "SALE10") return Math.round(subtotal * 0.1)
    if (appliedCode === "SALE20") return Math.round(subtotal * 0.2)
    if (appliedCode === "FREESHIP") return 0
    return 0
  }, [appliedCode, subtotal])

  const shipping = useMemo(() => {
    if (appliedCode === "FREESHIP") return 0
    if (subtotal - discount >= 10000000 || subtotal === 0) return 0
    return 30000
  }, [subtotal, discount, appliedCode])

  const total = Math.max(0, subtotal - discount + shipping)

  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase()
    if (["SALE10", "SALE20", "FREESHIP"].includes(code)) {
      setAppliedCode(code)
    } else {
      setAppliedCode(null)
      setMessage("Mã giảm giá không hợp lệ")
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) return setMessage("Giỏ hàng trống")
    if (!name || !phone || !address) return setMessage("Vui lòng điền đầy đủ thông tin")
    setLoading(true)

    const payload = {
      customer: { name, email, phone, address },
      items,
      subtotal,
      discount,
      shipping,
      total,
      promoCode: appliedCode,
      paymentMethod: payment,
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Đặt hàng thất bại")

      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email || phone, type: "order_created", message: `Đơn hàng #${data.data.id} đã được tạo` }),
      })

      clearCart()
      setMessage(`Đặt hàng thành công! Mã đơn hàng: #${data.data.id}`)
    } catch (err: any) {
      setMessage(err?.message || "Đặt hàng thất bại")
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Giỏ hàng trống</h3>
        <p className="text-muted-foreground mb-6">Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
        <a href="/">
          <Button>Mua sắm ngay</Button>
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Customer Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên *</label>
              <input 
                required
                className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                <input 
                  required
                  className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="0912345678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng *</label>
              <textarea 
                required
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </div>
          </form>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
          <PaymentOptions value={payment} onChange={setPayment} />
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Sản phẩm trong đơn hàng</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-contain rounded bg-muted" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-sm text-muted-foreground">Số lượng: {item.quantity}</div>
                </div>
                <div className="font-semibold">{((item.price * item.quantity) / 1000000).toFixed(1)}M₫</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border bg-card p-6 sticky top-24 space-y-6">
          <h3 className="text-lg font-semibold">Tóm tắt đơn hàng</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{(subtotal / 1000000).toFixed(2)}M₫</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá {appliedCode ? `(${appliedCode})` : ""}</span>
              <span className={discount > 0 ? "text-destructive" : "text-muted-foreground"}>
                -{(discount / 1000000).toFixed(2)}M₫
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{shipping === 0 ? "Miễn phí" : `${(shipping / 1000000).toFixed(3)}M₫`}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between font-semibold text-base">
              <span>Tổng cộng</span>
              <span className="text-primary">{(total / 1000000).toFixed(2)}M₫</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Mã giảm giá
            </label>
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="SALE10, SALE20, FREESHIP"
                className="flex-1 rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="button" onClick={applyPromoCode} variant="outline">
                Áp dụng
              </Button>
            </div>
            {appliedCode && (
              <div className="text-xs text-green-600 mt-1">✓ Mã {appliedCode} đã được áp dụng</div>
            )}
          </div>

          <Button 
            className="w-full h-11" 
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </Button>

          {message && (
            <div className={`text-sm p-3 rounded-md ${message.includes("thành công") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            💡 Mẹo: Miễn phí vận chuyển cho đơn hàng từ 10,000,000₫
          </div>
        </div>
      </div>
    </div>
  )
}
