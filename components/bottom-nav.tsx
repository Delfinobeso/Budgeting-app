"use client"

import { Home, BarChart3, Plus, Settings } from "lucide-react"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onAddExpense: () => void
}

export function BottomNav({ activeTab, onTabChange, onAddExpense }: BottomNavProps) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "stats", icon: BarChart3, label: "Statistiche" },
    { id: "add", icon: Plus, label: "Aggiungi", isAction: true },
    { id: "settings", icon: Settings, label: "Impostazioni" },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-black rounded-4xl px-6 py-3 shadow-2xl">
        <div className="flex items-center space-x-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            if (tab.isAction) {
              return (
                <button
                  key={tab.id}
                  onClick={onAddExpense}
                  className="p-3 bg-white rounded-full transition-all duration-200 active:scale-90 hover:scale-110 shadow-lg"
                >
                  <Icon className="h-5 w-5 text-black" strokeWidth={2.5} />
                </button>
              )
            }

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isActive ? "bg-white/20 scale-110" : "hover:bg-white/10"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-white/60"}`} strokeWidth={2} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
