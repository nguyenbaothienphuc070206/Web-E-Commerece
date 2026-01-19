"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import type { Product } from "@/lib/types"

interface FlashSaleProps {
  products: Product[]
}

export default function FlashSale({ products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) {
              hours = 23
            }
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Get products with highest discount for flash sale
  const flashSaleProducts = products
    .filter(p => p.discount && p.discount >= 14)
    .slice(0, 3)

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="bg-linear-to-r from-red-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
          {/* Content */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Flash Sale</h2>
                <p className="text-lg text-white/90">Up to 50% off selected products</p>
              </div>

              {/* Countdown */}
              <div className="flex gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-3 text-center backdrop-blur-sm">
                  <div className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
                  <div className="text-sm">Hours</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-3 text-center backdrop-blur-sm">
                  <div className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
                  <div className="text-sm">Mins</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-3 text-center backdrop-blur-sm">
                  <div className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
                  <div className="text-sm">Secs</div>
                </div>
              </div>
            </div>

            {/* Flash Sale Products */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {flashSaleProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link href="/discounts">
                <Button className="bg-white text-red-500 hover:bg-white/90 font-semibold">
                  View All Deals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
