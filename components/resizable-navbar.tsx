"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Search, User, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import React from "react";

// Add user prop type
type NavbarDemoProps = {
  user: { id: string; email: string; name?: string; role: string } | null;
};

export default function NavbarDemo({ user }: NavbarDemoProps) {
  const { items } = useCart();
  const { items: w } = useWishlist();
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/products" },
    { name: "Brands", link: "/brands" },
    { name: "Discounts", link: "/discounts" },
    { name: "Contact", link: "/contact" },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearchInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchInput]);

  return (
    <div className="relative w-full z-50">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center justify-center ml-16 z-10" style={{ minWidth: 48 }}>
              <button
                className="p-2 rounded-full hover:bg-black/10 transition"
                onClick={() => setShowSearchInput(true)}
                aria-label="Show search input"
                tabIndex={0}
              >
                <Search className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <a href="/wishlist" className="relative hidden sm:block" aria-label="Wishlist">
              <span className="w-5 h-5 inline-flex"><Heart /></span>
              <span className="absolute -top-3 -right-2 bg-destructive text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">{w.length}</span>
            </a>
            <a href="/cart" className="relative hidden sm:block" aria-label="Cart">
              <span className="w-5 h-5 inline-flex"><ShoppingCart /></span>
              <span className="absolute -top-3 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </a>
            
            {/* CHECK IF USER IS LOGGED IN */}
            {user ? (
              <a href="/account">
                <NavbarButton className="hidden sm:inline-flex bg-primary hover:bg-accent text-primary-foreground">
                  <span className="mr-2"><User className="w-5 h-5"/></span>
                  Welcome, {user.name?.split(' ').pop() || user.email.split('@')[0]} !
                </NavbarButton>
              </a>
            ) : (
              <a href="/login">
                <NavbarButton className="hidden sm:inline-flex bg-primary hover:bg-accent text-primary-foreground">
                  <span className="mr-2"><User className="w-5 h-5"/></span>
                  Login
                </NavbarButton>
              </a>
            )}
          </div>
          
          <AnimatePresence>
            {showSearchInput && (
              <motion.div
                key="search-popup"
                initial={{ scale: 0.5, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-1/2 top-20 z-100 -translate-x-1/2 w-full max-w-md px-4"
              >
                <div className="bg-background rounded-xl shadow-lg border border-primary/80 flex items-center px-4 py-2">
                  <Search className="w-5 h-5 text-foreground mr-2" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for products..."
                    className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground flex-1"
                    onBlur={() => (false)}
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </NavBody>
        
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            />
            <div className="flex w-full flex-col gap-4 mt-2">
              {user ? (
                <a href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarButton variant="primary" className="w-full">
                    Welcome, {user.name?.split(' ').pop() || user.email.split('@')[0]} !
                  </NavbarButton>
                </a>
              ) : (
                <a href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarButton variant="primary" className="w-full">
                    Login
                  </NavbarButton>
                </a>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}