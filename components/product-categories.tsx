import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2 } from "lucide-react"

const categories = [
  { name: "Phone", icon: Smartphone, color: "bg-blue-100" },
  { name: "Laptop", icon: Laptop, color: "bg-green-100" },
  { name: "AirPod", icon: Headphones, color: "bg-purple-100" },
  { name: "Watch", icon: Watch, color: "bg-pink-100" },
  { name: "Camera", icon: Camera, color: "bg-yellow-100" },
  { name: "Gaming", icon: Gamepad2, color: "bg-indigo-100" },
]

export default function ProductCategories() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.name}
                className="flex flex-col items-center gap-4 p-6 rounded-lg hover:shadow-lg transition cursor-pointer"
              >
                <div className={`${category.color} p-6 rounded-lg`}>
                  <Icon className="w-8 h-8 text-foreground" />
                </div>
                <p className="font-semibold text-center">{category.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
