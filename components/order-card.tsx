"use client"

import React from "react"

export default function OrderCard({ order, onUpdate }: { order: any; onUpdate?: (status: string) => void }) {
  return (
    <div className="p-4 bg-card rounded border">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">Order #{order.id}</div>
          <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">{(order.total / 1000000).toFixed(1)}M₫</div>
          <div className="text-sm">{order.paymentMethod}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm font-medium mb-1">Items</div>
        <ul className="list-disc ml-5 text-sm">
          {order.items.map((it: any, idx: number) => (
            <li key={idx}>
              {it.name} x{it.quantity}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm">Status: <span className="font-semibold">{order.status}</span></div>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate?.("shipped")}
            className="px-3 py-1 rounded bg-primary text-primary-foreground"
          >
            Mark Shipped
          </button>
          <button onClick={() => onUpdate?.("delivered")} className="px-3 py-1 rounded border">
            Mark Delivered
          </button>
        </div>
      </div>
    </div>
  )
}
