import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide transition-colors",
        {
          "border-primary/30 bg-primary/10 text-primary": variant === "default",
          "border-border bg-secondary text-secondary-foreground": variant === "secondary",
          "border-destructive/30 bg-destructive/10 text-destructive": variant === "destructive",
          "border-success/30 bg-success/10 text-success": variant === "success",
          "border-border text-muted-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
