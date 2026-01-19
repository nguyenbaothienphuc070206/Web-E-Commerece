import HeroSection from "@/components/hero-section"
import ProductCategories from "@/components/product-categories"
import FeaturedProducts from "@/components/featured-products"
import FlashSale from "@/components/flash-sale"
import BrandShowcase from "@/components/brand-showcase"
import Footer from "@/components/footer"
import { getSupabasePublicClient } from "@/lib/server/supabase"
import type { Product, Brand } from "@/lib/types"

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabasePublicClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
      .limit(20)

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    // Map database fields to match our Product type
    return (data || []).map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      specs: product.specs || '',
      price: product.price || 0,
      originalPrice: product.original_price,
      discount: product.discount,
      image: product.image || '',
      category: product.category || '',
      brand: product.brand || '',
      inStock: product.in_stock ?? true,
      rating: product.rating,
      reviews: product.reviews
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

async function getBrands(): Promise<Brand[]> {
  try {
    const supabase = getSupabasePublicClient()
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching brands:', error)
      return []
    }

    // Map database fields to match our Brand type
    return (data || []).map(brand => ({
      id: brand.id,
      name: brand.name,
      logo: brand.logo || '',
      description: brand.description || '',
      productCount: brand.product_count || 0,
      featured: brand.featured ?? false
    }))
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

export default async function Home() {
  const [products, brands] = await Promise.all([
    getProducts(),
    getBrands()
  ])

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts products={products} />
      <FlashSale products={products} />
      <BrandShowcase brands={brands} />
      <Footer />
    </main>
  )
}
