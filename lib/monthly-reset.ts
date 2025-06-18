import type { BudgetData, MonthlyRecord, CategoryBalance, HistoricalData } from "@/types/budget"
import { calculateCategorySpending } from "./expense-utils"

const HISTORICAL_STORAGE_KEY = "mobius-historical-data"

// Controlla se è necessario un reset mensile
export function shouldResetBudget(budgetData: BudgetData): boolean {
  if (!budgetData.lastResetDate) {
    // Se non c'è mai stato un reset, controlla se siamo in un mese diverso dalla creazione
    const createdDate = new Date(budgetData.createdAt || Date.now())
    const now = new Date()
    return createdDate.getMonth() !== now.getMonth() || createdDate.getFullYear() !== now.getFullYear()
  }

  const lastReset = new Date(budgetData.lastResetDate)
  const now = new Date()

  // Reset se siamo in un mese diverso dall'ultimo reset
  return lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()
}

// Esegue il reset mensile e salva i dati storici
export function performMonthlyReset(budgetData: BudgetData): BudgetData {
  console.log("🔄 Performing monthly reset...")

  // Calcola i saldi delle categorie prima del reset
  const categoryBalances: CategoryBalance[] = budgetData.categories.map((category) => {
    const spending = calculateCategorySpending(category, budgetData.expenses, budgetData.totalBudget)

    return {
      categoryId: category.id,
      categoryName: category.name,
      budgetAllocated: spending.limit,
      totalSpent: spending.totalSpent,
      remainingBalance: spending.remaining, // Può essere negativo
      color: category.color,
      icon: category.icon,
      percentage: category.percentage,
    }
  })

  // Calcola totali
  const totalSpent = budgetData.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalRemaining = budgetData.totalBudget - totalSpent

  // Crea il record mensile
  const monthlyRecord: MonthlyRecord = {
    id: `record-${Date.now()}`,
    month: budgetData.month,
    year: budgetData.year,
    totalBudget: budgetData.totalBudget,
    totalSpent,
    totalRemaining,
    categoryBalances,
    resetDate: new Date().toISOString(),
    expenseCount: budgetData.expenses.length,
  }

  // Salva nel historical storage
  saveMonthlyRecord(monthlyRecord)

  // Aggiorna il budget per il nuovo mese
  const now = new Date()
  const resetBudget: BudgetData = {
    ...budgetData,
    expenses: [], // Cancella tutte le spese
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    lastResetDate: new Date().toISOString(),
  }

  console.log("✅ Monthly reset completed, historical data saved")
  return resetBudget
}

// Salva un record mensile nello storage storico
function saveMonthlyRecord(record: MonthlyRecord): void {
  try {
    const existingData = getHistoricalData()

    // Evita duplicati per lo stesso mese/anno
    const filteredRecords = existingData.monthlyRecords.filter(
      (r) => !(r.month === record.month && r.year === record.year),
    )

    const updatedRecords = [...filteredRecords, record].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })

    const historicalData: HistoricalData = {
      monthlyRecords: updatedRecords,
      ...calculateHistoricalStats(updatedRecords),
    }

    localStorage.setItem(HISTORICAL_STORAGE_KEY, JSON.stringify(historicalData))
    console.log("📊 Historical data updated")
  } catch (error) {
    console.error("❌ Error saving monthly record:", error)
  }
}

// Recupera i dati storici
export function getHistoricalData(): HistoricalData {
  try {
    const stored = localStorage.getItem(HISTORICAL_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("❌ Error loading historical data:", error)
  }

  // Ritorna dati vuoti se non ci sono dati storici
  return {
    monthlyRecords: [],
    totalSavedAllTime: 0,
    totalOverspentAllTime: 0,
    bestSavingMonth: null,
    worstOverspentMonth: null,
    averageMonthlyBalance: 0,
    lastUpdated: new Date().toISOString(),
  }
}

// Calcola statistiche aggregate dai record storici
function calculateHistoricalStats(records: MonthlyRecord[]): Omit<HistoricalData, "monthlyRecords"> {
  if (records.length === 0) {
    return {
      totalSavedAllTime: 0,
      totalOverspentAllTime: 0,
      bestSavingMonth: null,
      worstOverspentMonth: null,
      averageMonthlyBalance: 0,
      lastUpdated: new Date().toISOString(),
    }
  }

  const totalSavedAllTime = records.filter((r) => r.totalRemaining > 0).reduce((sum, r) => sum + r.totalRemaining, 0)

  const totalOverspentAllTime = Math.abs(
    records.filter((r) => r.totalRemaining < 0).reduce((sum, r) => sum + r.totalRemaining, 0),
  )

  const bestSavingMonth =
    records.filter((r) => r.totalRemaining > 0).sort((a, b) => b.totalRemaining - a.totalRemaining)[0] || null

  const worstOverspentMonth =
    records.filter((r) => r.totalRemaining < 0).sort((a, b) => a.totalRemaining - b.totalRemaining)[0] || null

  const averageMonthlyBalance = records.reduce((sum, r) => sum + r.totalRemaining, 0) / records.length

  return {
    totalSavedAllTime,
    totalOverspentAllTime,
    bestSavingMonth,
    worstOverspentMonth,
    averageMonthlyBalance,
    lastUpdated: new Date().toISOString(),
  }
}

// Utility per formattare mese/anno
export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1)
  return date.toLocaleDateString("it-IT", { month: "long", year: "numeric" })
}

// Utility per ottenere il colore basato sul saldo
export function getBalanceColor(balance: number): string {
  if (balance > 0) return "text-green-600"
  if (balance < 0) return "text-red-600"
  return "text-gray-600"
}

// Utility per ottenere il colore di sfondo basato sul saldo
export function getBalanceBackgroundColor(balance: number): string {
  if (balance > 0) return "bg-green-50 border-green-200"
  if (balance < 0) return "bg-red-50 border-red-200"
  return "bg-gray-50 border-gray-200"
}
