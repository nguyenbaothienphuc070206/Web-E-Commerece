"use client"

import { useState } from "react"
import { Calendar, Tag, Copy, Check } from "lucide-react"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeading } from "@/components/ui/section-heading"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import type { Discount } from "@/lib/types"

interface DiscountsClientProps {
  discounts: Discount[]
}

export default function DiscountsClient({ discounts }: DiscountsClientProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <>
      <PageContainer>
      <SectionHeading
        title="Special Offers & Discounts"
        subtitle="Save more with our exclusive deals and promotional codes"
      />

      {/* Featured Banner */}
      <div className="mb-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Member Exclusive Deals
          </h2>
          <p className="text-lg text-white/90 mb-6">
            Sign up or log in to unlock special discounts and early access to sales
          </p>
          <Button className="bg-white text-purple-600 hover:bg-white/90 font-semibold">
            Join Now
          </Button>
        </div>
      </div>

      {/* Discount Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discounts.map((discount) => (
          <div
            key={discount.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {/* Discount Image */}
            <div className="relative h-48 bg-linear-to-r from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-lg">
                {discount.type === 'percentage' 
                  ? `-${discount.discount}%` 
                  : `-${(discount.discount / 1000000).toFixed(1)}M₫`
                }
              </div>
              <img
                src={discount.image}
                alt={discount.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Discount Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">
                {discount.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {discount.description}
              </p>

              {/* Discount Details */}
              <div className="space-y-2 mb-4">
                {discount.minPurchase && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="w-4 h-4" />
                    <span>Min. purchase: {(discount.minPurchase / 1000000).toFixed(1)}M₫</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Valid until: {formatDate(discount.validUntil)}</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono font-bold text-center border-2 border-dashed border-border">
                  {discount.code}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopyCode(discount.code)}
                  className="shrink-0"
                >
                  {copiedCode === discount.code ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-16 bg-muted/50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-4">How to Use Discount Codes</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mb-3">
              1
            </div>
            <h4 className="font-semibold mb-2">Copy the Code</h4>
            <p className="text-sm text-muted-foreground">
              Click the copy button next to the discount code you want to use
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mb-3">
              2
            </div>
            <h4 className="font-semibold mb-2">Shop Products</h4>
            <p className="text-sm text-muted-foreground">
              Add your favorite items to cart and proceed to checkout
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mb-3">
              3
            </div>
            <h4 className="font-semibold mb-2">Apply & Save</h4>
            <p className="text-sm text-muted-foreground">
              Paste the code at checkout and enjoy your discount
            </p>
          </div>
        </div>
      </div>
      </PageContainer>
      <Footer />
    </>
  )
}
