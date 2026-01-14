import Link from "next/link"
import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2 } from "lucide-react"

const categories = [
  { name: "Phone", icon: Smartphone, color: "bg-blue-100 dark:bg-blue-900/30" },
  { name: "Laptop", icon: Laptop, color: "bg-green-100 dark:bg-green-900/30" },
  { name: "AirPod", icon: Headphones, color: "bg-purple-100 dark:bg-purple-900/30" },
  { name: "Watch", icon: Watch, color: "bg-pink-100 dark:bg-pink-900/30" },
  { name: "Camera", icon: Camera, color: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Gaming", icon: Gamepad2, color: "bg-indigo-100 dark:bg-indigo-900/30" },
]

export default function ProductCategories() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={`/products?category=${category.name}`}
                className="flex flex-col items-center gap-4 p-6 rounded-lg hover:shadow-lg transition cursor-pointer group border border-transparent hover:border-primary"
              >
                <div className={`${category.color} p-6 rounded-lg group-hover:scale-110 transition`}>
                  <Icon className="w-8 h-8 text-foreground" />
                </div>
                <p className="font-semibold text-center group-hover:text-primary transition">{category.name}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
