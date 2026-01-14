"use client"

import { useState } from "react"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const submit = async (e: any) => {
    e.preventDefault()
    if (mode === "register") {
      const r = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) })
      const j = await r.json()
      if (j?.success) {
        localStorage.setItem("user", JSON.stringify(j.data))
        window.location.href = "/"
        return
      }
    } else {
      const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
      const j = await r.json()
      if (j?.success) {
        localStorage.setItem("user", JSON.stringify(j.data))
        window.location.href = "/"
        return
      }
    }
    alert("Lỗi")
  }
  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setMode("login")} className={`px-3 py-2 rounded ${mode === "login" ? "bg-primary text-primary-foreground" : "border"}`}>Đăng nhập</button>
          <button onClick={() => setMode("register")} className={`px-3 py-2 rounded ${mode === "register" ? "bg-primary text-primary-foreground" : "border"}`}>Đăng ký</button>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          {mode === "register" && (
            <div>
              <label className="block text-sm mb-1">Tên</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2" />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2" />
          </div>
          <button type="submit" className="w-full h-11 rounded-md bg-primary text-primary-foreground">{mode === "login" ? "Đăng nhập" : "Đăng ký"}</button>
        </form>
      </div>
    </main>
  )
}
