"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CircularProgress } from "./circular-progress"
import { AddExpense } from "./add-expense"
import { BottomNav } from "./bottom-nav"
import { ExpenseItem } from "./expense-item"
import { EditExpenseModal } from "./edit-expense-modal"
import type { Category, Expense } from "@/lib/types"
import { Calendar, AlertTriangle, Target, DollarSign, Eye, EyeOff, ChevronRight, Zap, Settings } from "lucide-react"
import {
  calculateCategorySpending,
  calculateSpendingAnalytics,
  formatCurrency,
  formatDate,
  groupExpensesByDate,
} from "@/lib/expense-utils"
import { SettingsModal } from "./settings-modal"
import { HistoricalTrends } from "./historical-trends"
import { PWAInstallPrompt } from "./pwa-install-prompt"
import type { HistoricalData } from "@/types/budget"

interface IOSOptimizedDashboardProps {
  totalBudget: number
  categories: Category[]
  expenses: Expense[]
  onAddExpense: (expense: Omit<Expense, "id">) => void
  onUpdateExpense: (expenseId: string, updates: Partial<Expense>) => void
  onDeleteExpense: (expenseId: string) => void
  onReset: () => void
  historicalData: HistoricalData | null
}

export function IOSOptimizedDashboard({
  totalBudget,
  categories,
  expenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onReset,
  historicalData,
}: IOSOptimizedDashboardProps) {
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [isVisible, setIsVisible] = useState(false)
  const [showBudgetDetails, setShowBudgetDetails] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  useEffect(() => {
    setIsVisible(true)

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    }
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

  // Haptic feedback simulation for iOS
  const triggerHaptic = (type: "light" | "medium" | "heavy" = "light") => {
    if ("vibrate" in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      }
      navigator.vibrate(patterns[type])
    }
  }

  const handleAddExpenseClick = () => {
    triggerHaptic("medium")
    setShowAddExpense(true)
  }

  const handleCategoryClick = (categoryId: string) => {
    triggerHaptic("light")
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
  }

  const handleEditExpense = (expense: Expense) => {
    triggerHaptic("medium")
    setEditingExpense(expense)
  }

  const handleDeleteExpense = (expenseId: string) => {
    triggerHaptic("heavy")
    onDeleteExpense(expenseId)
  }

  const handleUpdateExpense = (expenseId: string, updates: Partial<Expense>) => {
    triggerHaptic("medium")
    onUpdateExpense(expenseId, updates)
    setEditingExpense(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans ios-safe-area">
      {activeTab === "home" && (
        <div className="px-4 pt-2 pb-24">
          {/* iOS-style status bar spacing */}
          <div className="status-bar-spacing" />

          {/* iOS-optimized Header with Safe Area - Aligned with Apple UI Guidelines */}
          <div className="ios-safe-top bg-white/95 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-40">
            <div
              className={`px-4 pb-2 pt-1 transform transition-all duration-800 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              {/* Status bar spacer for notch */}
              <div className="h-2" />

              {/* Clean, typography-focused header following iOS guidelines */}
              <div className="flex flex-col">
                <h1 className="text-[34px] font-bold leading-tight tracking-tight text-black">Mobius</h1>
                <div className="flex items-center justify-between">
                  <p className="text-[17px] text-gray-600 font-medium">
                    {new Date().toLocaleDateString("it-IT", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>

                  {/* Action Buttons - positioned to avoid notch */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        triggerHaptic("light")
                        setShowBudgetDetails(!showBudgetDetails)
                      }}
                      className="w-9 h-9 rounded-full ios-button haptic-light bg-transparent hover:bg-gray-100/80"
                    >
                      {showBudgetDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        triggerHaptic("light")
                        setShowSettings(true)
                      }}
                      className="w-9 h-9 rounded-full ios-button haptic-light bg-transparent hover:bg-gray-100/80"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* iOS-style Budget Overview Card */}
          <div
            className={`mb-6 transform transition-all duration-1000 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <Card
              className={`ios-card-shadow border-0 ${
                criticalMetrics.isOverBudget
                  ? "bg-red-50"
                  : criticalMetrics.spentPercentage > 80
                    ? "bg-amber-50"
                    : "bg-white"
              }`}
              style={{ borderRadius: "20px" }}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 items-center">
                  {/* Grafico principale */}
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <CircularProgress
                        percentage={Math.min(criticalMetrics.spentPercentage, 100)}
                        size={120}
                        strokeWidth={8}
                        color={
                          criticalMetrics.isOverBudget
                            ? "#ef4444"
                            : criticalMetrics.spentPercentage > 80
                              ? "#f59e0b"
                              : "#22c55e"
                        }
                      >
                        <div className="text-center">
                          <div className="text-xl font-bold text-black">
                            {criticalMetrics.spentPercentage.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-600">Utilizzato</div>
                        </div>
                      </CircularProgress>
                    </div>

                    {showBudgetDetails && (
                      <div className="text-sm text-gray-600 mb-4">
                        {formatCurrency(analytics.totalSpent)} di {formatCurrency(analytics.totalBudget)}
                      </div>
                    )}
                  </div>

                  {/* Metriche in formato iOS */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-2xl">
                      <div
                        className={`text-2xl font-bold ${
                          criticalMetrics.remainingBudget < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        €{Math.abs(criticalMetrics.remainingBudget).toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {criticalMetrics.remainingBudget < 0 ? "In rosso" : "Rimanente"}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-2xl">
                      <div className="text-2xl font-bold text-black">
                        {analytics.dailyAverage > 0 ? formatCurrency(analytics.dailyAverage) : "€0"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Media/giorno</div>
                    </div>
                  </div>
                </div>

                {/* Alert critici in stile iOS */}
                {(criticalMetrics.isOverBudget || criticalMetrics.urgentCategories.length > 0) && (
                  <div className="mt-6 p-4 bg-red-100 rounded-2xl border border-red-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-800 mb-1">Attenzione</h4>
                        <div className="text-sm text-red-700 space-y-1">
                          {criticalMetrics.isOverBudget && (
                            <p>Budget superato di {formatCurrency(analytics.totalSpent - analytics.totalBudget)}</p>
                          )}
                          {criticalMetrics.urgentCategories.length > 0 && (
                            <p>{criticalMetrics.urgentCategories.length} categorie oltre il limite</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* iOS-style Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              onClick={handleAddExpenseClick}
              className="h-20 bg-black hover:bg-gray-800 text-white ios-button haptic-medium flex flex-col items-center justify-center space-y-1 p-4"
            >
              <Zap className="h-6 w-6" />
              <span className="text-sm font-medium">Nuova Spesa</span>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Card className="h-20 p-3 ios-list-item cursor-pointer haptic-light transition-transform active:scale-95">
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <DollarSign className="h-5 w-5 text-blue-500 mb-1" />
                  <div className="text-xs text-gray-600 leading-tight">Oggi</div>
                  <div className="text-sm font-semibold leading-tight">
                    {formatCurrency(
                      expenses
                        .filter((e) => e.date === new Date().toISOString().split("T")[0])
                        .reduce((sum, e) => sum + e.amount, 0),
                    )}
                  </div>
                </div>
              </Card>

              <Card className="h-20 p-3 ios-list-item cursor-pointer haptic-light transition-transform active:scale-95">
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Target className="h-5 w-5 text-green-500 mb-1" />
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
            </div>
          </div>

          {/* iOS-style Section Header */}
          <div className="mb-4">
            <h2 className="ios-section-header">Categorie</h2>
          </div>

          {/* iOS-style Categories List */}
          <div className="space-y-3 mb-6">
            {categorySpending
              .sort((a, b) => {
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
                      className={`ios-list-item cursor-pointer transition-all duration-200 active:scale-98 ${
                        cs.isOverspent ? "bg-red-50 border-red-200" : isRisky ? "bg-amber-50 border-amber-200" : ""
                      } ${selectedCategory === cs.categoryId ? "ring-2 ring-black ring-opacity-20" : ""}`}
                      onClick={() => handleCategoryClick(cs.categoryId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">{category.icon}</span>
                            </div>
                            <div>
                              <h4
                                className={`font-semibold ios-body ${cs.isOverspent ? "text-red-800" : "text-black"}`}
                              >
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

                        {/* iOS-style Progress Bar */}
                        <div className="space-y-2">
                          <div className="ios-progress">
                            <div
                              className={`ios-progress-fill ${
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
                              className={`text-xs border-0 ${
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

          {/* iOS-style Recent Activity with Edit/Delete functionality */}
          {recentExpenses.length > 0 && (
            <div className="mb-6">
              <h2 className="ios-section-header mb-4">Attività Recente</h2>
              <div className="space-y-2">
                {recentExpenses.map((expense, index) => {
                  const category = categories.find((cat) => cat.id === expense.categoryId)
                  const categorySpend = categorySpending.find((cs) => cs.categoryId === expense.categoryId)

                  return (
                    <div
                      key={expense.id}
                      className={`transform transition-all duration-1000 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                      }`}
                      style={{ transitionDelay: `${600 + index * 100}ms` }}
                    >
                      <ExpenseItem
                        expense={expense}
                        category={category}
                        onEdit={handleEditExpense}
                        onDelete={handleDeleteExpense}
                        isOverspent={categorySpend?.isOverspent}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="px-4 pb-24">
          <div className="status-bar-spacing" />
          <div className="pt-4 mb-8">
            <h1 className="ios-large-title text-black mb-2">Analisi</h1>
            <p className="ios-body text-gray-600">I tuoi progressi nel tempo</p>
          </div>

          {historicalData ? (
            <HistoricalTrends historicalData={historicalData} />
          ) : (
            <Card className="ios-list-item p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2 ios-title">Caricamento Dati</h3>
              <p className="text-gray-600 ios-body">Preparazione dell'analisi...</p>
            </Card>
          )}
        </div>
      )}

      {/* iOS-style Bottom Navigation */}
      <div className="ios-safe-bottom">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAddExpense={handleAddExpenseClick} />
      </div>

      {/* iOS-style Modals */}
      {showAddExpense && (
        <AddExpense categories={categories} onAddExpense={onAddExpense} onClose={() => setShowAddExpense(false)} />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onReset={onReset}
          totalBudget={totalBudget}
          categories={categories}
          expenses={expenses}
        />
      )}

      {/* Edit Expense Modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          categories={categories}
          onUpdateExpense={handleUpdateExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  )
}
