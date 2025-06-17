"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { OnboardingSetup } from "@/components/onboarding-setup"
import { Dashboard } from "@/components/dashboard"
import { saveBudgetData, loadBudgetData, clearBudgetData } from "@/lib/storage"
import type { BudgetData, Expense } from "@/types/budget"

export default function BudgetApp() {
  const { data: session, status } = useSession()
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      const data = loadBudgetData()
      setBudgetData(data)
      setIsLoading(false)
    } else if (status === "loading") {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [status])

  const handleOnboardingComplete = (newBudgetData: BudgetData) => {
    // Aggiungi l'ID utente ai dati del budget
    const budgetWithUser = {
      ...newBudgetData,
      userId: session?.user?.id,
    }
    setBudgetData(budgetWithUser)
    saveBudgetData(budgetWithUser)
  }

  const handleAddExpense = (expenseData: Omit<Expense, "id">) => {
    if (!budgetData) return

    const newExpense: Expense = {
      ...expenseData,
      id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: session?.user?.id,
    }

    const updatedBudgetData = {
      ...budgetData,
      expenses: [...budgetData.expenses, newExpense],
    }

    setBudgetData(updatedBudgetData)
    saveBudgetData(updatedBudgetData)
  }

  const handleReset = () => {
    clearBudgetData()
    setBudgetData(null)
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium">Caricamento...</div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    // Il middleware si occuperà del redirect
    return null
  }

  if (!budgetData) {
    return <OnboardingSetup onComplete={handleOnboardingComplete} />
  }

  return (
    <Dashboard
      totalBudget={budgetData.totalBudget}
      categories={budgetData.categories}
      expenses={budgetData.expenses}
      onAddExpense={handleAddExpense}
      onReset={handleReset}
    />
  )
}
