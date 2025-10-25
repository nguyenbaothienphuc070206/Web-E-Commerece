import { Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <img src="/coca.ico" alt="Logo" className="h-10 w-10 rounded-full mr-2 bg-white" />
              <span>TechMart</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Vietnam's leading electronics store with high quality products and best service
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-primary transition" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-primary transition" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-primary transition" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Phone
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Laptop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  AirPod
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Phụ kiện
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>info@techmart.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>123 Nguyễn Văn Cơ, Q1, TP HCM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025 CODE COCATALIST. All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
