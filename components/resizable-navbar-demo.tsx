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
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import React from "react";
export default function NavbarDemo() {
  const navItems = [
    { name: "Home", link: "#" },
    { name: "Products", link: "#" },
    { name: "Brand", link: "#" },
    { name: "Discounts", link: "#" },
    { name: "Contact", link: "#" },
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
          <div className="flex items-center gap-8">
            {/* Search Bar */}
            <div className="hidden md:flex items-center justify-center ml-16 z-10" style={{ minWidth: 48 }}>
              <button
                className="p-2 rounded-full hover:bg-black/30 transition"
                onClick={() => setShowSearchInput(true)}
                aria-label="Show search input"
                tabIndex={0}
              >
                <Search className="w-5 h-5 text-foreground" />
              </button>
            </div>
            {/* Wishlist */}
            <div className="relative hidden sm:block">
              <span className="w-5 h-5"><Heart /></span>
              <span className="absolute -top-3 -right-2 bg-destructive text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
            </div>
            {/* Cart */}
            <div className="relative hidden sm:block">
              <span className="w-5 h-5"><ShoppingCart /></span>
              <span className="absolute -top-3 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center text-white">2</span>
            </div>
            <NavbarButton className="hidden sm:inline-flex bg-primary hover:bg-accent text-primary-foreground">
                <span className="mr-2"><User className="w-5 h-5"/></span>
                Login
            </NavbarButton>
          </div>
  <AnimatePresence>
    {showSearchInput && (
      <motion.div
        key="search-popup"
        initial={{ scale: 0.5, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-1/2 top-[80px] z-[100] -translate-x-1/2 w-full max-w-md px-4"
      >
        <div className="bg-background rounded-xl shadow-lg border border-primary/20 flex items-center px-4 py-2">
          <Search className="w-5 h-5 text-foreground mr-2" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground flex-1"
            onBlur={() => setShowSearchInput(false)}
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
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
