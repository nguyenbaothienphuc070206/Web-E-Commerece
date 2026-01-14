"use client"

import { useWishlist } from "@/components/wishlist/wishlist-context"
import { useCart } from "@/components/cart/cart-context"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Heart } from "lucide-react"

export default function WishlistPage() {
  const { items, toggle } = useWishlist()
  const { addToCart } = useCart()

  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Wishlist</h1>
          <div className="text-sm text-muted-foreground">{items.length} items</div>
        </div>
        {items.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">Browse products and save your favorites.</p>
            <a href="/">
              <Button>Browse products</Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <div key={p.id} className="group rounded-xl border p-4 hover:shadow-lg transition bg-card relative">
                <button
                  onClick={() => toggle(p)}
                  className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur rounded-full p-2 hover:bg-destructive/10 transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
                <div className="aspect-square bg-muted rounded-lg grid place-items-center overflow-hidden mb-3">
                  <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-24 h-24 object-contain group-hover:scale-105 transition" />
                </div>
                <div className="text-sm font-medium line-clamp-2 mb-2">{p.name}</div>
                <div className="text-lg font-bold text-primary mb-3">{(p.price / 1000000).toFixed(1)}M₫</div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    addToCart({
                      productId: p.id,
                      name: p.name,
                      price: p.price,
                      quantity: 1,
                      image: p.image,
                    })
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to cart
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
