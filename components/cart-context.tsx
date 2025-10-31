"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type CartItem = {
  productId: number
  name: string
  price: number
  quantity: number
  image?: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = "wec_cart_v1"

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(CART_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        console.log("Cart loaded from localStorage:", parsed)
        setItems(parsed)
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        console.log("Saving cart to localStorage:", items)
        localStorage.setItem(CART_KEY, JSON.stringify(items))
      } catch (e) {
        console.warn("Failed to save cart to localStorage", e)
      }
    }
  }, [items, mounted])

  const addToCart = (item: CartItem) => {
    console.log("Adding to cart:", item)
    setItems((prev) => {
      const found = prev.find((p) => p.productId === item.productId)
      if (found) {
        const updated = prev.map((p) => (p.productId === item.productId ? { ...p, quantity: p.quantity + item.quantity } : p))
        console.log("Updated cart (item exists):", updated)
        return updated
      }
      const updated = [...prev, item]
      console.log("Updated cart (new item):", updated)
      return updated
    })
  }

  const removeFromCart = (productId: number) => setItems((prev) => prev.filter((p) => p.productId !== productId))

  const updateQuantity = (productId: number, quantity: number) =>
    setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity } : p)))

  const clearCart = () => setItems([])

  const getTotal = () => items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

export default CartProvider
