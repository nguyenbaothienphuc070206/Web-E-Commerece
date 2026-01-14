import type { Product, Brand, Discount } from './types'

// Sample products data
export const PRODUCTS: Product[] = [
  // Smartphones
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    description: "Flagship smartphone with titanium design and A17 Pro chip",
    specs: "256GB - Titan Natural",
    price: 29990000,
    originalPrice: 38000000,
    discount: 18,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    category: "Phone",
    brand: "Apple",
    inStock: true,
    rating: 4.8,
    reviews: 1240
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    description: "Ultimate Android flagship with S Pen and AI features",
    specs: "512GB - Titan Gray",
    price: 33990000,
    originalPrice: 40000000,
    discount: 15,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop",
    category: "Phone",
    brand: "Samsung",
    inStock: true,
    rating: 4.8,
    reviews: 987
  },
  {
    id: 3,
    name: "iPhone 14 Pro",
    description: "Powerful smartphone with Dynamic Island",
    specs: "128GB - Deep Purple",
    price: 22990000,
    originalPrice: 27000000,
    discount: 15,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663703841896",
    category: "Phone",
    brand: "Apple",
    inStock: true,
    rating: 4.7,
    reviews: 856
  },
  {
    id: 4,
    name: "Google Pixel 8 Pro",
    description: "Pure Android experience with amazing camera",
    specs: "256GB - Obsidian",
    price: 24990000,
    originalPrice: 28000000,
    discount: 11,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop",
    category: "Phone",
    brand: "Google",
    inStock: true,
    rating: 4.6,
    reviews: 654
  },
  {
    id: 5,
    name: "Xiaomi 14 Ultra",
    description: "Premium flagship with Leica camera system",
    specs: "512GB - Black",
    price: 26990000,
    originalPrice: 30000000,
    discount: 10,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    category: "Phone",
    brand: "Xiaomi",
    inStock: true,
    rating: 4.7,
    reviews: 432
  },

  // Laptops
  {
    id: 6,
    name: 'MacBook Pro 16"',
    description: "Professional laptop with M3 Pro chip for ultimate performance",
    specs: "M3 Pro, 512GB SSD",
    price: 65990000,
    originalPrice: 75000000,
    discount: 12,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    category: "Laptop",
    brand: "Apple",
    inStock: true,
    rating: 4.9,
    reviews: 856
  },
  {
    id: 7,
    name: "Dell XPS 15",
    description: "Premium Windows laptop with stunning OLED display",
    specs: "Intel i7, 16GB RAM, 512GB SSD",
    price: 42990000,
    originalPrice: 48000000,
    discount: 10,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop",
    category: "Laptop",
    brand: "Dell",
    inStock: true,
    rating: 4.6,
    reviews: 534
  },
  {
    id: 8,
    name: "ASUS ROG Zephyrus G14",
    description: "Powerful gaming laptop in a compact form",
    specs: "AMD Ryzen 9, RTX 4060, 16GB",
    price: 38990000,
    originalPrice: 45000000,
    discount: 13,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
    category: "Laptop",
    brand: "ASUS",
    inStock: true,
    rating: 4.7,
    reviews: 423
  },
  {
    id: 9,
    name: "Lenovo ThinkPad X1 Carbon",
    description: "Business ultrabook with legendary keyboard",
    specs: "Intel i7, 16GB RAM, 512GB SSD",
    price: 35990000,
    originalPrice: 42000000,
    discount: 14,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    category: "Laptop",
    brand: "Lenovo",
    inStock: true,
    rating: 4.5,
    reviews: 312
  },

  // AirPods/Headphones
  {
    id: 10,
    name: "AirPods Pro (Gen 3)",
    description: "Premium wireless earbuds with active noise cancellation",
    specs: "Active Noise Cancellation",
    price: 6490000,
    originalPrice: 7500000,
    discount: 13,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=300&fit=crop",
    category: "AirPod",
    brand: "Apple",
    inStock: true,
    rating: 4.7,
    reviews: 2341
  },
  {
    id: 11,
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones",
    specs: "Wireless, 30h battery",
    price: 8990000,
    originalPrice: 10500000,
    discount: 14,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=300&fit=crop",
    category: "AirPod",
    brand: "Sony",
    inStock: true,
    rating: 4.9,
    reviews: 1876
  },
  {
    id: 12,
    name: "Bose QuietComfort Ultra",
    description: "Premium comfort with exceptional sound",
    specs: "Wireless, Noise Cancelling",
    price: 9990000,
    originalPrice: 11500000,
    discount: 13,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
    category: "AirPod",
    brand: "Bose",
    inStock: true,
    rating: 4.8,
    reviews: 1234
  },
  {
    id: 13,
    name: "Samsung Galaxy Buds 2 Pro",
    description: "Premium earbuds for Galaxy ecosystem",
    specs: "ANC, 360 Audio",
    price: 4490000,
    originalPrice: 5500000,
    discount: 18,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop",
    category: "AirPod",
    brand: "Samsung",
    inStock: true,
    rating: 4.6,
    reviews: 876
  },

  // Smartwatches
  {
    id: 14,
    name: "Apple Watch Series 9",
    description: "Advanced health and fitness tracking",
    specs: "45mm, GPS + Cellular",
    price: 12990000,
    originalPrice: 15000000,
    discount: 13,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop",
    category: "Watch",
    brand: "Apple",
    inStock: true,
    rating: 4.8,
    reviews: 1543
  },
  {
    id: 15,
    name: "Samsung Galaxy Watch 6",
    description: "Comprehensive health monitoring for Android",
    specs: "44mm, LTE",
    price: 8990000,
    originalPrice: 10500000,
    discount: 14,
    image: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=400&h=300&fit=crop",
    category: "Watch",
    brand: "Samsung",
    inStock: true,
    rating: 4.6,
    reviews: 987
  },
  {
    id: 16,
    name: "Garmin Fenix 7",
    description: "Premium multisport GPS smartwatch",
    specs: "47mm, Sapphire Solar",
    price: 19990000,
    originalPrice: 23000000,
    discount: 13,
    image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400&h=300&fit=crop",
    category: "Watch",
    brand: "Garmin",
    inStock: true,
    rating: 4.9,
    reviews: 654
  },

  // Cameras
  {
    id: 17,
    name: "Sony A7 IV",
    description: "Full-frame mirrorless camera for professionals",
    specs: "33MP, 4K 60fps",
    price: 62990000,
    originalPrice: 70000000,
    discount: 10,
    image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
    category: "Camera",
    brand: "Sony",
    inStock: true,
    rating: 4.9,
    reviews: 432
  },
  {
    id: 18,
    name: "Canon EOS R6 Mark II",
    description: "Versatile full-frame for photo and video",
    specs: "24MP, Dual Pixel AF",
    price: 58990000,
    originalPrice: 65000000,
    discount: 9,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    category: "Camera",
    brand: "Canon",
    inStock: true,
    rating: 4.8,
    reviews: 543
  },

  // Gaming
  {
    id: 19,
    name: "PlayStation 5",
    description: "Next-gen gaming console",
    specs: "825GB SSD, 4K Gaming",
    price: 14990000,
    originalPrice: 16500000,
    discount: 9,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop",
    category: "Gaming",
    brand: "Sony",
    inStock: true,
    rating: 4.9,
    reviews: 2341
  },
  {
    id: 20,
    name: "Xbox Series X",
    description: "Most powerful Xbox ever",
    specs: "1TB SSD, 4K 120fps",
    price: 13990000,
    originalPrice: 15500000,
    discount: 10,
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop",
    category: "Gaming",
    brand: "Microsoft",
    inStock: true,
    rating: 4.8,
    reviews: 1987
  }
]

