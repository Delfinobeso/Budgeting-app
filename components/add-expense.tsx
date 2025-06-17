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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 font-sans">
      <Card className="w-full max-w-md bg-white rounded-4xl shadow-2xl animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold text-black">Nuova Spesa</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Importo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">€</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 border-gray-200 rounded-2xl focus:border-black bg-white text-black"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Categoria</label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-2xl focus:border-black bg-white text-black">
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 rounded-2xl">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-black">{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Descrizione</label>
              <Input
                placeholder="Descrizione (opzionale)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-12 border-2 border-gray-200 rounded-2xl focus:border-black bg-white text-black"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 bg-white border-2 border-gray-200 text-black rounded-2xl hover:bg-gray-50"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-200 active:scale-95"
              >
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
