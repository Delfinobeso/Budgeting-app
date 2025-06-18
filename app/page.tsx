"use client"

import { useState, useEffect } from "react"
import { OnboardingSetup } from "@/components/onboarding-setup"
import { SimpleDashboard } from "@/components/simple-dashboard"
import type { BudgetData, Expense } from "@/types/budget"

export default function BudgetApp() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

      if (savedBudget) {
        const budget = JSON.parse(savedBudget)
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

  // Loading state - Consistent with app design
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-black text-xl font-bold mb-2">Caricamento...</div>
          <div className="text-gray-600">Caricamento dati budget...</div>
        </div>
      </div>
    )
  }

  // No budget data - Show onboarding
  if (!budgetData) {
    return <OnboardingSetup onComplete={handleOnboardingComplete} />
  }

  // Main dashboard
  return (
    <SimpleDashboard
      totalBudget={budgetData.totalBudget}
      categories={budgetData.categories}
      expenses={budgetData.expenses}
      onAddExpense={handleAddExpense}
      onReset={handleReset}
    />
  )
}
