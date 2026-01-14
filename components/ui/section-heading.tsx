import { ReactNode } from "react"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function SectionHeading({ title, subtitle, action, className = "" }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
