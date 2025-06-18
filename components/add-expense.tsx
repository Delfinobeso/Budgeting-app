"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category, Expense } from "@/types/budget"
import { X, Plus } from "lucide-react"

interface AddExpenseProps {
  categories: Category[]
  onAddExpense: (expense: Omit<Expense, "id">) => void
  onClose: () => void
}

export function AddExpense({ categories, onAddExpense, onClose }: AddExpenseProps) {
  const [amount, setAmount] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount && categoryId) {
      onAddExpense({
        amount: Number.parseFloat(amount),
        categoryId,
        description,
        date: new Date().toISOString(),
      })
      setAmount("")
      setCategoryId("")
      setDescription("")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans overflow-hidden">
      <Card className="w-full max-w-sm bg-white rounded-3xl shadow-2xl animate-scale-in border-0 max-h-[85vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-black truncate min-w-0 flex-1 mr-2">Nuova Spesa</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex-shrink-0"
          >
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-3 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block truncate">Importo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base flex-shrink-0">
                  €
                </span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 h-11 text-base border-2 border-gray-200 rounded-xl focus:border-black bg-white text-black w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block truncate">Categoria</label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="h-11 border-2 border-gray-200 rounded-xl focus:border-black bg-white text-black w-full">
                  <SelectValue placeholder="Seleziona categoria" className="truncate" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 rounded-xl max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="hover:bg-gray-50">
                      <div className="flex items-center space-x-2 min-w-0 w-full">
                        <span className="text-base flex-shrink-0">{category.icon}</span>
                        <span className="text-black truncate flex-1 min-w-0">{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block truncate">Descrizione</label>
              <Input
                placeholder="Descrizione (opzionale)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-11 border-2 border-gray-200 rounded-xl focus:border-black bg-white text-black w-full"
                maxLength={100}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11 bg-white border-2 border-gray-200 text-black rounded-xl hover:bg-gray-50 min-w-0"
              >
                <span className="truncate">Annulla</span>
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 active:scale-95 min-w-0"
              >
                <Plus className="mr-1 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Aggiungi</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
