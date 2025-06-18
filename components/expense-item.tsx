"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit3, Trash2, MoreHorizontal } from "lucide-react"
import type { Category, Expense } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/expense-utils"

interface ExpenseItemProps {
  expense: Expense
  category?: Category
  onEdit: (expense: Expense) => void
  onDelete: (expenseId: string) => void
  isOverspent?: boolean
}

export function ExpenseItem({ expense, category, onEdit, onDelete, isOverspent }: ExpenseItemProps) {
  const [isSelected, setIsSelected] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleLongPress = () => {
    setShowActions(true)
    // Haptic feedback simulation
    if ("vibrate" in navigator) {
      navigator.vibrate([10])
    }
  }

  const handleEdit = () => {
    onEdit(expense)
    setShowActions(false)
    setIsSelected(false)
  }

  const handleDelete = () => {
    if (window.confirm("Sei sicuro di voler eliminare questa spesa?")) {
      onDelete(expense.id)
    }
    setShowActions(false)
    setIsSelected(false)
  }

  const handleSelect = () => {
    setIsSelected(!isSelected)
    if (!isSelected) {
      // Haptic feedback simulation
      if ("vibrate" in navigator) {
        navigator.vibrate([5])
      }
    }
  }

  return (
    <Card
      className={`ios-list-item cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50/50" : ""
      } ${isOverspent ? "border-red-200 bg-red-50/30" : ""}`}
      onClick={handleSelect}
      onContextMenu={(e) => {
        e.preventDefault()
        handleLongPress()
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{category?.icon || "💰"}</span>
              {isOverspent && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-black text-sm ios-body truncate">
                {expense.description || category?.name}
              </div>
              <div className="text-xs text-gray-600 flex items-center space-x-2">
                <span>{formatDate(expense.date)}</span>
                <span>•</span>
                <span className="truncate">{category?.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="font-bold text-red-500">-{formatCurrency(expense.amount)}</div>
              <div className="text-xs text-gray-500">
                {new Date(expense.date).toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Action buttons - shown when selected */}
            {isSelected && (
              <div className="flex items-center space-x-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit()
                  }}
                  className="w-8 h-8 p-0 hover:bg-blue-100 text-blue-600"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className="w-8 h-8 p-0 hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* More options button - shown when not selected */}
            {!isSelected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowActions(!showActions)
                }}
                className="w-8 h-8 p-0 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Action menu - shown when more options is clicked */}
        {showActions && !isSelected && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center space-x-1 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Edit3 className="h-3 w-3" />
              <span>Modifica</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex items-center space-x-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
              <span>Elimina</span>
            </Button>
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <Badge className="bg-blue-100 text-blue-700 text-xs">Selezionato - Tocca le azioni sopra</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
