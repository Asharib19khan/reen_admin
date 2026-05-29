import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "success"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-[0_0_20px_var(--glow)]": variant === "default",
            "border border-border bg-card/50 hover:border-primary/30 hover:bg-accent/60 hover:text-foreground": variant === "outline",
            "hover:bg-accent/60 hover:text-foreground": variant === "ghost",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "bg-destructive/90 text-destructive-foreground hover:bg-destructive": variant === "destructive",
            "bg-success/90 text-success-foreground hover:bg-success": variant === "success",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
