"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedCircularProgress } from "./enhanced-circular-progress"
import { DEFAULT_CATEGORIES, EXTENDED_CATEGORIES, BUDGET_SUGGESTIONS } from "@/lib/constants"
import type { Category, BudgetData } from "@/types/budget"
import { ArrowRight, ArrowLeft, Check, Target, Home } from "lucide-react"
import { PercentageInput } from "./percentage-input"

interface OnboardingSetupProps {
  onComplete: (budgetData: BudgetData) => void
}

export function OnboardingSetup({ onComplete }: OnboardingSetupProps) {
  const [step, setStep] = useState(1)
  const [totalBudget, setTotalBudget] = useState("")
  const [useSimpleCategories, setUseSimpleCategories] = useState(true)
  const [categories, setCategories] = useState<Category[]>(
    DEFAULT_CATEGORIES.map((cat, index) => ({
      id: `cat-${index}`,
      ...cat,
      spent: 0,
      budget: 0,
    })),
  )
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Aggiorna i budget delle categorie quando cambia il budget totale
  useEffect(() => {
    if (totalBudget) {
      const budget = Number.parseFloat(totalBudget)
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          budget: (budget * cat.percentage) / 100,
        })),
      )
    }
  }, [totalBudget, categories.map((c) => c.percentage).join(",")])

  const updateCategoryPercentage = (index: number, percentage: number) => {
    const newCategories = [...categories]
    const oldPercentage = newCategories[index].percentage
    const difference = percentage - oldPercentage

    newCategories[index].percentage = percentage

    // Se il totale supera 100, riduci proporzionalmente le altre categorie
    const currentTotal = newCategories.reduce((sum, cat) => sum + cat.percentage, 0)

    if (currentTotal > 100) {
      const excess = currentTotal - 100
      const otherCategories = newCategories.filter((_, i) => i !== index)
      const totalOthers = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0)

      if (totalOthers > 0) {
        otherCategories.forEach((cat) => {
          const originalIndex = newCategories.findIndex((c) => c.id === cat.id)
          if (originalIndex !== -1) {
            const reduction = (cat.percentage / totalOthers) * excess
            newCategories[originalIndex].percentage = Math.max(0, Math.round(cat.percentage - reduction))
          }
        })
      }
    }

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
        budget: totalBudget ? (Number.parseFloat(totalBudget) * cat.percentage) / 100 : 0,
      })),
    )
  }

  const selectBudgetSuggestion = (amount: number) => {
    setTotalBudget(amount.toString())
  }

  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0)

  const handleComplete = () => {
    if (totalBudget && Math.abs(totalPercentage - 100) <= 1) {
      const currentDate = new Date()
      const budgetData: BudgetData = {
        totalBudget: Number.parseFloat(totalBudget),
        categories,
        expenses: [],
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      }
      onComplete(budgetData)
    }
  }

  return (
    <div className="min-h-screen bg-black font-sans overflow-hidden">
      {/* Step 1: Welcome & Budget Amount */}
      {step === 1 && (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
          {/* Hero Card */}
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <Card className="bg-white rounded-4xl shadow-2xl p-8 hover:scale-105 transition-all duration-300 max-w-sm">
              <CardContent className="p-0 text-center">
                <div className="mb-6">
                  <div className="text-5xl mb-4">💰</div>
                  <h3 className="text-xl font-bold text-black mb-2">Budget Setup</h3>
                  <p className="text-sm text-gray-600">Configura il tuo budget mensile</p>
                </div>

                <div className="mb-6">
                  <EnhancedCircularProgress
                    percentage={totalBudget ? 75 : 25}
                    size={120}
                    color="#000000"
                    showPercentage
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-black">{totalBudget ? "75%" : "25%"}</div>
                      <div className="text-xs text-gray-600">Setup</div>
                    </div>
                  </EnhancedCircularProgress>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Budget</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-black rounded-full transition-all duration-500"
                        style={{ width: totalBudget ? "100%" : "0%" }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Categorie</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-4 h-2 bg-gray-400 rounded-full" />
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
              Iniziamo configurando il tuo budget mensile per gestire al meglio le tue finanze
            </p>

            {/* Budget Suggestions */}
            <div className="flex gap-2 justify-center mb-6">
              {BUDGET_SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion.amount}
                  variant="outline"
                  size="sm"
                  onClick={() => selectBudgetSuggestion(suggestion.amount)}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  €{suggestion.amount}
                </Button>
              ))}
            </div>

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

          {/* Progress indicators */}
          <div
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Step 2: Category Configuration */}
      {step === 2 && (
        <div className="min-h-screen bg-gray-50 p-6 animate-slide-up">
          <div className="max-w-md mx-auto pt-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Configura Categorie</h1>
              <p className="text-gray-600">Personalizza la distribuzione del tuo budget di €{totalBudget}</p>
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
                <Target className="w-4 h-4 mr-2" />
                Semplice
              </Button>
              <Button
                variant={!useSimpleCategories ? "default" : "ghost"}
                onClick={() => switchCategoryMode(false)}
                className={`flex-1 h-10 rounded-xl font-medium transition-all ${
                  !useSimpleCategories ? "bg-black text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Dettagliato
              </Button>
            </div>

            {/* Budget Overview */}
            <Card className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <CardContent className="p-0 text-center">
                <div className="flex justify-center mb-4">
                  <EnhancedCircularProgress
                    percentage={Math.min(totalPercentage, 100)}
                    size={100}
                    color={
                      Math.abs(totalPercentage - 100) <= 1 ? "#22c55e" : totalPercentage > 100 ? "#ef4444" : "#f59e0b"
                    }
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-black">{totalPercentage}%</div>
                      <div className="text-xs text-gray-600">Totale</div>
                    </div>
                  </EnhancedCircularProgress>
                </div>
                <Badge
                  variant={Math.abs(totalPercentage - 100) <= 1 ? "default" : "secondary"}
                  className={`text-sm ${
                    Math.abs(totalPercentage - 100) <= 1
                      ? "bg-green-100 text-green-800 border-green-200"
                      : totalPercentage > 100
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-amber-100 text-amber-800 border-amber-200"
                  }`}
                >
                  {Math.abs(totalPercentage - 100) <= 1
                    ? "✓ Perfetto!"
                    : totalPercentage > 100
                      ? `Troppo alto: -${totalPercentage - 100}%`
                      : `Manca: +${100 - totalPercentage}%`}
                </Badge>
              </CardContent>
            </Card>

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
                        <div>
                          <span className="font-semibold text-black">{category.name}</span>
                          <p className="text-xs text-gray-500">{(category as any).description}</p>
                        </div>
                      </div>
                      <PercentageInput
                        value={category.percentage}
                        onChange={(value) => updateCategoryPercentage(index, value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>
                          Budget: €{((Number.parseFloat(totalBudget) * category.percentage) / 100).toFixed(0)}
                        </span>
                        <span>{category.percentage}% del totale</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(category.percentage, 100)}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-12 bg-white border-2 border-gray-200 text-black rounded-2xl hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Indietro
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={Math.abs(totalPercentage - 100) > 1}
                className="flex-1 h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                Continua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Summary & Confirmation */}
      {step === 3 && (
        <div className="min-h-screen bg-gray-50 p-6 animate-slide-up">
          <div className="max-w-md mx-auto pt-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-black mb-2">Tutto Pronto!</h1>
              <p className="text-gray-600">Ecco il riepilogo del tuo budget</p>
            </div>

            {/* Summary Card */}
            <Card className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-black mb-2">€{totalBudget}</div>
                  <p className="text-gray-600">Budget Mensile</p>
                </div>

                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{category.icon}</span>
                        <div>
                          <div className="font-medium text-black">{category.name}</div>
                          <div className="text-sm text-gray-600">{category.percentage}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-black">
                          €{((Number.parseFloat(totalBudget) * category.percentage) / 100).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 h-12 bg-white border-2 border-gray-200 text-black rounded-2xl hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Modifica
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-200 active:scale-95"
              >
                <Check className="mr-2 h-4 w-4" />
                Inizia
              </Button>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
