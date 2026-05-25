"use client"

import React, { useState } from "react"
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CATEGORIES } from "@/lib/types"

interface ProductManagementProps {
  products: any[]
  onUpdateStock: (productId: number, newStock: number) => void
  onCreateProduct: (formAction: any) => void
  createPending?: boolean
  createState?: any
}

export default function ProductManagement({
  products,
  onUpdateStock,
  onCreateProduct,
  createPending = false,
  createState = null
}: ProductManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 mt-16">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
          <form action={onCreateProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name*</label>
                <input
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="e.g., iPhone 15 Pro Max"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (VND)*</label>
                <input
                  name="price"
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="29990000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  name="category"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <input
                  name="brand"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Apple, Samsung, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stock</label>
                <input
                  name="stock"
                  type="number"
                  defaultValue="0"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                name="imageUrl"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="Product description..."
              />
              <label className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <input name="autoDescribe" type="checkbox" className="h-4 w-4" />
                Auto-generate description using AI (if empty)
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={createPending}>
                {createPending ? "Saving..." : "Save Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              {createState?.success && (
                <span className="text-sm text-green-500">{createState.message}</span>
              )}
              {createState?.success === false && (
                <span className="text-sm text-destructive">{createState.error}</span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name, category, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Stock</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                        {product.category || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      {(product.price / 1000000).toFixed(1)}M₫
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.stock ?? 0}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            onClick={() => onUpdateStock(product.id, (product.stock || 0) + 5)}
                          >
                            +5
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            onClick={() => onUpdateStock(product.id, Math.max(0, (product.stock || 0) - 1))}
                          >
                            -1
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {product.stock > 10 ? (
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm">
                          In Stock
                        </span>
                      ) : product.stock > 0 ? (
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-sm">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-sm">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" className="h-8 px-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 px-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
        <p>Total inventory value: {((products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)) / 1000000).toFixed(1)}M₫</p>
      </div>
    </div>
  )
}
