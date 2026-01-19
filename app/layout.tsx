import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import NavbarWrapper from "@/components/navbar-wrapper"; 
import { CartProvider } from "@/components/cart/cart-context"
import { WishlistProvider } from "@/components/wishlist/wishlist-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description: "Modern e-commerce platform",
};


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
            <NavbarWrapper/>
            {children}
            <Analytics />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}
