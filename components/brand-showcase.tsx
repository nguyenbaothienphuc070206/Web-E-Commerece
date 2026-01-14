import Link from "next/link"
import { SectionHeading } from "@/components/ui/section-heading"
import { BRANDS } from "@/lib/constants"

export default function BrandShowcase() {
  // Only show featured brands on homepage
  const featuredBrands = BRANDS.filter(brand => brand.featured)

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Featured Brands"
          subtitle="Trusted by millions worldwide"
          action={
            <Link href="/brands" className="text-primary hover:text-accent transition">
              View All Brands →
            </Link>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredBrands.map((brand) => (
            <Link 
              key={brand.id}
              href={`/products?brand=${brand.name}`}
              className="flex flex-col items-center justify-center p-8 border border-border rounded-lg hover:shadow-lg hover:border-primary transition bg-card group"
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center p-4">
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-contain dark:invert transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                {brand.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {brand.productCount} products
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
