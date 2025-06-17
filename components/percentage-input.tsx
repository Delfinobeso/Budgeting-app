"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface PercentageInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function PercentageInput({ value, onChange, min = 0, max = 100, className = "" }: PercentageInputProps) {
  const [inputValue, setInputValue] = useState(value.toString())

  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Valida e aggiorna solo se è un numero valido
    const numValue = Number.parseFloat(newValue)
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue))
      onChange(clampedValue)
    }
  }

  const handleBlur = () => {
    // Assicurati che il valore sia valido quando l'utente esce dal campo
    const numValue = Number.parseFloat(inputValue)
    if (isNaN(numValue)) {
      setInputValue(value.toString())
    } else {
      const clampedValue = Math.max(min, Math.min(max, numValue))
      setInputValue(clampedValue.toString())
      if (clampedValue !== value) {
        onChange(clampedValue)
      }
    }
  }

  return (
    <div className="flex items-center space-x-1">
      <Input
        type="number"
        min={min}
        max={max}
        step="1"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-16 h-8 text-center text-sm border-2 border-gray-200 rounded-lg focus:border-black ${className}`}
      />
      <span className="text-sm font-medium text-gray-600">%</span>
    </div>
  )
}
