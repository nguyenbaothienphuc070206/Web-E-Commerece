import { Suspense } from "react"
import ProductsClient from "./products-client"
import { getSupabasePublicClient } from "@/lib/server/supabase"
import type { Product } from "@/lib/types"

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabasePublicClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

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

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <Suspense fallback={null}>
      <ProductsClient initialProducts={products} />
    </Suspense>
  )
}
