"use client"

import { useEffect, useState } from "react"
import AdminDashboard from "@/components/admin/admin-dashboard"
import OrderManagement from "@/components/orders/order-management"

export default function AdminPage() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    try {
      const s = localStorage.getItem("user")
      const u = s ? JSON.parse(s) : null
      setOk(!!u && u.role === "admin")
    } catch {}
  }, [])
  if (!ok) return (
    <main className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <a href="/admin/login" className="underline">Đăng nhập Admin</a>
      </div>
    </main>
  )
  return (
    <main className="min-h-screen bg-background max-w-7xl mx-auto px-4 py-6 space-y-6">
      <AdminDashboard />
      <OrderManagement />
    </main>
  )
}
