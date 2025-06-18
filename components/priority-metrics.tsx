"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, TrendingDown, Target, Shield } from "lucide-react"
import { formatCurrency } from "@/lib/expense-utils"

interface PriorityMetricsProps {
  totalBudget: number
  totalSpent: number
  dailyAverage: number
  weeklyTrend: number
  categoriesOverspent: number
  totalCategories: number
}

export function PriorityMetrics({
  totalBudget,
  totalSpent,
  dailyAverage,
  weeklyTrend,
  categoriesOverspent,
  totalCategories,
}: PriorityMetricsProps) {
  const remainingBudget = totalBudget - totalSpent
  const spentPercentage = (totalSpent / totalBudget) * 100
  const isOverBudget = totalSpent > totalBudget
  const isAtRisk = spentPercentage > 80

  const getBudgetStatus = () => {
    if (isOverBudget)
      return {
        status: "critical",
        color: "red",
        icon: AlertTriangle,
        message: "Budget superato",
      }
    if (isAtRisk)
      return {
        status: "warning",
        color: "amber",
        icon: AlertTriangle,
        message: "Attenzione",
      }
    return {
      status: "good",
      color: "green",
      icon: Shield,
      message: "Sotto controllo",
    }
  }

  const budgetStatus = getBudgetStatus()
  const StatusIcon = budgetStatus.icon

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Stato Budget Principale */}
      <Card
        className={`col-span-1 md:col-span-2 p-6 rounded-3xl border-2 ${
          isOverBudget
            ? "bg-red-50 border-red-200"
            : isAtRisk
              ? "bg-amber-50 border-amber-200"
              : "bg-green-50 border-green-200"
        }`}
      >
        <CardContent className="p-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <StatusIcon className={`h-5 w-5 text-${budgetStatus.color}-600`} />
                <Badge
                  className={`bg-${budgetStatus.color}-100 text-${budgetStatus.color}-800 border-${budgetStatus.color}-200`}
                >
                  {budgetStatus.message}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-black">Budget Status</h3>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${isOverBudget ? "text-red-600" : "text-black"}`}>
                {spentPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">utilizzato</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Rimanente</span>
              <span className={`font-bold ${remainingBudget < 0 ? "text-red-600" : "text-green-600"}`}>
                {remainingBudget < 0 ? "-" : ""}
                {formatCurrency(Math.abs(remainingBudget))}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Speso</span>
              <span className="font-bold text-black">{formatCurrency(totalSpent)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metriche Rapide */}
      <div className="space-y-4">
        <Card className="p-4 rounded-2xl">
          <CardContent className="p-0 text-center">
            <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-black">{formatCurrency(dailyAverage)}</div>
            <div className="text-xs text-gray-600">Media giornaliera</div>
          </CardContent>
        </Card>

        <Card className="p-4 rounded-2xl">
          <CardContent className="p-0 text-center">
            <div className="flex items-center justify-center mb-2">
              {weeklyTrend > 0 ? (
                <TrendingUp className="h-6 w-6 text-red-500" />
              ) : (
                <TrendingDown className="h-6 w-6 text-green-500" />
              )}
            </div>
            <div className={`text-lg font-bold ${weeklyTrend > 0 ? "text-red-600" : "text-green-600"}`}>
              {weeklyTrend > 0 ? "+" : ""}
              {weeklyTrend.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Trend settimanale</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
