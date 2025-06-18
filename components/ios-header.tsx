"use client"

import { Button } from "@/components/ui/button"
import { EnhancedMobiusLogo } from "./enhanced-mobius-logo"
import { Eye, EyeOff, Settings } from "lucide-react"

interface IOSHeaderProps {
  title?: string
  subtitle?: string
  showBudgetDetails: boolean
  onToggleBudgetDetails: () => void
  onShowSettings: () => void
  isVisible: boolean
  triggerHaptic: (type: "light" | "medium" | "heavy") => void
}

export function IOSHeader({
  title = "Budget",
  subtitle,
  showBudgetDetails,
  onToggleBudgetDetails,
  onShowSettings,
  isVisible,
  triggerHaptic,
}: IOSHeaderProps) {
  const defaultSubtitle = new Date().toLocaleDateString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })

  return (
    <div className="ios-header-blur border-b border-gray-100/50 sticky top-0 z-40">
      <div className="ios-header-container px-4">
        <div
          className={`w-full transform transition-all duration-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo and Title Section - Optimized for notch */}
            <div className="flex items-center space-x-3 flex-1 min-w-0 ios-logo-safe">
              <div className="flex-shrink-0">
                <EnhancedMobiusLogo size={28} variant="compact" className="drop-shadow-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-xl text-black truncate leading-tight">{title}</h1>
                <p className="text-sm text-gray-600 truncate leading-tight">{subtitle || defaultSubtitle}</p>
              </div>
            </div>

            {/* Action Buttons - Positioned to avoid notch */}
            <div className="flex items-center space-x-2 flex-shrink-0 ios-header-actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  triggerHaptic("light")
                  onToggleBudgetDetails()
                }}
                className="w-9 h-9 rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 active:scale-95"
              >
                {showBudgetDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  triggerHaptic("light")
                  onShowSettings()
                }}
                className="w-9 h-9 rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 active:scale-95"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
