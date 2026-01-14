import Checkout from "@/components/checkout/checkout"

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <Checkout />
      </div>
    </main>
  )
}