// Sample brands data
export const BRANDS: Brand[] = [
  {
    id: 1,
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    description: "Premium technology products with innovative design and ecosystem",
    productCount: 45,
    featured: true
  },
  {
    id: 2,
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg",
    description: "Leading electronics manufacturer with diverse product range",
    productCount: 67,
    featured: true
  },
  {
    id: 3,
    name: "Dell",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
    description: "Trusted brand for laptops and computer hardware",
    productCount: 32,
    featured: true
  },
  {
    id: 4,
    name: "Sony",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
    description: "Premium audio and entertainment technology",
    productCount: 28,
    featured: true
  },
  {
    id: 5,
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    description: "Innovation in smartphones and smart home devices",
    productCount: 24,
    featured: false
  },
  {
    id: 6,
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    description: "Gaming consoles and productivity devices",
    productCount: 18,
    featured: false
  },
  {
    id: 7,
    name: "ASUS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
    description: "Gaming laptops and computer hardware",
    productCount: 35,
    featured: false
  },
  {
    id: 8,
    name: "Lenovo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg",
    description: "Business and consumer computing solutions",
    productCount: 41,
    featured: false
  }
]

// Sample discounts data
export const DISCOUNTS: Discount[] = [
  {
    id: 1,
    title: "Flash Sale Weekend",
    description: "Extra 20% off on selected smartphones",
    code: "FLASH20",
    discount: 20,
    validUntil: "2025-11-15",
    image: "/placeholder.svg?height=200&width=400",
    type: "percentage",
    minPurchase: 10000000
  },
  {
    id: 2,
    title: "Laptop Special",
    description: "Get 3,000,000 VND off on laptops over 30M",
    code: "LAPTOP3M",
    discount: 3000000,
    validUntil: "2025-11-30",
    image: "/placeholder.svg?height=200&width=400",
    type: "fixed",
    minPurchase: 30000000
  },
  {
    id: 3,
    title: "Audio Bundle Deal",
    description: "Buy headphones, get 15% off on accessories",
    code: "AUDIO15",
    discount: 15,
    validUntil: "2025-12-10",
    image: "/placeholder.svg?height=200&width=400",
    type: "percentage",
    minPurchase: 5000000
  },
  {
    id: 4,
    title: "New Customer Welcome",
    description: "10% off your first purchase",
    code: "WELCOME10",
    discount: 10,
    validUntil: "2025-12-31",
    image: "/placeholder.svg?height=200&width=400",
    type: "percentage"
  }
]

// Categories
export const CATEGORIES = [
  "All",
  "Phone",
  "Laptop",
  "AirPod",
  "Watch",
  "Camera",
  "Gaming"
] as const

export type Category = typeof CATEGORIES[number]
