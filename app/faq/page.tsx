"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeading } from "@/components/ui/section-heading"
import Footer from "@/components/footer"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  // Orders & Shipping
  {
    category: "Orders & Shipping",
    question: "How long does shipping take?",
    answer: "Standard shipping takes 2-5 business days within Vietnam. Express shipping is available for next-day delivery in major cities. Free shipping is offered on orders over 5,000,000 VND."
  },
  {
    category: "Orders & Shipping",
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order by logging into your account and viewing order history."
  },
  {
    category: "Orders & Shipping",
    question: "Can I change my shipping address after ordering?",
    answer: "Yes, you can change your shipping address within 2 hours of placing the order. Please contact our customer service immediately at 1900 1234."
  },
  
  // Payment
  {
    category: "Payment",
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards (Visa, Mastercard, JCB), bank transfers, e-wallets (Momo, ZaloPay, VNPay), and cash on delivery (COD) for orders under 20,000,000 VND."
  },
  {
    category: "Payment",
    question: "Is it safe to pay online?",
    answer: "Yes, all online payments are processed through secure, encrypted payment gateways. We never store your card information on our servers."
  },
  {
    category: "Payment",
    question: "Can I pay in installments?",
    answer: "Yes, we offer 0% installment plans for 3, 6, 9, and 12 months on purchases over 3,000,000 VND through major credit cards and partner banks."
  },
  
  // Products
  {
    category: "Products",
    question: "Are all products 100% authentic?",
    answer: "Yes, all products sold on TechMart are 100% genuine and sourced directly from authorized distributors and manufacturers. We provide full warranty and authenticity guarantee."
  },
  {
    category: "Products",
    question: "Do you offer product demonstrations?",
    answer: "Yes, you can visit any of our retail stores for hands-on product demonstrations. Our staff will guide you through features and help you choose the right product."
  },
  {
    category: "Products",
    question: "How do I know if a product is in stock?",
    answer: "Product availability is shown on each product page. You can also call our hotline or visit our stores to check stock levels in real-time."
  },
  
  // Returns & Warranty
  {
    category: "Returns & Warranty",
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy for unopened products in original condition. The product must include all accessories, manuals, and packaging. Please see our Returns page for full details."
  },
  {
    category: "Returns & Warranty",
    question: "How do I claim warranty?",
    answer: "Contact our support team or visit any store with your product and proof of purchase. Our technicians will assess the issue and process your warranty claim within 24 hours."
  },
  {
    category: "Returns & Warranty",
    question: "What does the warranty cover?",
    answer: "Warranty covers manufacturing defects and hardware malfunctions under normal use. It does not cover physical damage, water damage, or unauthorized modifications. See our Warranty page for complete coverage details."
  },
  
  // Account & Privacy
  {
    category: "Account & Privacy",
    question: "How do I create an account?",
    answer: "Click 'Login' in the top navigation, then select 'Sign Up'. Enter your email, create a password, and verify your email address. You can also sign up using Google or Facebook."
  },
  {
    category: "Account & Privacy",
    question: "Is my personal information secure?",
    answer: "Yes, we use industry-standard encryption to protect your data. We never sell your information to third parties. Please review our Privacy Policy for more details."
  },
  {
    category: "Account & Privacy",
    question: "How do I reset my password?",
    answer: "Click 'Login', then select 'Forgot Password'. Enter your email address and we'll send you a password reset link. Follow the instructions in the email to create a new password."
  },
  
  // Support
  {
    category: "Support",
    question: "How can I contact customer support?",
    answer: "You can reach us via phone at 1900 1234, email at support@techmart.com, or use our live chat on the website. Our support team is available Monday-Saturday, 9 AM - 6 PM."
  },
  {
    category: "Support",
    question: "Do you have physical stores?",
    answer: "Yes, we have stores in major cities across Vietnam. Visit our Contact page for a list of store locations and opening hours."
  },
  {
    category: "Support",
    question: "Can I cancel my order?",
    answer: "Yes, you can cancel your order within 2 hours of placing it. After that, if the order hasn't shipped yet, contact our customer service. Once shipped, you'll need to refuse delivery or initiate a return."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <PageContainer>
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our products and services"
        />

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No results found</p>
              <p className="text-sm">Try adjusting your search or browse by category</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition"
                >
                  <div className="flex-1">
                    <span className="text-xs text-primary font-medium mb-2 block">
                      {faq.category}
                    </span>
                    <h3 className="font-semibold text-foreground">{faq.question}</h3>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Contact Support
            </a>
            <a
              href="tel:19001234"
              className="px-6 py-3 bg-background border border-border rounded-lg font-medium hover:bg-muted transition"
            >
              Call 1900 1234
            </a>
          </div>
        </div>
      </PageContainer>
      <Footer />
    </>
  )
}
