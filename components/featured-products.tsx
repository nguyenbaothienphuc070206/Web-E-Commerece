"use client"

import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    specs: "256GB - Titan từ Hàng",
    price: 29990000,
    originalPrice: 38000000,
    discount: -18,
    image: "/placeholder.svg?height=250&width=200",
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    specs: "M3 Pro, 512GB SSD",
    price: 65990000,
    originalPrice: 75000000,
    discount: -12,
    image: "/placeholder.svg?height=250&width=200",
  },
  {
    id: 3,
    name: "AirPods Pro (Gen 3)",
    specs: "Chống ồn chủ động",
    price: 6490000,
    originalPrice: 7500000,
    discount: -13,
    image: "/placeholder.svg?height=250&width=200",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24 Ultra",
    specs: "512GB - Titan Gray",
    price: 33990000,
    originalPrice: 40000000,
    discount: -15,
    image: "/placeholder.svg?height=250&width=200",
  },
]

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
          <a href="#" className="text-primary hover:text-accent transition">
            Xem tất cả →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition"
            >
              {/* Image Container */}
              <div className="relative bg-muted p-4 h-48 flex items-center justify-center overflow-hidden">
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm font-semibold text-white">
                    {product.discount}%
                  </div>
                )}
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="max-h-24 object-contain"
                />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 bg-background rounded-full p-2 hover:bg-muted transition"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(product.id) ? "fill-destructive text-destructive" : "text-foreground"
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{product.specs}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-bold text-foreground">{(product.price / 1000000).toFixed(1)}M₫</span>
                  <span className="text-sm text-muted-foreground line-through">
                    {(product.originalPrice / 1000000).toFixed(1)}M₫
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full bg-primary hover:bg-accent text-primary-foreground flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
