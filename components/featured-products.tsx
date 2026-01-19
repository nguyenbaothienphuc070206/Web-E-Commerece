"use client"

import Link from "next/link"
import { ProductCard } from "@/components/ui/product-card"
import { SectionHeading } from "@/components/ui/section-heading"
import type { Product } from "@/lib/types"

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Get first 4 products as featured
  const featuredProducts = products.slice(0, 4)

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Featured Products"
          subtitle="Discover our best deals and most popular items"
          action={
            <Link href="/products" className="text-primary hover:text-accent transition">
              View All →
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
