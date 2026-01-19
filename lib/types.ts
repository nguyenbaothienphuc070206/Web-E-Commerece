// Core types for the e-commerce application
export interface Product {
  id: number
  name: string
  description: string
  specs: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  brand: string
  inStock: boolean
  rating?: number
  reviews?: number
}

export interface Brand {
  id: number
  name: string
  logo: string
  description: string
  productCount: number
  featured: boolean
}

export interface Discount {
  id: number
  title: string
  description: string
  code: string
  discount: number
  validUntil: string
  image: string
  type: 'percentage' | 'fixed'
  minPurchase?: number
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// Categories
export const CATEGORIES = [
  "All",
  "Phone",
  "Laptop",
  "AirPod",
  "Watch",
  "Camera",
  "Gaming"
] as const

export type Category = typeof CATEGORIES[number]
