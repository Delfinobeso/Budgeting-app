export interface Category {
  id: string
  name: string
  percentage: number
  color: string
  icon: string
}

export interface Expense {
  id: string
  amount: number
  categoryId: string
  description: string
  date: string
}

export interface Budget {
  totalBudget: number
  categories: Category[]
  expenses: Expense[]
}

export interface BudgetContextType {
  budget: Budget | null
  setBudget: (budget: Budget) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  updateExpense: (expenseId: string, updatedExpense: Partial<Expense>) => void
  deleteExpense: (expenseId: string) => void
  isOnboarded: boolean
  setIsOnboarded: (value: boolean) => void
}
