export interface Category {
  id: string
  name: string
  percentage: number
  color: string
  icon: string
  spent?: number
  budget?: number
}

export interface Expense {
  id: string
  amount: number
  categoryId: string
  description: string
  date: string
  userId?: string
  budgetId?: string
}

export interface BudgetData {
  id?: string
  userId?: string
  totalBudget: number
  categories: Category[]
  expenses: Expense[]
  month: number
  year: number
  createdAt?: string
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}
