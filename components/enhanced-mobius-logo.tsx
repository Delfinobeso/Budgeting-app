"use client"

import { MobiusLogo } from "./mobius-logo"

interface EnhancedMobiusLogoProps {
  size?: number
  className?: string
  color?: string
  showText?: boolean
  variant?: "default" | "compact" | "icon-only"
}

export function EnhancedMobiusLogo({
  size = 32,
  className = "",
  color = "#161616",
  showText = false,
  variant = "default",
}: EnhancedMobiusLogoProps) {
  if (variant === "icon-only") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <MobiusLogo size={size} color={color} />
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <MobiusLogo size={size} color={color} />
        {showText && <span className="font-bold text-lg tracking-tight text-black">Mobius</span>}
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <MobiusLogo size={size} color={color} />
        {/* Subtle glow effect for brand recognition */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-sm"
          style={{
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            transform: "scale(1.2)",
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-black leading-none">Mobius</span>
          <span className="text-xs text-gray-600 tracking-wide uppercase">Budget</span>
        </div>
      )}
    </div>
  )
}
