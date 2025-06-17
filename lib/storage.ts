import type { BudgetData } from "@/types/budget"

const STORAGE_KEY = "budget-app-data"

export const saveBudgetData = (data: BudgetData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export const loadBudgetData = (): BudgetData | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export const clearBudgetData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
