"use client"

import React from "react"

export type PaymentMethod = "cod" | "stripe" | "vnpay"

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
        <input type="radio" name="payment" checked={value === "stripe"} onChange={() => onChange("stripe")} />
        <div>
          <div className="font-medium">Card (Stripe)</div>
          <div className="text-sm text-muted-foreground">Real payment via Stripe (requires server configuration).</div>
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
