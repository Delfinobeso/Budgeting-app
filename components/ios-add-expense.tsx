"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category, Expense } from "@/types/budget"
import { X, Plus } from "lucide-react"

interface IOSAddExpenseProps {
  categories: Category[]
  onAddExpense: (expense: Omit<Expense, "id">) => void
  onClose: () => void
}

export function IOSAddExpense({ categories, onAddExpense, onClose }: IOSAddExpenseProps) {
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
    <div className="fixed inset-0 bg-black/60 ios-blur flex items-end justify-center z-50 font-sans">
      <Card className="w-full max-w-md ios-modal animate-slide-up border-0 max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-black ios-title">Nuova Spesa</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 rounded-full hover:bg-gray-100 haptic-light"
          >
            <X className="h-5 w-5 text-gray-600" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 ios-section-header">Importo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">
                  €
                </span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 h-14 text-lg ios-input border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black focus:ring-opacity-20"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 ios-section-header">Categoria</label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="h-14 ios-input border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black focus:ring-opacity-20">
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent className="ios-modal border-0 shadow-2xl">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="hover:bg-gray-50 h-14 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <span className="text-black font-medium">{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 ios-section-header">Descrizione</label>
              <Input
                placeholder="Descrizione (opzionale)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-14 ios-input border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black focus:ring-opacity-20"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-14 ios-button border-2 border-gray-200 text-black hover:bg-gray-50 haptic-light"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                className="flex-1 h-14 bg-black hover:bg-gray-800 text-white font-semibold ios-button haptic-medium"
              >
                <Plus className="mr-2 h-5 w-5" />
                Aggiungi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
