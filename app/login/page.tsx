"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import AuthForm from "@/components/auth/auth-form"
import OAuthButton from "@/components/auth/oauth-button"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    if (error) {
      // Show error notification
      console.error('OAuth error:', error)
      // You can add a toast notification here
    }
  }, [error])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center pt-20 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {mode === "login" ? "Welcome Back" : "Get Started"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Create an account to get started"}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm">
              Authentication failed. Please try again.
            </div>
          )}

          {/* Form */}
          <AuthForm mode={mode} setIsLoading={setIsLoading} />

          {/* Mode Toggle */}
          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-primary font-semibold hover:underline transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-primary font-semibold hover:underline transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* OAuth Section */}
          <div className="space-y-3">
            <OAuthButton provider="google" isLoading={false} onClick={() => {}} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>By continuing, you agree to our</p>
          <div className="flex gap-4 justify-center mt-2">
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}