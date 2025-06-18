"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  X,
  Download,
  Upload,
  RotateCcw,
  Moon,
  Sun,
  Bell,
  BellOff,
  Shield,
  Database,
  FileText,
  Trash2,
  AlertTriangle,
  Info,
  Settings,
  Palette,
  Globe,
  HelpCircle,
  Mail,
  Star,
} from "lucide-react"
import type { Category, Expense } from "@/types/budget"
import { formatCurrency } from "@/lib/expense-utils"

interface SettingsModalProps {
  onClose: () => void
  onReset: () => void
  totalBudget: number
  categories: Category[]
  expenses: Expense[]
}

export function SettingsModal({ onClose, onReset, totalBudget, categories, expenses }: SettingsModalProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(false)

  const handleExportData = () => {
    const data = {
      budget: totalBudget,
      categories,
      expenses,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mobius-budget-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            localStorage.setItem("budget-app-data", JSON.stringify(data))
            window.location.reload()
          } catch (error) {
            alert("Errore nell'importazione del file. Verifica che sia un file Mobius valido.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleResetConfirm = () => {
    onReset()
    setShowResetConfirm(false)
    onClose()
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const dataSize = new Blob([JSON.stringify({ categories, expenses })]).size

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
      <Card className="w-full max-w-md max-h-[85vh] bg-white rounded-3xl shadow-2xl animate-scale-in border-0 overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-black">Impostazioni</CardTitle>
                <p className="text-sm text-gray-600">Gestisci le tue preferenze e i tuoi dati</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto max-h-[calc(85vh-100px)]">
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 bg-blue-50 border-blue-200 rounded-2xl min-w-0">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 truncate">{formatCurrency(totalBudget)}</div>
                  <div className="text-xs text-blue-700 truncate">Budget totale</div>
                </div>
              </Card>
              <Card className="p-3 bg-green-50 border-green-200 rounded-2xl min-w-0">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{expenses.length}</div>
                  <div className="text-xs text-green-700 truncate">Transazioni</div>
                </div>
              </Card>
              <Card className="p-3 bg-purple-50 border-purple-200 rounded-2xl min-w-0">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{categories.length}</div>
                  <div className="text-xs text-purple-700 truncate">Categorie</div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-black">Gestione Dati</h3>
              </div>

              <div className="space-y-3">
                <Card className="p-3 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Download className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-black text-sm truncate">Esporta Dati</div>
                        <div className="text-xs text-gray-600 truncate">Scarica tutti i tuoi dati in formato JSON</div>
                      </div>
                    </div>
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      size="sm"
                      className="rounded-xl flex-shrink-0 text-xs px-3 py-1"
                    >
                      Esporta
                    </Button>
                  </div>
                </Card>

                <Card className="p-3 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Upload className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-black text-sm truncate">Importa Dati</div>
                        <div className="text-xs text-gray-600 truncate">Ripristina da un backup precedente</div>
                      </div>
                    </div>
                    <Button
                      onClick={handleImportData}
                      variant="outline"
                      size="sm"
                      className="rounded-xl flex-shrink-0 text-xs px-3 py-1"
                    >
                      Importa
                    </Button>
                  </div>
                </Card>

                <Card className="p-3 rounded-2xl border border-red-200 bg-red-50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <RotateCcw className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-red-800 text-sm truncate">Reset Completo</div>
                        <div className="text-xs text-red-600 truncate">Elimina tutti i dati e ricomincia</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowResetConfirm(true)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-red-300 text-red-600 hover:bg-red-100 flex-shrink-0 text-xs px-3 py-1"
                    >
                      Reset
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-black">Preferenze</h3>
              </div>

              <div className="space-y-3">
                <Card className="p-3 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {darkMode ? (
                          <Moon className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Sun className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-black text-sm truncate">Modalità Scura</div>
                        <div className="text-xs text-gray-600 truncate">Attiva il tema scuro per l'interfaccia</div>
                      </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} className="flex-shrink-0" />
                  </div>
                </Card>

                <Card className="p-3 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {notifications ? (
                          <Bell className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <BellOff className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-black text-sm truncate">Notifiche</div>
                        <div className="text-xs text-gray-600 truncate">Ricevi promemoria per le spese</div>
                      </div>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} className="flex-shrink-0" />
                  </div>
                </Card>

                <Card className="p-3 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-black text-sm truncate">Backup Automatico</div>
                        <div className="text-xs text-gray-600 truncate">Salva automaticamente i dati localmente</div>
                      </div>
                    </div>
                    <Switch checked={autoBackup} onCheckedChange={setAutoBackup} className="flex-shrink-0" />
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-black">Informazioni</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 rounded-2xl border border-gray-200 text-center min-w-0">
                  <FileText className="w-5 h-5 text-gray-600 mx-auto mb-2 flex-shrink-0" />
                  <div className="text-sm font-medium text-black truncate">Dimensione Dati</div>
                  <div className="text-xs text-gray-600 truncate">{(dataSize / 1024).toFixed(1)} KB</div>
                </Card>

                <Card className="p-3 rounded-2xl border border-gray-200 text-center min-w-0">
                  <Globe className="w-5 h-5 text-gray-600 mx-auto mb-2 flex-shrink-0" />
                  <div className="text-sm font-medium text-black truncate">Versione</div>
                  <div className="text-xs text-gray-600 truncate">Mobius v1.0</div>
                </Card>
              </div>

              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start rounded-xl h-10 px-3">
                  <HelpCircle className="w-4 h-4 mr-3 text-gray-600 flex-shrink-0" />
                  <span className="text-black text-sm truncate">Centro Assistenza</span>
                </Button>

                <Button variant="ghost" className="w-full justify-start rounded-xl h-10 px-3">
                  <Mail className="w-4 h-4 mr-3 text-gray-600 flex-shrink-0" />
                  <span className="text-black text-sm truncate">Contatta il Supporto</span>
                </Button>

                <Button variant="ghost" className="w-full justify-start rounded-xl h-10 px-3">
                  <Star className="w-4 h-4 mr-3 text-gray-600 flex-shrink-0" />
                  <span className="text-black text-sm truncate">Valuta l'App</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-60">
          <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl animate-scale-in border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-black mb-2">Conferma Reset</h3>
              <p className="text-gray-600 mb-6">
                Questa azione eliminerà <strong>tutti i tuoi dati</strong> inclusi budget, categorie e spese.
                L'operazione non può essere annullata.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleResetConfirm}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sì, elimina tutto
                </Button>
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  variant="outline"
                  className="w-full h-12 rounded-2xl border-2 border-gray-200 hover:bg-gray-50"
                >
                  Annulla
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
