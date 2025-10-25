import HeroSection from "@/components/hero-section"
import ProductCategories from "@/components/product-categories"
import FeaturedProducts from "@/components/featured-products"
import FlashSale from "@/components/flash-sale"
import BrandShowcase from "@/components/brand-showcase"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
      <FlashSale />
      <BrandShowcase />
      <Footer />
    </main>
  )
}
