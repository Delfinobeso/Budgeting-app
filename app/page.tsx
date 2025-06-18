"use client"

import { useState, useEffect } from "react"
import { OnboardingSetup } from "@/components/onboarding-setup"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { UnifiedAuthForm } from "@/components/unified-auth-form"
import { useAuthSystem } from "@/hooks/use-auth-system"
import type { BudgetData, Expense } from "@/types/budget"

export default function BudgetApp() {
  const {
    user,
    isLoading: authLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    avatarCharacters,
    avatarBackgrounds,
  } = useAuthSystem()

  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  console.log("🚀 App State:", {
    user: user?.email,
    isAuthenticated,
    authLoading,
    hasBudget: !!budgetData,
  })

  // Carica budget quando l'utente è autenticato
  useEffect(() => {
    if (user && isAuthenticated) {
      loadUserBudget()
    } else {
      setBudgetData(null)
    }
  }, [user, isAuthenticated])

  const loadUserBudget = () => {
    if (!user) return

    setIsLoading(true)
    try {
      const budgetKey = `budget-data-${user.id}`
      const savedBudget = localStorage.getItem(budgetKey)

      if (savedBudget) {
        const budget = JSON.parse(savedBudget)
        setBudgetData(budget)
        console.log("✅ Budget loaded for user:", user.email)
      } else {
        console.log("📝 No budget found for user:", user.email)
        setBudgetData(null)
      }
    } catch (error) {
      console.error("❌ Error loading budget:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnboardingComplete = (newBudgetData: BudgetData) => {
    if (!user) return

    const budgetWithUser = {
      ...newBudgetData,
      userId: user.id,
      id: `budget-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    const budgetKey = `budget-data-${user.id}`
    localStorage.setItem(budgetKey, JSON.stringify(budgetWithUser))
    setBudgetData(budgetWithUser)
    console.log("✅ Budget created for user:", user.email)
  }

  const handleAddExpense = (expenseData: Omit<Expense, "id">) => {
    if (!user || !budgetData) return

    const newExpense: Expense = {
      ...expenseData,
      id: `expense-${Date.now()}`,
      userId: user.id,
      amount:
        typeof expenseData.amount === "number" ? expenseData.amount : Number.parseFloat(expenseData.amount.toString()),
    }

    const updatedBudget = {
      ...budgetData,
      expenses: [...budgetData.expenses, newExpense],
    }

    const budgetKey = `budget-data-${user.id}`
    localStorage.setItem(budgetKey, JSON.stringify(updatedBudget))
    setBudgetData(updatedBudget)
    console.log("✅ Expense added for user:", user.email)
  }

  const handleReset = () => {
    if (!user) return

    const budgetKey = `budget-data-${user.id}`
    localStorage.removeItem(budgetKey)
    setBudgetData(null)
    console.log("🔄 Budget reset for user:", user.email)
  }

  const handleLogout = () => {
    console.log("🔐 Initiating logout process...")
    setBudgetData(null)
    logout() // This will clear session data and redirect
  }

  // Loading state - Consistent with app design
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-black text-xl font-bold mb-2">Caricamento...</div>
          <div className="text-gray-600">{authLoading ? "Verifica autenticazione..." : "Caricamento dati..."}</div>
        </div>
      </div>
    )
  }

  // Not authenticated - Show unified auth form
  if (!isAuthenticated || !user) {
    return <UnifiedAuthForm onLogin={login} onRegister={register} />
  }

  // No budget data - Show onboarding
  if (!budgetData) {
    return <OnboardingSetup onComplete={handleOnboardingComplete} />
  }

  // Main dashboard with user profile
  return (
    <EnhancedDashboard
      totalBudget={budgetData.totalBudget}
      categories={budgetData.categories}
      expenses={budgetData.expenses}
      onAddExpense={handleAddExpense}
      onReset={handleReset}
      user={user}
      onLogout={handleLogout}
      onUpdateProfile={updateProfile}
      avatarCharacters={avatarCharacters}
      avatarBackgrounds={avatarBackgrounds}
    />
  )
}
