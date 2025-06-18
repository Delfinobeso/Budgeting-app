"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Zap } from "lucide-react"

interface ModernAuthFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  onRegister: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
}

export function ModernAuthForm({ onLogin, onRegister }: ModernAuthFormProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Budget App</h1>
            <p className="text-white/70 text-lg">Il tuo assistente finanziario personale</p>
          </div>
        </div>

        {/* Quick Login Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => handleQuickLogin("demo@test.com", "123456")}
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Zap className="w-5 h-5 mr-3" />🚀 Accesso Demo Rapido
          </Button>

          <Button
            onClick={() => handleQuickLogin("test@example.com", "password")}
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 mr-3" />🧪 Account Test
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-white/70">oppure</span>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl">
          <CardContent className="p-8">
            {/* Mode Toggle */}
            <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === "login"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Accedi
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === "register"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Registrati
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "register" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">Nome completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="pl-12 h-14 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40"
                      placeholder="Il tuo nome"
                      required={mode === "register"}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-12 h-14 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40"
                    placeholder="tua@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-12 pr-12 h-14 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40"
                    placeholder="Minimo 6 caratteri"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-gray-900 border-0 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-3"></div>
                    {mode === "login" ? "Accesso in corso..." : "Registrazione..."}
                  </div>
                ) : (
                  <>{mode === "login" ? "🔐 Accedi" : "✨ Crea Account"}</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/20">
            🔒 Dati protetti e sicuri
          </Badge>
          <p className="text-white/50 text-sm">I tuoi dati finanziari sono al sicuro con noi</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
