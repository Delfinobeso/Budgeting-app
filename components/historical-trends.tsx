"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, PiggyBank, AlertTriangle, ChevronLeft, ChevronRight, BarChart3, Target } from "lucide-react"
import type { HistoricalData } from "@/types/budget"
import { formatCurrency } from "@/lib/expense-utils"
import { formatMonthYear, getBalanceColor, getBalanceBackgroundColor } from "@/lib/monthly-reset"
import { useState } from "react"

interface HistoricalTrendsProps {
  historicalData: HistoricalData
}

export function HistoricalTrends({ historicalData }: HistoricalTrendsProps) {
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(
    historicalData.monthlyRecords.length > 0 ? historicalData.monthlyRecords.length - 1 : 0,
  )

  const records = historicalData.monthlyRecords
  const selectedRecord = records[selectedRecordIndex]

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev" && selectedRecordIndex > 0) {
      setSelectedRecordIndex(selectedRecordIndex - 1)
    } else if (direction === "next" && selectedRecordIndex < records.length - 1) {
      setSelectedRecordIndex(selectedRecordIndex + 1)
    }
  }

  if (records.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="rounded-3xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-black mb-2">Nessun Dato Storico</h3>
          <p className="text-gray-600">
            I dati storici verranno generati automaticamente alla fine di ogni mese. Continua a utilizzare l'app per
            vedere i tuoi progressi nel tempo!
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistiche Generali */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`p-4 rounded-2xl ${getBalanceBackgroundColor(historicalData.totalSavedAllTime)}`}>
          <div className="text-center">
            <PiggyBank className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-lg font-bold text-green-600">{formatCurrency(historicalData.totalSavedAllTime)}</div>
            <div className="text-xs text-green-700">Totale Risparmiato</div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl ${getBalanceBackgroundColor(-historicalData.totalOverspentAllTime)}`}>
          <div className="text-center">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-600" />
            <div className="text-lg font-bold text-red-600">{formatCurrency(historicalData.totalOverspentAllTime)}</div>
            <div className="text-xs text-red-700">Totale Sforato</div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl ${getBalanceBackgroundColor(historicalData.averageMonthlyBalance)}`}>
          <div className="text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className={`text-lg font-bold ${getBalanceColor(historicalData.averageMonthlyBalance)}`}>
              {formatCurrency(historicalData.averageMonthlyBalance)}
            </div>
            <div className="text-xs text-blue-700">Media Mensile</div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-purple-50 border-purple-200">
          <div className="text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-lg font-bold text-purple-600">{records.length}</div>
            <div className="text-xs text-purple-700">Mesi Tracciati</div>
          </div>
        </Card>
      </div>

      {/* Navigazione Mese Specifico */}
      {selectedRecord && (
        <Card className="rounded-3xl shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-black">Dettaglio Mensile</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  disabled={selectedRecordIndex === 0}
                  className="p-2 rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Badge variant="secondary" className="px-3 py-1">
                  {formatMonthYear(selectedRecord.month, selectedRecord.year)}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  disabled={selectedRecordIndex === records.length - 1}
                  className="p-2 rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Riepilogo Mese */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{formatCurrency(selectedRecord.totalBudget)}</div>
                <div className="text-sm text-gray-600">Budget Totale</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{formatCurrency(selectedRecord.totalSpent)}</div>
                <div className="text-sm text-gray-600">Speso</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getBalanceColor(selectedRecord.totalRemaining)}`}>
                  {formatCurrency(Math.abs(selectedRecord.totalRemaining))}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedRecord.totalRemaining >= 0 ? "Risparmiato" : "Sforato"}
                </div>
              </div>
            </div>

            {/* Saldi per Categoria */}
            <div className="space-y-3">
              <h4 className="font-semibold text-black">Saldi per Categoria</h4>
              {selectedRecord.categoryBalances.map((balance) => (
                <Card
                  key={balance.categoryId}
                  className={`p-4 rounded-2xl ${getBalanceBackgroundColor(balance.remainingBalance)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{balance.icon}</span>
                      <div>
                        <div className="font-medium text-black">{balance.categoryName}</div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(balance.totalSpent)} di {formatCurrency(balance.budgetAllocated)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getBalanceColor(balance.remainingBalance)}`}>
                        {balance.remainingBalance >= 0 ? "+" : ""}
                        {formatCurrency(balance.remainingBalance)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((balance.totalSpent / balance.budgetAllocated) * 100).toFixed(0)}% utilizzato
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Statistiche Aggiuntive */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg font-bold text-black">{selectedRecord.expenseCount}</div>
                <div className="text-sm text-gray-600">Transazioni</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-black">
                  {selectedRecord.categoryBalances.filter((c) => c.remainingBalance < 0).length}
                </div>
                <div className="text-sm text-gray-600">Categorie Sforati</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Completa */}
      <Card className="rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Timeline Completa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {records
              .slice()
              .reverse()
              .map((record, index) => (
                <div
                  key={record.id}
                  className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedRecordIndex === records.length - 1 - index
                      ? "ring-2 ring-black bg-gray-50"
                      : "hover:bg-gray-50"
                  } ${getBalanceBackgroundColor(record.totalRemaining)}`}
                  onClick={() => setSelectedRecordIndex(records.length - 1 - index)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${record.totalRemaining >= 0 ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <div>
                      <div className="font-medium text-black">{formatMonthYear(record.month, record.year)}</div>
                      <div className="text-sm text-gray-600">{record.expenseCount} transazioni</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getBalanceColor(record.totalRemaining)}`}>
                      {record.totalRemaining >= 0 ? "+" : ""}
                      {formatCurrency(record.totalRemaining)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((record.totalSpent / record.totalBudget) * 100).toFixed(0)}% speso
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
