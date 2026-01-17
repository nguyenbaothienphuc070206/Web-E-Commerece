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
          <div className="text-sm text-muted-foreground">Pay when your order arrives.</div>
        </div>
      </label>

      <label className="flex items-center gap-3">
        <input type="radio" name="payment" checked={value === "card"} onChange={() => onChange("card")} />
        <div>
          <div className="font-medium">Card (Demo)</div>
          <div className="text-sm text-muted-foreground">Simulated payment. Your order will be marked as paid.</div>
        </div>
      </label>

      <label className="flex items-center gap-3">
        <input type="radio" name="payment" checked={value === "vnpay"} onChange={() => onChange("vnpay")} />
        <div>
          <div className="font-medium">VNPay (Demo)</div>
          <div className="text-sm text-muted-foreground">Simulated redirect + payment success.</div>
        </div>
      </label>
    </div>
  )
}
