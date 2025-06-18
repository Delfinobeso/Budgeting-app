import type { Category, Expense, CategorySpending, SpendingAnalytics, DateRange } from "@/types/budget"

// Utility per gestire le date in modo sicuro
function safeGetDateString(dateInput: string | Date | null | undefined): string {
  if (!dateInput) {
    return new Date().toISOString().split("T")[0] // Data corrente come fallback
  }

  if (typeof dateInput === "string") {
    // Se è già una stringa, assicuriamoci che sia nel formato corretto
    if (dateInput.includes("T")) {
      return dateInput.split("T")[0]
    }
    return dateInput
  }

  if (dateInput instanceof Date) {
    return dateInput.toISOString().split("T")[0]
  }

  // Fallback alla data corrente
  return new Date().toISOString().split("T")[0]
}

// Utility per validare e convertire gli importi
function safeGetAmount(amount: any): number {
  if (typeof amount === "number" && !isNaN(amount)) {
    return amount
  }
  if (typeof amount === "string") {
    const parsed = Number.parseFloat(amount)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

// Utility per validare le spese
function validateExpense(expense: any): expense is Expense {
  return (
    expense &&
    typeof expense === "object" &&
    expense.id &&
    expense.categoryId &&
    (typeof expense.amount === "number" || typeof expense.amount === "string")
  )
}

export function calculateCategorySpending(
  category: Category,
  expenses: Expense[],
  totalBudget: number,
): CategorySpending {
  console.log("Calculating spending for category:", category.name, "with expenses:", expenses.length)

  // Validazione e filtro delle spese
  const validExpenses = expenses.filter(validateExpense)
  const categoryExpenses = validExpenses.filter((expense) => expense.categoryId === category.id)

  console.log("Valid category expenses:", categoryExpenses.length)

  const totalSpent = categoryExpenses.reduce((sum, expense) => {
    const amount = safeGetAmount(expense.amount)
    console.log("Processing expense amount:", expense.amount, "-> safe amount:", amount)
    return sum + amount
  }, 0)

  // Calcola il budget per questa categoria basato sulla percentuale
  const safeTotalBudget = safeGetAmount(totalBudget)
  const safePercentage = safeGetAmount(category.percentage)
  const categoryBudget = (safeTotalBudget * safePercentage) / 100

  // Il limite può essere personalizzato o uguale al budget
  const limit = category.limit ? safeGetAmount(category.limit) : categoryBudget

  const remaining = limit - totalSpent
  const isOverspent = totalSpent > limit
  const overspentAmount = isOverspent ? totalSpent - limit : 0

  // Calcola spesa giornaliera con gestione sicura delle date
  const dailySpending: { [date: string]: number } = {}
  categoryExpenses.forEach((expense) => {
    try {
      const dateString = safeGetDateString(expense.date)
      const amount = safeGetAmount(expense.amount)
      dailySpending[dateString] = (dailySpending[dateString] || 0) + amount
    } catch (error) {
      console.warn("Error processing expense date:", expense, error)
    }
  })

  return {
    categoryId: category.id,
    categoryName: category.name,
    totalSpent,
    limit,
    remaining,
    isOverspent,
    overspentAmount,
    expenses: categoryExpenses,
    dailySpending,
  }
}

export function calculateSpendingAnalytics(
  categories: Category[],
  expenses: Expense[],
  totalBudget: number,
): SpendingAnalytics {
  console.log("Calculating spending analytics with:", {
    categories: categories.length,
    expenses: expenses.length,
    totalBudget,
  })

  // Validazione delle spese
  const validExpenses = expenses.filter(validateExpense)

  const totalSpent = validExpenses.reduce((sum, expense) => {
    return sum + safeGetAmount(expense.amount)
  }, 0)

  const safeTotalBudget = safeGetAmount(totalBudget)

  const totalLimit = categories.reduce((sum, category) => {
    const safePercentage = safeGetAmount(category.percentage)
    const categoryBudget = (safeTotalBudget * safePercentage) / 100
    const limit = category.limit ? safeGetAmount(category.limit) : categoryBudget
    return sum + limit
  }, 0)

  const categoriesOverspent = categories.filter((category) => {
    const spending = calculateCategorySpending(category, validExpenses, safeTotalBudget)
    return spending.isOverspent
  }).length

  // Calcola media giornaliera (ultimi 30 giorni) con gestione sicura delle date
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentExpenses = validExpenses.filter((expense) => {
    try {
      const expenseDate = new Date(safeGetDateString(expense.date))
      return expenseDate >= thirtyDaysAgo
    } catch (error) {
      console.warn("Error filtering recent expenses:", expense, error)
      return false
    }
  })

  const dailyAverage =
    recentExpenses.length > 0 ? recentExpenses.reduce((sum, expense) => sum + safeGetAmount(expense.amount), 0) / 30 : 0

  // Calcola trend settimanale con gestione sicura delle date
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const thisWeekExpenses = validExpenses.filter((expense) => {
    try {
      const expenseDate = new Date(safeGetDateString(expense.date))
      return expenseDate >= oneWeekAgo
    } catch (error) {
      return false
    }
  })

  const lastWeekExpenses = validExpenses.filter((expense) => {
    try {
      const expenseDate = new Date(safeGetDateString(expense.date))
      return expenseDate >= twoWeeksAgo && expenseDate < oneWeekAgo
    } catch (error) {
      return false
    }
  })

  const thisWeekTotal = thisWeekExpenses.reduce((sum, expense) => sum + safeGetAmount(expense.amount), 0)
  const lastWeekTotal = lastWeekExpenses.reduce((sum, expense) => sum + safeGetAmount(expense.amount), 0)

  const weeklyTrend = lastWeekTotal > 0 ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 : 0

  // Proiezione mensile basata sulla spesa corrente
  const currentDate = new Date()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const daysPassed = currentDate.getDate()

  const monthlyProjection = daysPassed > 0 ? (totalSpent / daysPassed) * daysInMonth : 0

  return {
    totalSpent,
    totalBudget: safeTotalBudget,
    totalLimit,
    categoriesOverspent,
    dailyAverage,
    weeklyTrend,
    monthlyProjection,
  }
}

export function getExpensesByDateRange(expenses: Expense[], dateRange: DateRange): Expense[] {
  return expenses.filter((expense) => {
    try {
      const expenseDate = safeGetDateString(expense.date)
      return expenseDate >= dateRange.startDate && expenseDate <= dateRange.endDate
    } catch (error) {
      console.warn("Error filtering expenses by date range:", expense, error)
      return false
    }
  })
}

export function groupExpensesByDate(expenses: Expense[]): { [date: string]: Expense[] } {
  return expenses.reduce(
    (groups, expense) => {
      try {
        const date = safeGetDateString(expense.date)
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(expense)
      } catch (error) {
        console.warn("Error grouping expense by date:", expense, error)
      }
      return groups
    },
    {} as { [date: string]: Expense[] },
  )
}

export function formatCurrency(amount: number | string | null | undefined): string {
  const safeAmount = safeGetAmount(amount)
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(safeAmount)
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  try {
    const dateString = safeGetDateString(dateInput)
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch (error) {
    console.warn("Error formatting date:", dateInput, error)
    return new Date().toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }
}

export function getDateRangeForCurrentMonth(): DateRange {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const startDate = new Date(year, month, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0]

  return { startDate, endDate }
}

// Utility per creare una spesa con data corretta
export function createExpenseWithDate(expense: Omit<Expense, "id" | "date"> & { date?: string }): Omit<Expense, "id"> {
  return {
    ...expense,
    date: expense.date || new Date().toISOString(),
    amount: safeGetAmount(expense.amount),
  }
}
