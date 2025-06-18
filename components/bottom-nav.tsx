"use client"

import { Home, BarChart3, Plus } from "lucide-react"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onAddExpense: () => void
}

export function BottomNav({ activeTab, onTabChange, onAddExpense }: BottomNavProps) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "add", icon: Plus, label: "Aggiungi", isAction: true },
    { id: "stats", icon: BarChart3, label: "Statistiche" },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-black rounded-4xl px-8 py-3 shadow-2xl">
        <div className="flex items-center justify-center space-x-8">
          {/* Home button - left */}
          <button
            onClick={() => onTabChange("home")}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeTab === "home" ? "bg-white/20 scale-110" : "hover:bg-white/10"
            }`}
          >
            <Home className={`h-5 w-5 ${activeTab === "home" ? "text-white" : "text-white/60"}`} strokeWidth={2} />
          </button>

          {/* Add button - center */}
          <button
            onClick={onAddExpense}
            className="p-3 bg-white rounded-full transition-all duration-200 active:scale-90 hover:scale-110 shadow-lg"
          >
            <Plus className="h-5 w-5 text-black" strokeWidth={2.5} />
          </button>

          {/* Stats button - right */}
          <button
            onClick={() => onTabChange("stats")}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeTab === "stats" ? "bg-white/20 scale-110" : "hover:bg-white/10"
            }`}
          >
            <BarChart3
              className={`h-5 w-5 ${activeTab === "stats" ? "text-white" : "text-white/60"}`}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
