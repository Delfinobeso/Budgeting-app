"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, AlertTriangle, Calendar } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/expense-utils"
import type { CategorySpending } from "@/types/budget"

interface SmartCategoryCardProps {
  categorySpending: CategorySpending
  categoryIcon: string
  isExpanded: boolean
  onToggleExpand: () => void
}

export function SmartCategoryCard({
  categorySpending,
  categoryIcon,
  isExpanded,
  onToggleExpand,
}: SmartCategoryCardProps) {
  const { categoryName, totalSpent, limit, remaining, isOverspent, overspentAmount, expenses } = categorySpending

  const spentPercentage = (totalSpent / limit) * 100
  const isAtRisk = spentPercentage > 80 && !isOverspent
  const recentExpenses = expenses.slice(-3)

  const getCardStyle = () => {
    if (isOverspent) return "bg-red-50 border-red-200 hover:shadow-lg"
    if (isAtRisk) return "bg-amber-50 border-amber-200 hover:shadow-md"
    return "bg-white hover:shadow-md"
  }

  const getProgressColor = () => {
    if (isOverspent) return "bg-red-500"
    if (isAtRisk) return "bg-amber-500"
    return "bg-green-500"
  }

  const getStatusBadge = () => {
    if (isOverspent)
      return {
        text: `Superato di ${formatCurrency(overspentAmount)}`,
        className: "bg-red-100 text-red-700 border-red-200",
      }
    if (isAtRisk)
      return {
        text: "Attenzione",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      }
    return {
      text: "OK",
      className: "bg-green-100 text-green-700 border-green-200",
    }
  }

  const statusBadge = getStatusBadge()

  return (
    <Card
      className={`rounded-2xl transition-all duration-200 cursor-pointer ${getCardStyle()}`}
      onClick={onToggleExpand}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <span className="text-xl">{categoryIcon}</span>
              {isOverspent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <div>
              <h4 className={`font-semibold ${isOverspent ? "text-red-800" : "text-black"}`}>{categoryName}</h4>
              <p className="text-xs text-gray-600">{expenses.length} transazioni</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={statusBadge.className} size="sm">
              {statusBadge.text}
            </Badge>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </div>
        </div>

        {/* Amounts */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className={`text-lg font-bold ${isOverspent ? "text-red-600" : "text-black"}`}>
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-xs text-gray-500">di {formatCurrency(limit)}</div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${isOverspent ? "text-red-600" : "text-green-600"}`}>
              {isOverspent ? `+${formatCurrency(overspentAmount)}` : formatCurrency(remaining)}
            </div>
            <div className="text-xs text-gray-500">{isOverspent ? "in eccesso" : "rimanente"}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${getProgressColor()}`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className={isOverspent ? "text-red-600" : "text-gray-600"}>
              {spentPercentage.toFixed(0)}% utilizzato
            </span>
            {isAtRisk && !isOverspent && (
              <div className="flex items-center text-amber-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span>Limite vicino</span>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fade-in">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Ultima spesa:</span>
                <div className="font-medium">
                  {expenses.length > 0 ? formatDate(expenses[expenses.length - 1].date) : "Nessuna spesa"}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Media per spesa:</span>
                <div className="font-medium">
                  {expenses.length > 0 ? formatCurrency(totalSpent / expenses.length) : "€0"}
                </div>
              </div>
            </div>

            {/* Recent Expenses */}
            {recentExpenses.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Spese recenti
                </h5>
                <div className="space-y-2">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium text-black">{expense.description || "Spesa generica"}</div>
                        <div className="text-xs text-gray-500">{formatDate(expense.date)}</div>
                      </div>
                      <div className="font-semibold text-red-500">-{formatCurrency(expense.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Suggestions */}
            {(isOverspent || isAtRisk) && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-1">💡 Suggerimento</h5>
                <p className="text-xs text-gray-600">
                  {isOverspent
                    ? "Considera di ridurre le spese in questa categoria per il resto del mese."
                    : "Stai raggiungendo il limite. Monitora attentamente le prossime spese."}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
