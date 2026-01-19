"use client"

import { Loader2 } from "lucide-react"
import GoogleIcon from "./google-icon"
import GithubIcon from "./github-icon"
import FacebookIcon from "./facebook-icon"
import AppleIcon from "./apple-icon"

interface OAuthButtonProps {
  provider: "google" | "github" | "facebook" | "apple"
  isLoading: boolean
  onClick: () => void
}

export default function OAuthButton({ provider, isLoading, onClick }: OAuthButtonProps) {
  const handleOAuthClick = () => {
    onClick()
    window.location.href = `/api/auth/${provider}`
  }

  const getProviderInfo = () => {
    switch (provider) {
      case "google":
        return {
          name: "Google",
          icon: GoogleIcon,
          color: "hover:bg-secondary/50",
        }
      case "github":
        return {
          name: "GitHub",
          icon: GithubIcon,
          color: "hover:bg-secondary/50",
        }
      case "facebook":
        return {
          name: "Facebook",
          icon: FacebookIcon,
          color: "hover:bg-blue-50 dark:hover:bg-blue-950/20",
        }
      case "apple":
        return {
          name: "Apple",
          icon: AppleIcon,
          color: "hover:bg-secondary/50",
        }
      default:
        return {
          name: "Provider",
          icon: GoogleIcon,
          color: "hover:bg-secondary/50",
        }
    }
  }

  const { name, icon: Icon, color } = getProviderInfo()

  return (
    <button
      onClick={handleOAuthClick}
      disabled={isLoading}
      className={`w-full py-2.5 px-4 border border-border rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${color} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Icon className="h-4 w-4" />
          Continue with {name}
        </>
      )}
    </button>
  )
}
