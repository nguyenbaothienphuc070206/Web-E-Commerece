import { Suspense } from "react"
import DiscountsClient from "./discounts-client"
import { getSupabasePublicClient } from "@/lib/server/supabase"
import type { Discount } from "@/lib/types"

async function getDiscounts(): Promise<Discount[]> {
  try {
    const supabase = getSupabasePublicClient()
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching discounts:', error)
      return []
    }

    // Map database fields to match our Discount type
    return (data || []).map(discount => ({
      id: discount.id,
      title: discount.title,
      description: discount.description || '',
      code: discount.code,
      discount: discount.discount_value,
      validUntil: discount.valid_until,
      image: discount.image || '/placeholder.svg?height=200&width=400',
      type: discount.discount_type as 'percentage' | 'fixed',
      minPurchase: discount.min_purchase
    }))
  } catch (error) {
    console.error('Error fetching discounts:', error)
    return []
  }
}

export default async function DiscountsPage() {
  const discounts = await getDiscounts()

  return (
    <Suspense fallback={null}>
      <DiscountsClient discounts={discounts} />
    </Suspense>
  )
}
