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
import { MobiusLogo } from "./mobius-logo"

interface EnhancedOnboardingProps {
  onComplete: (budgetData: BudgetData) => void
}

export function EnhancedOnboarding({ onComplete }: EnhancedOnboardingProps) {
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
        <div className="min-h-screen flex flex-col bg-black">
          {/* iOS Safe Area Header */}
          <div className="ios-safe-top flex-shrink-0" />

          {/* Main Content Container - Adaptive Layout */}
          <div className="flex-1 flex flex-col justify-between px-6 py-4 min-h-0">
            {/* Top Section - Logo and Welcome */}
            <div className="flex-shrink-0 text-center pt-4">
              <div
                className={`transform transition-all duration-1000 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                    <MobiusLogo size={48} color="#ffffff" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Benvenuto su Mobius</h1>
                <p className="text-gray-400 text-base leading-relaxed max-w-xs mx-auto">
                  Il tuo budget personale, semplice e sotto controllo
                </p>
              </div>
            </div>

            {/* Center Section - Progress and Input */}
            <div className="flex-1 flex flex-col justify-center min-h-0 py-6">
              {/* Progress Indicator */}
              <div
                className={`transform transition-all duration-1000 delay-300 mb-8 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <div className="flex justify-center mb-4">
                  <EnhancedCircularProgress
                    percentage={totalBudget ? 50 : 25}
                    size={100}
                    color="#ffffff"
                    showPercentage={false}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{totalBudget ? "50%" : "25%"}</div>
                      <div className="text-xs text-gray-400">Setup</div>
                    </div>
                  </EnhancedCircularProgress>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center space-x-2 mb-6">
                  <div className="flex space-x-1">
                    <div className="w-6 h-1 bg-white rounded-full"></div>
                    <div className="w-6 h-1 bg-white/30 rounded-full"></div>
                    <div className="w-6 h-1 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Budget Input Section */}
              <div
                className={`transform transition-all duration-1000 delay-500 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                {/* Quick Amount Buttons */}
                <div className="flex justify-center gap-2 mb-6">
                  {BUDGET_SUGGESTIONS.map((suggestion) => (
                    <Button
                      key={suggestion.amount}
                      variant="outline"
                      size="sm"
                      onClick={() => selectBudgetSuggestion(suggestion.amount)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-sm px-3 py-2 h-8 rounded-full transition-all duration-200"
                    >
                      {suggestion.label}
                    </Button>
                  ))}
                </div>

                {/* Main Input */}
                <div className="max-w-xs mx-auto">
                  <div className="relative mb-2">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-medium">
                      €
                    </span>
                    <Input
                      type="number"
                      placeholder="Il tuo budget mensile"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className="pl-10 h-12 text-lg border-2 border-white/20 rounded-2xl focus:border-white bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">Inserisci il tuo budget mensile per iniziare</p>
                </div>
              </div>
            </div>

            {/* Bottom Section - Action Button */}
            <div className="flex-shrink-0 pb-safe-bottom">
              <div
                className={`transform transition-all duration-1000 delay-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <Button
                  onClick={() => setStep(2)}
                  disabled={!totalBudget || Number.parseFloat(totalBudget) <= 0}
                  className="w-full h-12 bg-white hover:bg-gray-100 text-black font-semibold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Continua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Category Configuration */}
      {step === 2 && (
        <div className="h-screen bg-gray-50 flex flex-col animate-slide-up overflow-hidden">
          {/* iOS Safe Area Header */}
          <div className="ios-safe-top flex-shrink-0" />

          {/* Main Content Container - iPhone 13 Optimized */}
          <div className="flex-1 flex flex-col min-h-0 max-w-sm mx-auto px-0">
            {/* Compact Header */}
            <div className="flex-shrink-0 text-center py-3">
              <h1 className="text-xl font-bold text-black mb-1">Distribuisci il budget</h1>
              <p className="text-gray-600 text-xs">Personalizza i tuoi €{totalBudget}</p>
            </div>

            {/* Category Mode Toggle - Compact */}
            <div className="flex-shrink-0 mb-3">
              <div className="flex bg-gray-200 rounded-xl p-1">
                <Button
                  variant={useSimpleCategories ? "default" : "ghost"}
                  onClick={() => switchCategoryMode(true)}
                  className={`flex-1 h-8 rounded-lg font-medium text-xs transition-all ${
                    useSimpleCategories ? "bg-black text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Semplice
                </Button>
                <Button
                  variant={!useSimpleCategories ? "default" : "ghost"}
                  onClick={() => switchCategoryMode(false)}
                  className={`flex-1 h-8 rounded-lg font-medium text-xs transition-all ${
                    !useSimpleCategories ? "bg-black text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Home className="w-3 h-3 mr-1" />
                  Dettagliato
                </Button>
              </div>
            </div>

            {/* Compact Budget Overview */}
            <div className="flex-shrink-0 mb-3">
              <Card className="bg-white rounded-xl shadow-md p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <EnhancedCircularProgress
                        percentage={Math.min(totalPercentage, 100)}
                        size={60}
                        color={
                          Math.abs(totalPercentage - 100) <= 1
                            ? "#22c55e"
                            : totalPercentage > 100
                              ? "#ef4444"
                              : "#f59e0b"
                        }
                      >
                        <div className="text-center">
                          <div className="text-xs font-bold text-black">{totalPercentage}%</div>
                        </div>
                      </EnhancedCircularProgress>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-black">Budget Totale</div>
                        <Badge
                          variant={Math.abs(totalPercentage - 100) <= 1 ? "default" : "secondary"}
                          className={`text-xs mt-1 ${
                            Math.abs(totalPercentage - 100) <= 1
                              ? "bg-green-100 text-green-800 border-green-200"
                              : totalPercentage > 100
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {Math.abs(totalPercentage - 100) <= 1
                            ? "Perfetto!"
                            : totalPercentage > 100
                              ? `Troppo: -${totalPercentage - 100}%`
                              : `Manca: +${100 - totalPercentage}%`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories - Optimized Scrollable Container */}
            <div className="flex-1 overflow-y-auto min-h-0 mb-3 scrollbar-hide">
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <Card
                    key={category.id}
                    className="bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <span className="text-base flex-shrink-0">{category.icon}</span>
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-black text-sm truncate block">{category.name}</span>
                            <p className="text-xs text-gray-500 truncate">{(category as any).description}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <PercentageInput
                            value={category.percentage}
                            onChange={(value) => updateCategoryPercentage(index, value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span className="truncate">
                            €{((Number.parseFloat(totalBudget) * category.percentage) / 100).toFixed(0)}
                          </span>
                          <span className="flex-shrink-0">{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
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
            </div>

            {/* Fixed Action Buttons - Always Visible */}
            <div className="flex-shrink-0 bg-gray-50">
              <div className="flex gap-2 mb-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-10 bg-white border border-gray-300 text-black rounded-xl hover:bg-gray-50 text-sm font-medium"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Indietro
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={Math.abs(totalPercentage - 100) > 1}
                  className="flex-1 h-10 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 text-sm"
                >
                  Continua
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>

              {/* Compact Progress indicators */}
              <div className="flex justify-center space-x-1 pb-safe-bottom">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Summary & Confirmation */}
      {step === 3 && (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-slide-up">
          <div className="flex-1 flex flex-col max-w-md mx-auto pt-8 pb-4">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎉</div>
              <h1 className="text-2xl font-bold text-black mb-1">Tutto pronto!</h1>
              <p className="text-gray-600 text-sm">Il tuo budget mensile</p>
            </div>

            {/* Summary Card - Scrollable if needed */}
            <div className="flex-1 overflow-y-auto mb-4">
              <Card className="bg-white rounded-2xl shadow-xl p-6 mb-4">
                <CardContent className="p-0">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-black mb-1">€{totalBudget}</div>
                    <p className="text-gray-600 text-sm">Budget Mensile</p>
                  </div>

                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <span className="text-lg flex-shrink-0">{category.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-black text-sm truncate">{category.name}</div>
                            <div className="text-xs text-gray-600">{category.percentage}%</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-black text-sm">
                            €{((Number.parseFloat(totalBudget) * category.percentage) / 100).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sticky Action Buttons */}
            <div className="bg-gray-50 pt-3 pb-safe-bottom">
              <div className="flex gap-3 mb-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 h-11 bg-white border-2 border-gray-200 text-black rounded-xl hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Modifica
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 h-11 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 active:scale-95"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Conferma
                </Button>
              </div>

              {/* Progress indicators */}
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
