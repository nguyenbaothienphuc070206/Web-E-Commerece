"use client";

import { useState } from "react";

export default function AccountClient({ signedIn }: { signedIn: boolean }) {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  if (!signedIn) {
    return (
      <div className="flex gap-2">
        <a className="underline" href="/login">
          Sign in
        </a>
      </div>
    );
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="h-11 rounded-md bg-primary px-4 text-primary-foreground disabled:opacity-50"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
