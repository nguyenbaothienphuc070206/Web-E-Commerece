"use client"

import { useState } from "react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const submit = async (e: any) => {
    e.preventDefault()
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
    const j = await r.json()
    if (j?.success && j.data?.role === "admin") {
      localStorage.setItem("user", JSON.stringify(j.data))
      window.location.href = "/admin"
      return
    }
    alert("Lỗi")
  }
  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2" />
          </div>
          <button type="submit" className="w-full h-11 rounded-md bg-primary text-primary-foreground">Đăng nhập</button>
        </form>
      </div>
    </main>
  )
}
