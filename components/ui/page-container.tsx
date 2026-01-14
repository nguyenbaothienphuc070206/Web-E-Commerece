import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen bg-background py-8 px-4", className)}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}
