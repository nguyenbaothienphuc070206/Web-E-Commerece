"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type WishlistItem = { id: number; name: string; price: number; image?: string }

type Ctx = {
  items: WishlistItem[]
  has: (id: number) => boolean
  toggle: (item: WishlistItem) => void
}

const X = createContext<Ctx | undefined>(undefined)
const KEY = "wec_wishlist_v1"

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const s = localStorage.getItem(KEY)
      if (s) {
        const parsed = JSON.parse(s)
        setItems(parsed)
      }
    } catch (e) {
      console.warn("Failed to load wishlist", e)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(KEY, JSON.stringify(items))
      } catch (e) {
        console.warn("Failed to save wishlist", e)
      }
    }
  }, [items, mounted])

  const has = (id: number) => items.some((i) => i.id === id)
  
  const toggle = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id)
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item]
    })
  }

  return <X.Provider value={{ items, has, toggle }}>{children}</X.Provider>
}

export function useWishlist() {
  const v = useContext(X)
  if (!v) throw new Error("useWishlist must be used within WishlistProvider")
  return v
}
