export interface Category {
  id: string
  name: string
  percentage: number
  color: string
  icon: string
  spent?: number
  budget?: number
  limit?: number // Limite di spesa per la categoria
  isOverspent?: boolean // Indica se ha superato il limite
  overspentAmount?: number // Importo di overspending
}

export interface Expense {
  id: string
  amount: number
  categoryId: string
  description: string
  date: string // Data in formato YYYY-MM-DD
  userId?: string
  budgetId?: string
  createdAt?: string // Timestamp di creazione
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
  lastResetDate?: string // Data dell'ultimo reset mensile
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

// Nuovi tipi per il tracking avanzato
export interface DateRange {
  startDate: string
  endDate: string
}

export interface ExpensesByDate {
  [date: string]: Expense[]
}

export interface CategorySpending {
  categoryId: string
  categoryName: string
  totalSpent: number
  limit: number
  remaining: number
  isOverspent: boolean
  overspentAmount: number
  expenses: Expense[]
  dailySpending: { [date: string]: number }
}

export interface SpendingAnalytics {
  totalSpent: number
  totalBudget: number
  totalLimit: number
  categoriesOverspent: number
  dailyAverage: number
  weeklyTrend: number
  monthlyProjection: number
}

// Nuovi tipi per lo storico mensile
export interface CategoryBalance {
  categoryId: string
  categoryName: string
  budgetAllocated: number
  totalSpent: number
  remainingBalance: number // Può essere negativo se overspent
  color: string
  icon: string
  percentage: number
}

export interface MonthlyRecord {
  id: string
  month: number
  year: number
  totalBudget: number
  totalSpent: number
  totalRemaining: number // Può essere negativo
  categoryBalances: CategoryBalance[]
  resetDate: string
  expenseCount: number
}

export interface HistoricalData {
  monthlyRecords: MonthlyRecord[]
  totalSavedAllTime: number
  totalOverspentAllTime: number
  bestSavingMonth: MonthlyRecord | null
  worstOverspentMonth: MonthlyRecord | null
  averageMonthlyBalance: number
  lastUpdated: string
}
