"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Zap } from "lucide-react"

interface UnifiedAuthFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  onRegister: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
}

export function UnifiedAuthForm({ onLogin, onRegister }: UnifiedAuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      let result
      if (mode === "login") {
        result = await onLogin(formData.email, formData.password)
      } else {
        result = await onRegister(formData.email, formData.password, formData.name)
      }

      if (!result.success) {
        setError(result.error || "Errore sconosciuto")
      }
    } catch (err) {
      setError("Errore di connessione")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError("")
    const result = await onLogin(email, password)
    if (!result.success) {
      setError(result.error || "Errore durante il login")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header - Consistent with app design */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-4xl shadow-xl">
            <span className="text-3xl">💰</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Budget App</h1>
            <p className="text-gray-600 text-lg">Gestisci le tue finanze con semplicità</p>
          </div>
        </div>

        {/* Quick Login Buttons - Matching app's button style */}
        <div className="space-y-3">
          <Button
            onClick={() => handleQuickLogin("demo@test.com", "123456")}
            disabled={isLoading}
            className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-3xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Zap className="w-5 h-5 mr-3" />🚀 Accesso Demo Rapido
          </Button>

          <Button
            onClick={() => handleQuickLogin("test@example.com", "password")}
            disabled={isLoading}
            className="w-full h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-3xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <User className="w-5 h-5 mr-3" />🧪 Account Test
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-50 text-gray-600">oppure</span>
          </div>
        </div>

        {/* Auth Form - Consistent with app's card design */}
        <Card className="bg-white rounded-4xl shadow-xl border-0">
          <CardContent className="p-8">
            {/* Mode Toggle - Matching app's toggle style */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === "login" ? "bg-black text-white shadow-lg" : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                Accedi
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === "register"
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                Registrati
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "register" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nome completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="pl-12 h-14 border-2 border-gray-200 rounded-2xl text-black placeholder-gray-500 focus:border-black bg-white"
                      placeholder="Il tuo nome"
                      required={mode === "register"}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-12 h-14 border-2 border-gray-200 rounded-2xl text-black placeholder-gray-500 focus:border-black bg-white"
                    placeholder="tua@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-12 pr-12 h-14 border-2 border-gray-200 rounded-2xl text-black placeholder-gray-500 focus:border-black bg-white"
                    placeholder="Minimo 6 caratteri"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-3xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {mode === "login" ? "Accesso in corso..." : "Registrazione..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {mode === "login" ? "Accedi" : "Crea Account"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer - Consistent with app design */}
        <div className="text-center space-y-3">
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">🔒 Dati protetti e sicuri</Badge>
          <p className="text-gray-500 text-sm">I tuoi dati finanziari sono al sicuro</p>
        </div>
      </div>
    </div>
  )
}
