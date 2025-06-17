"use client"

import { useState, useEffect } from "react"
import { OnboardingSetup } from "@/components/onboarding-setup"
import { Dashboard } from "@/components/dashboard"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/hooks/use-auth"
import { createBudget, getCurrentBudget } from "@/lib/actions/budget-actions"
import { createExpense, getExpensesByBudget } from "@/lib/actions/expense-actions"
import type { BudgetData, Expense } from "@/types/budget"

export default function BudgetApp() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carica il budget corrente quando l'utente è autenticato
  useEffect(() => {
    if (user) {
      loadCurrentBudget()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const loadCurrentBudget = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const budgetResult = await getCurrentBudget(user.id)

      if (budgetResult.success && budgetResult.budget) {
        const dbBudget = budgetResult.budget

        // Carica le spese per questo budget
        const expensesResult = await getExpensesByBudget(dbBudget.id)
        const expenses = expensesResult.success ? expensesResult.expenses || [] : []

        // Converti dal formato database al formato app
        const budgetData: BudgetData = {
          id: dbBudget.id.toString(),
          userId: dbBudget.user_id.toString(),
          totalBudget: dbBudget.total_amount,
          categories: dbBudget.categories_json,
          expenses: expenses.map((exp) => ({
            id: exp.id.toString(),
            amount: exp.amount,
            categoryId: exp.category,
            description: exp.description || "",
            date: exp.date,
            userId: exp.user_id.toString(),
            budgetId: exp.budget_id.toString(),
          })),
          month: dbBudget.month,
          year: dbBudget.year,
          createdAt: dbBudget.created_at,
        }

        setBudgetData(budgetData)
      } else {
        // Nessun budget corrente trovato
        setBudgetData(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il caricamento del budget")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnboardingComplete = async (newBudgetData: BudgetData) => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await createBudget({
        user_id: user.id,
        total_amount: newBudgetData.totalBudget,
        categories_json: newBudgetData.categories,
        month: newBudgetData.month,
        year: newBudgetData.year,
      })

      if (result.success && result.budget) {
        const budgetData: BudgetData = {
          id: result.budget.id.toString(),
          userId: result.budget.user_id.toString(),
          totalBudget: result.budget.total_amount,
          categories: result.budget.categories_json,
          expenses: [],
          month: result.budget.month,
          year: result.budget.year,
          createdAt: result.budget.created_at,
        }

        setBudgetData(budgetData)
      } else {
        setError(result.error || "Errore durante la creazione del budget")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante la creazione del budget")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddExpense = async (expenseData: Omit<Expense, "id">) => {
    if (!user || !budgetData) return

    try {
      const result = await createExpense({
        user_id: user.id,
        budget_id: Number.parseInt(budgetData.id!),
        amount: expenseData.amount,
        category: expenseData.categoryId,
        description: expenseData.description,
        date: expenseData.date,
      })

      if (result.success && result.expense) {
        const newExpense: Expense = {
          id: result.expense.id.toString(),
          amount: result.expense.amount,
          categoryId: result.expense.category,
          description: result.expense.description || "",
          date: result.expense.date,
          userId: result.expense.user_id.toString(),
          budgetId: result.expense.budget_id.toString(),
        }

        setBudgetData((prev) =>
          prev
            ? {
                ...prev,
                expenses: [...prev.expenses, newExpense],
              }
            : null,
        )
      } else {
        setError(result.error || "Errore durante l'aggiunta della spesa")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'aggiunta della spesa")
    }
  }

  const handleReset = () => {
    setBudgetData(null)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg font-medium">Caricamento...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-400 text-lg font-medium mb-4">Errore</div>
          <div className="text-white mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100"
          >
            Riprova
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
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
