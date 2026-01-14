import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import NavbarDemo from "@/components/resizable-navbar-demo"
import { CartProvider } from "@/components/cart/cart-context"
import { WishlistProvider } from "@/components/wishlist/wishlist-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <WishlistProvider>
          <CartProvider>
            <NavbarDemo />
            {children}
            <Analytics />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}
