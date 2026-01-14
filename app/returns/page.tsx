import { RotateCcw, Package, TruckIcon, CheckCircle2 } from "lucide-react"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeading } from "@/components/ui/section-heading"
import Footer from "@/components/footer"

export default function ReturnsPage() {
  return (
    <>
      <PageContainer>
        <SectionHeading
          title="Returns & Exchange Policy"
          subtitle="Easy returns within 7 days - Your satisfaction is our priority"
        />

        {/* Quick Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <RotateCcw className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">7-Day Returns</h3>
            <p className="text-sm text-muted-foreground">Full refund within 7 days</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Package className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Unopened Items</h3>
            <p className="text-sm text-muted-foreground">Original packaging required</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <TruckIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Free Pickup</h3>
            <p className="text-sm text-muted-foreground">We'll collect from your door</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Easy Process</h3>
            <p className="text-sm text-muted-foreground">Simple online returns</p>
          </div>
        </div>

        {/* Return Policy Details */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Return Eligibility</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">You can return if:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Product is within 7 days of delivery</li>
                  <li>Product is in original condition with all accessories</li>
                  <li>Original packaging and seals are intact</li>
                  <li>Receipt or proof of purchase is available</li>
                  <li>Product has not been used or damaged</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Cannot be returned:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Products with broken seals or opened packaging</li>
                  <li>Used or activated products</li>
                  <li>Products without original accessories or manuals</li>
                  <li>Clearance or final sale items</li>
                  <li>Gift cards and downloadable software</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">How to Return a Product</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Initiate Return Request</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact us at 1900 1234 or submit a return request through your account within 7 days of delivery
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Prepare Your Package</h3>
                  <p className="text-sm text-muted-foreground">
                    Pack the product securely in its original packaging with all accessories, manuals, and free gifts
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Schedule Pickup</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll arrange a free pickup from your address or you can drop off at any of our stores
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Inspection & Refund</h3>
                  <p className="text-sm text-muted-foreground">
                    Once we receive and inspect your return, refund will be processed within 5-7 business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Exchange Policy</h2>
            <p className="text-muted-foreground mb-4">
              Want to exchange for a different product? We make it easy!
            </p>
            <div className="space-y-3 text-muted-foreground">
              <p>✓ Free exchange within 7 days for same or higher value product</p>
              <p>✓ If exchanging for lower value, we'll refund the difference</p>
              <p>✓ Product must be unopened and in original condition</p>
              <p>✓ Exchange processing takes 3-5 business days</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Refund Information</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Payment Method</th>
                    <th className="text-left py-3 px-4">Refund Method</th>
                    <th className="text-left py-3 px-4">Processing Time</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Credit/Debit Card</td>
                    <td className="py-3 px-4">Original card</td>
                    <td className="py-3 px-4">5-7 business days</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Cash on Delivery</td>
                    <td className="py-3 px-4">Bank transfer</td>
                    <td className="py-3 px-4">3-5 business days</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Bank Transfer</td>
                    <td className="py-3 px-4">Same account</td>
                    <td className="py-3 px-4">3-5 business days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">E-Wallet</td>
                    <td className="py-3 px-4">Same wallet</td>
                    <td className="py-3 px-4">1-3 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">Important Notes</h3>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-2 ml-4 list-disc list-inside">
              <li>Shipping costs are non-refundable</li>
              <li>Products must be returned in saleable condition</li>
              <li>Please keep your tracking number for reference</li>
              <li>Refund amount excludes any promotional discounts that were applied at purchase</li>
            </ul>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Need Assistance?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our customer service team is here to help with your return or exchange.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/contact" className="text-primary hover:underline font-medium">
                Contact Support →
              </a>
              <a href="/faq" className="text-primary hover:underline font-medium">
                View FAQ →
              </a>
            </div>
          </div>
        </div>
      </PageContainer>
      <Footer />
    </>
  )
}
