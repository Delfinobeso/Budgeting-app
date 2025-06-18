"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EnhancedCircularProgress } from "./enhanced-circular-progress"
import { DEFAULT_CATEGORIES, EXTENDED_CATEGORIES, BUDGET_SUGGESTIONS } from "@/lib/constants"
import type { Category, BudgetData } from "@/types/budget"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"
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
        <div className="min-h-screen bg-black flex flex-col animate-slide-up">
          {/* iOS Safe Area Header */}
          <div className="ios-safe-top flex-shrink-0" />

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col justify-between px-6 py-4 min-h-0">
            {/* Top Section - Header and Navigation */}
            <div className="flex-shrink-0 text-center pt-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-white hover:bg-white/10 px-0 h-auto font-normal"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Indietro
                </Button>
                <h1 className="text-lg font-semibold text-white">Categorie</h1>
                <div className="w-16"></div> {/* Spacer for alignment */}
              </div>

              {/* Progress indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-1">
                  <div className="w-6 h-1 bg-white/30 rounded-full"></div>
                  <div className="w-6 h-1 bg-white rounded-full"></div>
                  <div className="w-6 h-1 bg-white/30 rounded-full"></div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Distribuisci il budget</h2>
              <p className="text-gray-400 text-sm mb-4">Personalizza i tuoi €{totalBudget}</p>
            </div>

            {/* Center Section - Content */}
            <div className="flex-1 flex flex-col justify-center min-h-0 py-4">
              {/* Segmented Control */}
              <div className="mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 flex border border-white/20">
                  <button
                    onClick={() => switchCategoryMode(true)}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                      useSimpleCategories
                        ? "bg-white text-black shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Semplice
                  </button>
                  <button
                    onClick={() => switchCategoryMode(false)}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                      !useSimpleCategories
                        ? "bg-white text-black shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Dettagliato
                  </button>
                </div>
              </div>

              {/* Budget Status Card */}
              <div className="mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <EnhancedCircularProgress
                          percentage={Math.min(totalPercentage, 100)}
                          size={40}
                          color={
                            Math.abs(totalPercentage - 100) <= 1
                              ? "#22c55e"
                              : totalPercentage > 100
                                ? "#ef4444"
                                : "#f59e0b"
                          }
                        >
                          <div className="text-center">
                            <div className="text-xs font-semibold text-white">{totalPercentage}%</div>
                          </div>
                        </EnhancedCircularProgress>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white truncate">Allocazione Budget</div>
                        <div
                          className={`text-xs truncate ${
                            Math.abs(totalPercentage - 100) <= 1
                              ? "text-green-400"
                              : totalPercentage > 100
                                ? "text-red-400"
                                : "text-yellow-400"
                          }`}
                        >
                          {Math.abs(totalPercentage - 100) <= 1
                            ? "Bilanciato"
                            : totalPercentage > 100
                              ? `Eccesso: ${totalPercentage - 100}%`
                              : `Mancante: ${100 - totalPercentage}%`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories List - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div
                      key={category.id}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-lg flex-shrink-0">{category.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{category.name}</div>
                            <div className="text-xs text-gray-400 truncate">{(category as any).description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <PercentageInput
                            value={category.percentage}
                            onChange={(value) => updateCategoryPercentage(index, value)}
                            className="w-12 h-7 text-center text-xs border border-white/30 rounded-lg focus:border-white bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-300 truncate">
                            €{((Number.parseFloat(totalBudget) * category.percentage) / 100).toFixed(0)}
                          </span>
                          <span className="text-gray-300 font-medium flex-shrink-0">{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(category.percentage, 100)}%`,
                              backgroundColor: category.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section - Action Button */}
            <div className="flex-shrink-0 pb-safe-bottom pt-4">
              <Button
                onClick={() => setStep(3)}
                disabled={Math.abs(totalPercentage - 100) > 1}
                className="w-full h-12 bg-white hover:bg-gray-100 text-black font-semibold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Continua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Summary & Confirmation */}
      {step === 3 && (
        <div className="min-h-screen bg-black flex flex-col animate-slide-up">
          {/* iOS Safe Area Header */}
          <div className="ios-safe-top flex-shrink-0" />

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col justify-between px-6 py-4 min-h-0">
            {/* Top Section - Header and Navigation */}
            <div className="flex-shrink-0 text-center pt-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="text-white hover:bg-white/10 px-0 h-auto font-normal"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Indietro
                </Button>
                <h1 className="text-lg font-semibold text-white">Riepilogo</h1>
                <div className="w-16"></div> {/* Spacer for alignment */}
              </div>

              {/* Progress indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-1">
                  <div className="w-6 h-1 bg-white/30 rounded-full"></div>
                  <div className="w-6 h-1 bg-white/30 rounded-full"></div>
                  <div className="w-6 h-1 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Success Header */}
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Tutto pronto!</h2>
              <p className="text-gray-400 text-sm mb-4">Il tuo budget è configurato</p>
            </div>

            {/* Center Section - Content */}
            <div className="flex-1 flex flex-col justify-center min-h-0 py-4">
              {/* Budget Summary Card */}
              <div className="mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-white mb-1">€{totalBudget}</div>
                    <div className="text-sm text-gray-400">Budget Mensile</div>
                  </div>

                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {categories.map((category, index) => (
                      <div
                        key={category.id}
                        className={`flex items-center justify-between py-2 ${
                          index !== categories.length - 1 ? "border-b border-white/10" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-base flex-shrink-0">{category.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{category.name}</div>
                            <div className="text-xs text-gray-400 truncate">{category.percentage}% del budget</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-semibold text-white">
                            €{((Number.parseFloat(totalBudget) * category.percentage) / 100).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="mb-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-3">Cosa puoi fare ora:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                      <span className="text-xs text-gray-300 truncate">Tracciare le tue spese quotidiane</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                      <span className="text-xs text-gray-300 truncate">Monitorare i progressi per categoria</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                      <span className="text-xs text-gray-300 truncate">Ricevere notifiche sui limiti</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Action Button */}
            <div className="flex-shrink-0 pb-safe-bottom pt-4">
              <Button
                onClick={handleComplete}
                className="w-full h-12 bg-white hover:bg-gray-100 text-black font-semibold rounded-2xl transition-all duration-200 active:scale-95 shadow-lg"
              >
                <Check className="mr-2 h-4 w-4" />
                Inizia a usare Mobius
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
