"use client"

import React from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  Users,
  DollarSign
} from "lucide-react"

interface DashboardOverviewProps {
  stats?: {
    totalRevenue: number
    totalOrders: number
    totalProducts: number
    totalCustomers: number
    revenueChange: number
    ordersChange: number
    productsChange: number
    customersChange: number
  }
  recentOrders?: any[]
  lowStockProducts?: any[]
}

export default function DashboardOverview({ 
  stats = {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    customersChange: 0
  },
  recentOrders = [],
  lowStockProducts = []
}: DashboardOverviewProps) {
  
  const statCards = [
    {
      title: "Total Revenue",
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M₫`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      change: stats.productsChange,
      icon: Package,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      change: stats.customersChange,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ]

  return (
    <div className="space-y-6 mt-16">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          const isPositive = card.change >= 0
          
          return (
            <div
              key={card.title}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {isPositive ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-medium">+{card.change}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-red-500 font-medium">{card.change}%</span>
                    </>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{card.value}</h3>
              <p className="text-sm text-muted-foreground">{card.title}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer?.name || order.customer?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{(order.total / 1000000).toFixed(1)}M₫</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : order.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No recent orders</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">{product.stock} left</p>
                    <p className="text-xs text-muted-foreground">Restock needed</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">All products well stocked</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
