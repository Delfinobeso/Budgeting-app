"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface SimpleAuthFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  onRegister: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
}

export function SimpleAuthForm({ onLogin, onRegister }: SimpleAuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      let result
      if (mode === "login") {
        result = await onLogin(email, password)
      } else {
        result = await onRegister(email, password, name)
      }

      if (!result.success) {
        setError(result.error || "Errore sconosciuto")
      }
    } catch (err) {
      setError("Errore durante l'operazione")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (testEmail: string, testPassword: string) => {
    setError("")
    setIsLoading(true)
    const result = await onLogin(testEmail, testPassword)
    if (!result.success) {
      setError(result.error || "Errore durante il login")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Budget App</h1>
          <p className="text-gray-400">Gestisci il tuo budget personale</p>
        </div>

        {/* Quick Login Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => handleQuickLogin("demo@test.com", "123456")}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            🚀 Login Demo (demo@test.com)
          </Button>
          <Button
            onClick={() => handleQuickLogin("test@example.com", "password")}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            🧪 Login Test (test@example.com)
          </Button>
        </div>

        <div className="text-center text-gray-400">oppure</div>

        {/* Auth Form */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "login" ? "bg-white text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                Accedi
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "register" ? "bg-white text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                Registrati
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Il tuo nome"
                    required={mode === "register"}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="tua@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Minimo 6 caratteri"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">{error}</div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-100">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    {mode === "login" ? "Accesso..." : "Registrazione..."}
                  </div>
                ) : mode === "login" ? (
                  "Accedi"
                ) : (
                  "Registrati"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>🔒 I tuoi dati sono salvati in modo sicuro</p>
        </div>
      </div>
    </div>
  )
}
