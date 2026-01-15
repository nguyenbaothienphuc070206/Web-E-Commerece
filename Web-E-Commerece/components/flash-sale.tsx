"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function FlashSale() {
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

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
          {/* Content */}
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Flash Sale</h2>
              <p className="text-lg mb-8 text-white/90">Up to 50% off selected products</p>

              {/* Countdown */}
              <div className="flex gap-4 mb-8">
                <div className="bg-white/20 rounded-lg px-4 py-3 text-center">
                  <div className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
                  <div className="text-sm">Hours</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-3 text-center">
                  <div className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
                  <div className="text-sm">Mins</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-3 text-center">
                  <div className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
                  <div className="text-sm">Secs</div>
                </div>
              </div>

              <Button className="bg-white text-red-500 hover:bg-white/90 font-semibold">Buy Now</Button>
            </div>

            {/* Right Side - Device Grid */}
            <div className="hidden md:grid grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-red-600 rounded-lg aspect-square flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-400 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
