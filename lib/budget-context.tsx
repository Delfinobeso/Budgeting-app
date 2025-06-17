"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Budget, BudgetContextType, Expense } from "./types"

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [isOnboarded, setIsOnboarded] = useState(false)

  useEffect(() => {
    const savedBudget = localStorage.getItem("budget")
    const savedOnboarded = localStorage.getItem("isOnboarded")

    if (savedBudget) {
      setBudget(JSON.parse(savedBudget))
    }
    if (savedOnboarded) {
      setIsOnboarded(JSON.parse(savedOnboarded))
    }
  }, [])

  const updateBudget = (newBudget: Budget) => {
    setBudget(newBudget)
    localStorage.setItem("budget", JSON.stringify(newBudget))
  }

  const addExpense = (expense: Omit<Expense, "id">) => {
    if (!budget) return

    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }

    const updatedBudget = {
      ...budget,
      expenses: [...budget.expenses, newExpense],
    }

    updateBudget(updatedBudget)
  }

  const updateIsOnboarded = (value: boolean) => {
    setIsOnboarded(value)
    localStorage.setItem("isOnboarded", JSON.stringify(value))
  }

  return (
    <BudgetContext.Provider
      value={{
        budget,
        setBudget: updateBudget,
        addExpense,
        isOnboarded,
        setIsOnboarded: updateIsOnboarded,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const context = useContext(BudgetContext)
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider")
  }
  return context
}
