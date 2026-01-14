import Link from "next/link"
import { Package, ArrowRight } from "lucide-react"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeading } from "@/components/ui/section-heading"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import { BRANDS } from "@/lib/constants"

export default function BrandsPage() {
  return (
    <>
      <PageContainer>
        <SectionHeading
        title="All Brands"
        subtitle="Discover products from the world's leading technology brands"
      />

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BRANDS.map((brand) => (
          <div
            key={brand.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              {/* Brand Logo */}
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Brand Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition">
                    {brand.name}
                  </h3>
                  {brand.featured && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {brand.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{brand.productCount} products</span>
                  </div>
                  <Link href={`/products?brand=${brand.name}`}>
                    <Button variant="ghost" size="sm" className="group-hover:text-primary">
                      View Products
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-16 bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">{BRANDS.length}+</div>
            <div className="text-muted-foreground">Trusted Brands</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">
              {BRANDS.reduce((sum, b) => sum + b.productCount, 0)}+
            </div>
            <div className="text-muted-foreground">Products Available</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-muted-foreground">Authentic Products</div>
          </div>
        </div>
      </div>
      </PageContainer>
      <Footer />
    </>
  )
}
