import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center px-4 ">
      {/* Video Background */}
      <video
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/mac-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 w-full max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">New technology</h1>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Discover top electronics products at the best prices on the market
            </p>
            <div className="flex gap-4">
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">Buy now</Button>
              <Button
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                See more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
