import { Shield, CheckCircle, Clock, FileText } from "lucide-react"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeading } from "@/components/ui/section-heading"
import Footer from "@/components/footer"

export default function WarrantyPage() {
  return (
    <>
      <PageContainer>
        <SectionHeading
          title="Warranty Policy"
          subtitle="We stand behind our products with comprehensive warranty coverage"
        />

        {/* Warranty Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">12-24 Months</h3>
            <p className="text-sm text-muted-foreground">Standard warranty period</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Genuine Products</h3>
            <p className="text-sm text-muted-foreground">100% authentic guarantee</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Fast Service</h3>
            <p className="text-sm text-muted-foreground">Quick repair turnaround</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Easy Claims</h3>
            <p className="text-sm text-muted-foreground">Simple warranty process</p>
          </div>
        </div>

        {/* Warranty Details */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Warranty Coverage</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">What's Covered:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Manufacturing defects in materials and workmanship</li>
                  <li>Hardware malfunctions under normal use</li>
                  <li>Component failures (screen, battery, motherboard, etc.)</li>
                  <li>Software issues related to factory settings</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">What's NOT Covered:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Physical damage from drops, water, or misuse</li>
                  <li>Damage from unauthorized repairs or modifications</li>
                  <li>Normal wear and tear (scratches, cosmetic damage)</li>
                  <li>Lost or stolen products</li>
                  <li>Damage from improper installation or usage</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Warranty Periods by Category</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Product Category</th>
                    <th className="text-left py-3 px-4">Warranty Period</th>
                    <th className="text-left py-3 px-4">Extended Available</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Smartphones</td>
                    <td className="py-3 px-4">12 months</td>
                    <td className="py-3 px-4">Yes (up to 24 months)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Laptops</td>
                    <td className="py-3 px-4">24 months</td>
                    <td className="py-3 px-4">Yes (up to 36 months)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Audio Products</td>
                    <td className="py-3 px-4">12 months</td>
                    <td className="py-3 px-4">Yes (up to 24 months)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Smartwatches</td>
                    <td className="py-3 px-4">12 months</td>
                    <td className="py-3 px-4">Yes (up to 24 months)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Cameras</td>
                    <td className="py-3 px-4">24 months</td>
                    <td className="py-3 px-4">Yes (up to 36 months)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Gaming Consoles</td>
                    <td className="py-3 px-4">12 months</td>
                    <td className="py-3 px-4">Yes (up to 24 months)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">How to Claim Warranty</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Call our hotline 1900 1234 or visit our store with your product and proof of purchase
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Product Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Our technicians will inspect your product to determine if the issue is covered under warranty
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Repair or Replacement</h3>
                  <p className="text-sm text-muted-foreground">
                    If approved, we'll repair or replace your product within 7-14 business days
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Product Return</h3>
                  <p className="text-sm text-muted-foreground">
                    Pick up your repaired/replaced product or we'll ship it to your address
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our customer support team is ready to assist you with warranty claims and questions.
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
