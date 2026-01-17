"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";

export default function CheckoutSuccessClient() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Payment successful</h1>
      <p className="mt-2 text-muted-foreground">
        Thanks! Your payment was received. You will get an email confirmation shortly.
      </p>
      <div className="mt-6 flex gap-3">
        <Link className="underline" href="/account">
          View account
        </Link>
        <Link className="underline" href="/">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
