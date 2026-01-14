"use client"

import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/components/wishlist/wishlist-context"
import { useCart } from "@/components/cart/cart-context"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  layout?: 'grid' | 'list'
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { has, toggle } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
  }

  const handleToggleWishlist = () => {
    toggle({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
  }

  if (layout === 'list') {
    return (
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative bg-muted sm:w-64 h-48 flex items-center justify-center overflow-hidden shrink-0">
          {product.discount && (
            <div className="absolute top-4 left-4 bg-destructive text-white px-3 py-1 rounded text-sm font-semibold z-10">
              -{product.discount}%
            </div>
          )}
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="max-h-32 object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{product.specs}</p>
                <p className="text-xs text-muted-foreground">Brand: {product.brand}</p>
              </div>
              <button
                onClick={handleToggleWishlist}
                className="bg-background rounded-full p-2 hover:bg-muted transition shrink-0"
              >
                <Heart className={`w-5 h-5 ${has(product.id) ? "fill-destructive text-destructive" : "text-foreground"}`} />
              </button>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm ml-1 font-medium">{product.rating}</span>
                </div>
                {product.reviews && (
                  <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">
                {(product.price / 1000000).toFixed(1)}M₫
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {(product.originalPrice / 1000000).toFixed(1)}M₫
                </span>
              )}
            </div>
            <Button
              className="bg-primary hover:bg-accent text-primary-foreground flex items-center gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition">
      {/* Image Container */}
      <div className="relative bg-muted p-4 h-48 flex items-center justify-center overflow-hidden">
        {product.discount && (
          <div className="absolute top-4 left-4 bg-destructive text-white px-3 py-1 rounded text-sm font-semibold z-10">
            -{product.discount}%
          </div>
        )}
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="max-h-32 object-contain"
        />
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 bg-background rounded-full p-2 hover:bg-muted transition"
        >
          <Heart className={`w-5 h-5 ${has(product.id) ? "fill-destructive text-destructive" : "text-foreground"}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{product.specs}</p>

        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1 font-medium">{product.rating}</span>
            </div>
            {product.reviews && (
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-foreground">
            {(product.price / 1000000).toFixed(1)}M₫
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {(product.originalPrice / 1000000).toFixed(1)}M₫
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-primary hover:bg-accent text-primary-foreground flex items-center justify-center gap-2"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
