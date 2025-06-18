"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CircularProgress } from "./circular-progress"
import { AddExpense } from "./add-expense"
import { BottomNav } from "./bottom-nav"
import type { Category, Expense } from "@/types/budget"
import {
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Target,
  DollarSign,
  Eye,
  EyeOff,
  ChevronRight,
  Zap,
  Shield,
  Clock,
  Settings,
} from "lucide-react"
import {
  calculateCategorySpending,
  calculateSpendingAnalytics,
  formatCurrency,
  formatDate,
  groupExpensesByDate,
} from "@/lib/expense-utils"

interface SimpleDashboardProps {
  totalBudget: number
  categories: Category[]
  expenses: Expense[]
  onAddExpense: (expense: Omit<Expense, "id">) => void
  onReset: () => void
}

export function SimpleDashboard({ totalBudget, categories, expenses, onAddExpense, onReset }: SimpleDashboardProps) {
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [isVisible, setIsVisible] = useState(false)
  const [showBudgetDetails, setShowBudgetDetails] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Calcoli avanzati con memoization per performance
  const analytics = useMemo(
    () => calculateSpendingAnalytics(categories, expenses, totalBudget),
    [categories, expenses, totalBudget],
  )

  const categorySpending = useMemo(
    () => categories.map((category) => calculateCategorySpending(category, expenses, totalBudget)),
    [categories, expenses, totalBudget],
  )

  const expensesByDate = useMemo(() => groupExpensesByDate(expenses), [expenses])

  // Priorità dei dati - informazioni critiche
  const criticalMetrics = {
    remainingBudget: analytics.totalBudget - analytics.totalSpent,
    spentPercentage: (analytics.totalSpent / analytics.totalBudget) * 100,
    isOverBudget: analytics.totalSpent > analytics.totalBudget,
    categoriesAtRisk: categorySpending.filter((cs) => cs.totalSpent > cs.limit * 0.8).length,
    urgentCategories: categorySpending.filter((cs) => cs.isOverspent),
  }

  const recentExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  // Determina lo stato del budget
  const getBudgetStatus = () => {
    if (criticalMetrics.isOverBudget) return { status: "danger", color: "red", message: "Budget superato" }
    if (criticalMetrics.spentPercentage > 80)
      return { status: "warning", color: "amber", message: "Attenzione al budget" }
    if (criticalMetrics.spentPercentage > 60)
      return { status: "caution", color: "yellow", message: "Budget sotto controllo" }
    return { status: "good", color: "green", message: "Budget in salute" }
  }

  const budgetStatus = getBudgetStatus()

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {activeTab === "home" && (
        <div className="p-4 md:p-6">
          {/* Header */}
          <div
            className={`flex items-center justify-between mb-6 pt-12 transform transition-all duration-800 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black">Il tuo Budget 💰</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBudgetDetails(!showBudgetDetails)}
                className="p-2 rounded-full"
              >
                {showBudgetDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={onReset} className="p-2 rounded-full">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="p-2 rounded-full">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sezione critica - Budget Overview */}
          <div
            className={`mb-6 transform transition-all duration-1000 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <Card
              className={`rounded-4xl shadow-xl p-6 border-2 ${
                criticalMetrics.isOverBudget
                  ? "bg-red-50 border-red-200"
                  : criticalMetrics.spentPercentage > 80
                    ? "bg-amber-50 border-amber-200"
                    : "bg-white border-gray-200"
              }`}
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  {/* Grafico principale */}
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <CircularProgress
                        percentage={Math.min(criticalMetrics.spentPercentage, 100)}
                        size={140}
                        strokeWidth={12}
                        color={
                          criticalMetrics.isOverBudget
                            ? "#ef4444"
                            : criticalMetrics.spentPercentage > 80
                              ? "#f59e0b"
                              : "#22c55e"
                        }
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-black">
                            {criticalMetrics.spentPercentage.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-600">Utilizzato</div>
                        </div>
                      </CircularProgress>
                    </div>

                    {showBudgetDetails && (
                      <div className="text-sm text-gray-600">
                        {formatCurrency(analytics.totalSpent)} di {formatCurrency(analytics.totalBudget)}
                      </div>
                    )}
                  </div>

                  {/* Metriche critiche */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Rimanente</span>
                      <span
                        className={`text-xl font-bold ${
                          criticalMetrics.remainingBudget < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {formatCurrency(Math.abs(criticalMetrics.remainingBudget))}
                        {criticalMetrics.remainingBudget < 0 && " in rosso"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Media giornaliera</span>
                      <span className="text-lg font-semibold text-black">{formatCurrency(analytics.dailyAverage)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Proiezione mensile</span>
                      <div className="text-right">
                        <span
                          className={`text-lg font-semibold ${
                            analytics.monthlyProjection > analytics.totalBudget ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {formatCurrency(analytics.monthlyProjection)}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          {analytics.weeklyTrend > 0 ? (
                            <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                          )}
                          {Math.abs(analytics.weeklyTrend).toFixed(0)}% vs settimana scorsa
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert critici */}
                {(criticalMetrics.isOverBudget || criticalMetrics.urgentCategories.length > 0) && (
                  <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-2xl">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-800 mb-1">Azione richiesta</h4>
                        <div className="text-sm text-red-700 space-y-1">
                          {criticalMetrics.isOverBudget && (
                            <p>
                              • Budget mensile superato di{" "}
                              {formatCurrency(analytics.totalSpent - analytics.totalBudget)}
                            </p>
                          )}
                          {criticalMetrics.urgentCategories.length > 0 && (
                            <p>• {criticalMetrics.urgentCategories.length} categorie hanno superato il limite</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Azioni rapide */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Button
              onClick={() => setShowAddExpense(true)}
              className="h-20 md:h-16 bg-black hover:bg-gray-800 text-white rounded-2xl flex flex-col items-center justify-center space-y-1 p-3"
            >
              <Zap className="h-5 w-5" />
              <span className="text-xs font-medium">Nuova Spesa</span>
            </Button>

            <Card className="h-20 md:h-16 p-2 md:p-3 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mb-1" />
                <div className="text-xs text-gray-600 leading-tight">Speso oggi</div>
                <div className="text-sm font-semibold leading-tight">
                  {formatCurrency(
                    expenses
                      .filter((e) => e.date === new Date().toISOString().split("T")[0])
                      .reduce((sum, e) => sum + e.amount, 0),
                  )}
                </div>
              </div>
            </Card>

            <Card className="h-20 md:h-16 p-2 md:p-3 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-green-500 mb-1" />
                <div className="text-xs text-gray-600 leading-tight">Obiettivo</div>
                <div className="text-sm font-semibold leading-tight">
                  {Math.max(
                    0,
                    Math.round(
                      (analytics.totalBudget - analytics.totalSpent) /
                        (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() -
                          new Date().getDate()),
                    ),
                  )}{" "}
                  €/gg
                </div>
              </div>
            </Card>

            <Card className="h-20 md:h-16 p-2 md:p-3 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-purple-500 mb-1" />
                <div className="text-xs text-gray-600 leading-tight">Categorie OK</div>
                <div className="text-sm font-semibold leading-tight">
                  {categories.length - criticalMetrics.categoriesAtRisk}/{categories.length}
                </div>
              </div>
            </Card>
          </div>

          {/* Categorie con priorità visiva */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">Categorie</h3>
              <span className="text-sm text-gray-500">{categories.length} categorie attive</span>
            </div>

            {/* Prima le categorie critiche */}
            {categorySpending
              .sort((a, b) => {
                // Priorità: prima quelle sforati, poi quelle a rischio, poi le altre
                if (a.isOverspent && !b.isOverspent) return -1
                if (!a.isOverspent && b.isOverspent) return 1
                if (a.totalSpent > a.limit * 0.8 && b.totalSpent <= b.limit * 0.8) return -1
                if (a.totalSpent <= a.limit * 0.8 && b.totalSpent > b.limit * 0.8) return 1
                return b.totalSpent - a.totalSpent
              })
              .map((cs, index) => {
                const category = categories.find((c) => c.id === cs.categoryId)
                if (!category) return null

                const isRisky = cs.totalSpent > cs.limit * 0.8
                const progressPercentage = Math.min((cs.totalSpent / cs.limit) * 100, 100)

                return (
                  <div
                    key={cs.categoryId}
                    className={`transform transition-all duration-1000 ${
                      isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                    }`}
                    style={{ transitionDelay: `${300 + index * 50}ms` }}
                  >
                    <Card
                      className={`rounded-2xl shadow-sm transition-all duration-200 cursor-pointer ${
                        cs.isOverspent
                          ? "bg-red-50 border-red-200 hover:shadow-lg"
                          : isRisky
                            ? "bg-amber-50 border-amber-200 hover:shadow-md"
                            : "bg-white hover:shadow-md"
                      } ${selectedCategory === cs.categoryId ? "ring-2 ring-black" : ""}`}
                      onClick={() => setSelectedCategory(selectedCategory === cs.categoryId ? null : cs.categoryId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{category.icon}</span>
                            <div>
                              <h4 className={`font-semibold ${cs.isOverspent ? "text-red-800" : "text-black"}`}>
                                {cs.categoryName}
                              </h4>
                              <p className="text-xs text-gray-600">{cs.expenses.length} transazioni</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center space-x-2">
                            <div>
                              <div className={`text-lg font-bold ${cs.isOverspent ? "text-red-600" : "text-black"}`}>
                                {formatCurrency(cs.totalSpent)}
                              </div>
                              <div className="text-xs text-gray-500">di {formatCurrency(cs.limit)}</div>
                            </div>
                            <ChevronRight
                              className={`h-4 w-4 text-gray-400 transition-transform ${
                                selectedCategory === cs.categoryId ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {/* Progress bar migliorata */}
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                                cs.isOverspent ? "bg-red-500" : isRisky ? "bg-amber-500" : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className={cs.isOverspent ? "text-red-600" : "text-gray-600"}>
                              {progressPercentage.toFixed(0)}% utilizzato
                            </span>
                            <Badge
                              size="sm"
                              className={`text-xs ${
                                cs.isOverspent
                                  ? "bg-red-100 text-red-700"
                                  : isRisky
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {cs.isOverspent ? `+${formatCurrency(cs.overspentAmount)}` : formatCurrency(cs.remaining)}
                            </Badge>
                          </div>
                        </div>

                        {/* Dettagli espandibili */}
                        {selectedCategory === cs.categoryId && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Ultima spesa:</span>
                                <div className="font-medium">
                                  {cs.expenses.length > 0
                                    ? formatDate(cs.expenses[cs.expenses.length - 1].date)
                                    : "Nessuna spesa"}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Media per spesa:</span>
                                <div className="font-medium">
                                  {cs.expenses.length > 0 ? formatCurrency(cs.totalSpent / cs.expenses.length) : "€0"}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
          </div>

          {/* Spese recenti con design migliorato */}
          {recentExpenses.length > 0 && (
            <Card className="rounded-3xl shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-black flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Attività Recente
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {recentExpenses.length} transazioni
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {recentExpenses.map((expense, index) => {
                    const category = categories.find((cat) => cat.id === expense.categoryId)
                    const categorySpend = categorySpending.find((cs) => cs.categoryId === expense.categoryId)

                    return (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <span className="text-lg">{category?.icon}</span>
                            {categorySpend?.isOverspent && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-black text-sm">
                              {expense.description || category?.name}
                            </div>
                            <div className="text-xs text-gray-600 flex items-center space-x-2">
                              <span>{formatDate(expense.date)}</span>
                              <span>•</span>
                              <span>{category?.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-500">-{formatCurrency(expense.amount)}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(expense.date).toLocaleTimeString("it-IT", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="p-6 pt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Analisi Dettagliata</h2>
          </div>

          {/* Statistiche avanzate con layout migliorato */}
          <div className="grid gap-6">
            {/* Proiezione mensile */}
            <Card className="rounded-3xl shadow-lg p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Proiezione Mensile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-black mb-2">{formatCurrency(analytics.monthlyProjection)}</div>
                <div className="text-sm text-gray-600 mb-4">Spesa prevista a fine mese</div>
                <div
                  className={`text-sm p-3 rounded-lg ${
                    analytics.monthlyProjection > analytics.totalBudget
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {analytics.monthlyProjection > analytics.totalBudget
                    ? `⚠️ Superamento previsto: ${formatCurrency(analytics.monthlyProjection - analytics.totalBudget)}`
                    : `✅ Risparmio previsto: ${formatCurrency(analytics.totalBudget - analytics.monthlyProjection)}`}
                </div>
              </CardContent>
            </Card>

            {/* Spese per data */}
            <Card className="rounded-3xl shadow-lg p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Cronologia Spese
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  {Object.entries(expensesByDate)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 10)
                    .map(([date, dayExpenses]) => {
                      const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                      const isToday = date === new Date().toISOString().split("T")[0]

                      return (
                        <div
                          key={date}
                          className={`flex justify-between items-center py-3 px-3 rounded-lg ${
                            isToday ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                          }`}
                        >
                          <div>
                            <div className="font-medium text-black">
                              {formatDate(date)}
                              {isToday && <Badge className="ml-2 text-xs bg-blue-100 text-blue-700">Oggi</Badge>}
                            </div>
                            <div className="text-sm text-gray-600">{dayExpenses.length} transazioni</div>
                          </div>
                          <div className="font-semibold text-black">{formatCurrency(dayTotal)}</div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
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
