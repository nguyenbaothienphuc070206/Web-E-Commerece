import { Apple, Grid2x2 } from "lucide-react"

export default function BrandShowcase() {
  const brands = [
    { name: "Apple", logo: <Apple className="w-8 h-8" /> },
    { name: "Google", logo: "G" },
    { name: "Microsoft", logo: <Grid2x2 className="w-8 h-8" /> },
    { name: "Samsung", logo: "Samsung" },
    { name: "Sony", logo: "Sony" },
    { name: "LG", logo: "LG" },
  ]

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Famous Brand</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center p-8 border border-border rounded-lg hover:shadow-lg hover:border-primary transition cursor-pointer bg-card"
            >
              <span className="text-3xl font-bold text-foreground">{brand.logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
