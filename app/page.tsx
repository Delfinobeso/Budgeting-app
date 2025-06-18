"use client"

import { useState, useEffect } from "react"
import { EnhancedOnboarding } from "@/components/enhanced-onboarding"
import { IOSOptimizedDashboard } from "@/components/ios-optimized-dashboard"
import type { BudgetData, Expense, HistoricalData } from "@/types/budget"
import { shouldResetBudget, performMonthlyReset, getHistoricalData } from "@/lib/monthly-reset"

export default function BudgetApp() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null)

  console.log("🚀 App State:", {
    hasBudget: !!budgetData,
    isLoading,
  })

  // Carica budget salvato al mount
  useEffect(() => {
    loadBudgetData()
  }, [])

  const loadBudgetData = () => {
    setIsLoading(true)
    try {
      const savedBudget = localStorage.getItem("budget-app-data")
      const historical = getHistoricalData()
      setHistoricalData(historical)

      if (savedBudget) {
        let budget = JSON.parse(savedBudget)

        // Controlla se è necessario un reset mensile
        if (shouldResetBudget(budget)) {
          console.log("🔄 Monthly reset required")
          budget = performMonthlyReset(budget)
          localStorage.setItem("budget-app-data", JSON.stringify(budget))
          // Ricarica i dati storici dopo il reset
          setHistoricalData(getHistoricalData())
        }

        setBudgetData(budget)
        console.log("✅ Budget loaded from localStorage")
      } else {
        console.log("📝 No budget found in localStorage")
        setBudgetData(null)
      }
    } catch (error) {
      console.error("❌ Error loading budget:", error)
      localStorage.removeItem("budget-app-data")
      setBudgetData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnboardingComplete = (newBudgetData: BudgetData) => {
    const budgetWithMetadata = {
      ...newBudgetData,
      id: `budget-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("budget-app-data", JSON.stringify(budgetWithMetadata))
    setBudgetData(budgetWithMetadata)
    console.log("✅ Budget created and saved locally")
  }

  const handleAddExpense = (expenseData: Omit<Expense, "id">) => {
    if (!budgetData) return

    const newExpense: Expense = {
      ...expenseData,
      id: `expense-${Date.now()}`,
      amount:
        typeof expenseData.amount === "number" ? expenseData.amount : Number.parseFloat(expenseData.amount.toString()),
    }

    const updatedBudget = {
      ...budgetData,
      expenses: [...budgetData.expenses, newExpense],
    }

    localStorage.setItem("budget-app-data", JSON.stringify(updatedBudget))
    setBudgetData(updatedBudget)
    console.log("✅ Expense added and saved locally")
  }

  const handleReset = () => {
    localStorage.removeItem("budget-app-data")
    setBudgetData(null)
    console.log("🔄 Budget reset - localStorage cleared")
  }

  // iOS-style loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans ios-safe-area">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-black text-xl font-bold mb-2 ios-title">Mobius</div>
          <div className="text-gray-600 ios-body">Caricamento...</div>
        </div>
      </div>
    )
  }

  // No budget data - Show onboarding
  if (!budgetData) {
    return <EnhancedOnboarding onComplete={handleOnboardingComplete} />
  }

  // Main iOS-optimized dashboard
  return (
    <IOSOptimizedDashboard
      totalBudget={budgetData.totalBudget}
      categories={budgetData.categories}
      expenses={budgetData.expenses}
      onAddExpense={handleAddExpense}
      onReset={handleReset}
      historicalData={historicalData}
    />
  )
}
