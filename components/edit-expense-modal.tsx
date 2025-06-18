"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Save, Calendar } from "lucide-react"
import type { Category, Expense } from "@/lib/types"

interface EditExpenseModalProps {
  expense: Expense
  categories: Category[]
  onUpdateExpense: (expenseId: string, updates: Partial<Expense>) => void
  onClose: () => void
}

export function EditExpenseModal({ expense, categories, onUpdateExpense, onClose }: EditExpenseModalProps) {
  const [amount, setAmount] = useState(expense.amount.toString())
  const [description, setDescription] = useState(expense.description)
  const [categoryId, setCategoryId] = useState(expense.categoryId)
  const [date, setDate] = useState(expense.date)
  const [isLoading, setIsLoading] = useState(false)

  const selectedCategory = categories.find((cat) => cat.id === categoryId)

  const handleSave = async () => {
    if (!amount || !categoryId || !date) return

    setIsLoading(true)

    try {
      const updates: Partial<Expense> = {
        amount: Number.parseFloat(amount),
        description: description.trim(),
        categoryId,
        date,
      }

      onUpdateExpense(expense.id, updates)
      onClose()
    } catch (error) {
      console.error("Error updating expense:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = amount && !isNaN(Number.parseFloat(amount)) && Number.parseFloat(amount) > 0 && categoryId && date

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4 ios-safe-area">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border-0 ios-card-shadow animate-slide-up">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-black">Modifica Spesa</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Importo *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg font-semibold ios-input"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Categoria *</Label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    categoryId === category.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-xs font-medium text-gray-700 truncate">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descrizione
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="ios-input resize-none"
              placeholder="Aggiungi una descrizione..."
              rows={3}
            />
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Data *
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 ios-input"
              />
            </div>
          </div>

          {/* Selected Category Preview */}
          {selectedCategory && (
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{selectedCategory.icon}</span>
                <span className="text-sm font-medium text-gray-700">{selectedCategory.name}</span>
                <span className="text-xs text-gray-500">• {selectedCategory.percentage}% del budget</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 ios-button" disabled={isLoading}>
              Annulla
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid || isLoading}
              className="flex-1 bg-black hover:bg-gray-800 text-white ios-button"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salva Modifiche
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
