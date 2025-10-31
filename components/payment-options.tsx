"use client"

import React from "react"

export type PaymentMethod = "cod" | "card" | "vnpay"

export default function PaymentOptions({ value, onChange }: { value: PaymentMethod; onChange: (m: PaymentMethod) => void }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3">
        <input type="radio" name="payment" checked={value === "cod"} onChange={() => onChange("cod")} />
        <div>
          <div className="font-medium">Cash on Delivery</div>
          <div className="text-sm text-muted-foreground">Trả tiền khi nhận hàng.</div>
        </div>
      </label>

      <label className="flex items-center gap-3">
        <input type="radio" name="payment" checked={value === "card"} onChange={() => onChange("card")} />
        <div>
          <div className="font-medium">Card</div>
          <div className="text-sm text-muted-foreground">Thanh toán bằng thẻ.</div>
        </div>
      </label>

      <label className="flex items-center gap-3">
        <input type="radio" name="payment" checked={value === "vnpay"} onChange={() => onChange("vnpay")} />
        <div>
          <div className="font-medium">VNPay</div>
          <div className="text-sm text-muted-foreground">Chuyển hướng tới VNPay.</div>
        </div>
      </label>
    </div>
  )
}
