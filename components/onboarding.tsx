"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgress } from "./circular-progress"
import { DEFAULT_CATEGORIES, EXTENDED_CATEGORIES } from "@/lib/constants"
import type { Category } from "@/types/budget"
import { ArrowRight } from "lucide-react"

interface OnboardingProps {
  onComplete: (totalBudget: number, categories: Category[]) => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [totalBudget, setTotalBudget] = useState("")
  const [useSimpleCategories, setUseSimpleCategories] = useState(true)
  const [categories, setCategories] = useState(
    DEFAULT_CATEGORIES.map((cat, index) => ({
      id: `cat-${index}`,
      ...cat,
      spent: 0,
    })),
  )
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const updateCategoryPercentage = (index: number, percentage: number) => {
    const newCategories = [...categories]
    newCategories[index].percentage = percentage
    setCategories(newCategories)
  }

  const switchCategoryMode = (simple: boolean) => {
    setUseSimpleCategories(simple)
    const newCats = simple ? DEFAULT_CATEGORIES : EXTENDED_CATEGORIES
    setCategories(
      newCats.map((cat, index) => ({
        id: `cat-${index}`,
        ...cat,
        spent: 0,
      })),
    )
  }

  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0)

  const handleComplete = () => {
    if (totalBudget && Math.abs(totalPercentage - 100) <= 1) {
      onComplete(Number.parseFloat(totalBudget), categories)
    }
  }

  return (
    <div className="min-h-screen bg-black font-sans overflow-hidden">
      {step === 1 && (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
          {/* Static Card */}
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <Card className="bg-white rounded-4xl shadow-2xl p-8 hover:scale-105 transition-all duration-300 max-w-sm">
              <CardContent className="p-0 text-center">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-black mb-2">€</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Setup</h3>
                </div>

                <div className="mb-6">
                  <CircularProgress percentage={75} size={120}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-black">75%</div>
                      <div className="text-xs text-gray-600">Ready</div>
                    </div>
                  </CircularProgress>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Categories</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-12 h-2 bg-black rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Budget</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-8 h-2 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div
            className={`text-center mt-12 transform transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <h1 className="text-4xl font-bold text-white mb-4">Benvenuto in BudgetApp!</h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Organizza le tue finanze e monitora le spese in un'app semplice e intuitiva
            </p>

            <div className="space-y-4 max-w-sm mx-auto">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">€</span>
                <Input
                  type="number"
                  placeholder="2000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="pl-10 h-14 text-lg border-2 border-gray-700 rounded-3xl focus:border-white bg-gray-900 text-white placeholder-gray-500"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!totalBudget || Number.parseFloat(totalBudget) <= 0}
                className="w-full h-14 bg-white hover:bg-gray-100 text-black font-semibold rounded-3xl transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                Continua
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Progress dots */}
          <div
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="min-h-screen bg-gray-50 p-6 animate-slide-up">
          <div className="max-w-md mx-auto pt-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Configura Categorie</h1>
              <p className="text-gray-600">Personalizza la distribuzione del tuo budget</p>
            </div>

            {/* Category Mode Toggle */}
            <div className="flex bg-gray-200 rounded-2xl p-1 mb-6">
              <Button
                variant={useSimpleCategories ? "default" : "ghost"}
                onClick={() => switchCategoryMode(true)}
                className={`flex-1 h-10 rounded-xl font-medium transition-all ${
                  useSimpleCategories ? "bg-black text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Semplice
              </Button>
              <Button
                variant={!useSimpleCategories ? "default" : "ghost"}
                onClick={() => switchCategoryMode(false)}
                className={`flex-1 h-10 rounded-xl font-medium transition-all ${
                  !useSimpleCategories ? "bg-black text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Dettagliato
              </Button>
            </div>

            {/* Categories */}
            <div className="space-y-4 mb-8">
              {categories.map((category, index) => (
                <Card
                  key={category.id}
                  className="bg-white rounded-3xl shadow-lg p-6 hover:scale-102 hover:shadow-xl transition-all duration-200"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-semibold text-black">{category.name}</span>
                      </div>
                      <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                        {category.percentage}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={category.percentage}
                      onChange={(e) => updateCategoryPercentage(index, Number.parseInt(e.target.value))}
                      className="w-full mt-3 opacity-0 absolute"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total */}
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  Math.abs(totalPercentage - 100) <= 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                Totale: {totalPercentage}%
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleComplete}
              disabled={Math.abs(totalPercentage - 100) > 1}
              className="w-full h-14 bg-black hover:bg-gray-800 text-white font-semibold rounded-3xl transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              Inizia
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Progress dots */}
            <div className="flex justify-center space-x-2 mt-8">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
