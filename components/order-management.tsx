"use client"

import React, { useEffect, useState } from "react"
import OrderCard from "../order/order-card"

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      if (data?.success) setOrders(data.data)
    } catch (e) {
      console.warn(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      const data = await res.json()
      if (data?.success) {
        setOrders((prev) => prev.map((o) => (o.id === id ? data.data : o)))
        // notify customer
        const customer = data.data.customer || {}
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: customer.email || customer.phone, type: "order_update", message: `Order #${id} is now ${status}` }),
        })
      }
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <section className="p-6 bg-background rounded">
      <h3 className="text-lg font-semibold mb-4">Orders</h3>
      {loading && <div>Loading...</div>}
      <div className="space-y-4">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} onUpdate={(status) => updateStatus(o.id, status)} />
        ))}
      </div>
    </section>
  )
}
