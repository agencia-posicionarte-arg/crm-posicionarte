import { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "ghost" | "danger"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: "sm" | "md"
}

const variants: Record<Variant, string> = {
  primary: "cta-gradient text-white hover:opacity-90",
  secondary: "bg-surface-container-high border border-outline-variant/20 text-white hover:bg-surface-container-highest",
  ghost: "text-neutral-400 hover:text-white hover:bg-neutral-800/50",
  danger: "bg-error-container/20 text-error hover:bg-error-container/40",
}

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn("font-bold tracking-tight transition-all disabled:opacity-50 flex items-center gap-2", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
