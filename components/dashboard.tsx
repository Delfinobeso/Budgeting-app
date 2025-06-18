"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgress } from "./circular-progress"
import { AddExpense } from "./add-expense"
import { BottomNav } from "./bottom-nav"
import type { Category, Expense } from "@/types/budget"
import { RotateCcw, TrendingUp, Calendar } from "lucide-react"

interface DashboardProps {
  totalBudget: number
  categories: Category[]
  expenses: Expense[]
  onAddExpense: (expense: Omit<Expense, "id">) => void
  onReset: () => void
}

export function Dashboard({ totalBudget, categories, expenses, onAddExpense, onReset }: DashboardProps) {
  // Validazione e conversione dei dati
  const safeTotalBudget =
    typeof totalBudget === "number" ? totalBudget : Number.parseFloat(totalBudget?.toString() || "0")
  const safeExpenses = expenses.map((expense) => ({
    ...expense,
    amount: typeof expense.amount === "number" ? expense.amount : Number.parseFloat(expense.amount?.toString() || "0"),
  }))

  console.log("📊 Dashboard data validation:", {
    originalTotalBudget: totalBudget,
    safeTotalBudget,
    totalBudgetType: typeof totalBudget,
    expensesCount: expenses.length,
  })

  const [showAddExpense, setShowAddExpense] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const totalSpent = safeExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = safeTotalBudget - totalSpent
  const spentPercentage = safeTotalBudget > 0 ? (totalSpent / safeTotalBudget) * 100 : 0

  const categoriesWithSpent = categories.map((category) => {
    const categoryExpenses = safeExpenses.filter((expense) => expense.categoryId === category.id)
    const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const budgetForCategory = (safeTotalBudget * category.percentage) / 100
    const spentPercentage = budgetForCategory > 0 ? (spent / budgetForCategory) * 100 : 0

    return {
      ...category,
      spent,
      budgetForCategory,
      spentPercentage: Math.min(spentPercentage, 100),
    }
  })

  const recentExpenses = safeExpenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const thisWeekExpenses = safeExpenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return expenseDate >= weekAgo
  })

  const weeklySpent = thisWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {activeTab === "home" && (
        <div className="p-6">
          {/* Header */}
          <div
            className={`flex items-center justify-between mb-8 pt-12 transform transition-all duration-800 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div>
              <h1 className="text-3xl font-bold text-black">Budget</h1>
              <p className="text-gray-600">Gestisci le tue finanze</p>
            </div>
            <button
              onClick={onReset}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <RotateCcw className="h-5 w-5 text-gray-700" strokeWidth={2} />
            </button>
          </div>

          {/* Hero Card - Budget Overview */}
          <div
            className={`mb-8 transform transition-all duration-1000 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <Card className="bg-white rounded-4xl shadow-xl p-8 hover:scale-105 transition-all duration-300">
              <CardContent className="p-0 text-center">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-600">Budget Mensile</span>
                </div>

                <div className="flex justify-center mb-6">
                  <CircularProgress percentage={spentPercentage} size={140} strokeWidth={12}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black">€{totalSpent.toFixed(0)}</div>
                      <div className="text-sm text-gray-600">di €{safeTotalBudget.toFixed(0)}</div>
                    </div>
                  </CircularProgress>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">€{remainingBudget.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Rimanente</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{spentPercentage.toFixed(0)}%</div>
                    <div className="text-sm text-gray-600">Speso</div>
                  </div>
                </div>

                {/* Mini chart bars */}
                <div className="flex justify-center space-x-1 mt-6">
                  {[40, 60, 30, 80, 50, 70, 45].map((height, index) => (
                    <div key={index} className="w-2 bg-gray-300 rounded-full" style={{ height: `${height / 2}px` }} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <div className="space-y-4 mb-8">
            {categoriesWithSpent.map((category, index) => (
              <div
                key={category.id}
                className={`transform transition-all duration-1000 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <Card className="bg-white rounded-3xl shadow-lg p-6 hover:scale-102 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h3 className="font-semibold text-black">{category.name}</h3>
                          <p className="text-sm text-gray-600">
                            €{category.spent.toFixed(0)} / €{category.budgetForCategory.toFixed(0)}
                          </p>
                        </div>
                      </div>
                      <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                        {category.spentPercentage.toFixed(0)}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(category.spentPercentage, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Weekly Summary */}
          <div
            className={`mb-8 transform transition-all duration-1000 delay-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <Card className="bg-black rounded-3xl shadow-xl p-6 text-white hover:scale-102 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6" />
                    <div>
                      <h3 className="font-semibold">Questa Settimana</h3>
                      <p className="text-sm text-gray-400">{thisWeekExpenses.length} transazioni</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">€{weeklySpent.toFixed(0)}</div>
                    <div className="text-sm text-gray-400">Speso</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">+12% rispetto alla scorsa settimana</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Expenses */}
          {recentExpenses.length > 0 && (
            <div
              className={`transform transition-all duration-1000 delay-900 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
            >
              <Card className="bg-white rounded-3xl shadow-lg p-6 hover:scale-102 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <h3 className="font-semibold text-black mb-4">Spese Recenti</h3>
                  <div className="space-y-3">
                    {recentExpenses.map((expense) => {
                      const category = categories.find((cat) => cat.id === expense.categoryId)
                      return (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{category?.icon}</span>
                            <div>
                              <div className="font-medium text-black">{expense.description || category?.name}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(expense.date).toLocaleDateString("it-IT")}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-red-500">-€{expense.amount.toFixed(2)}</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="p-6 pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Statistiche</h2>
            <p className="text-gray-600">Funzionalità in arrivo...</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAddExpense={() => setShowAddExpense(true)} />

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpense categories={categories} onAddExpense={onAddExpense} onClose={() => setShowAddExpense(false)} />
      )}
    </div>
  )
}
