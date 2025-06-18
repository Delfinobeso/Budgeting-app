"use client"

import type React from "react"

import { useState } from "react"
import { useNeonAuth } from "@/hooks/use-neon-auth"
import { PasswordReset } from "./password-reset"
import { SecurityQuestionSetup } from "./security-question-setup"

export function NeonAuthForm() {
  const { register, login, isLoading, error } = useNeonAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [showSecuritySetup, setShowSecuritySetup] = useState(false)
  const [pendingRegistration, setPendingRegistration] = useState<{
    email: string
    password: string
    name: string
  } | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (message: string) => {
    console.log("🐛 DEBUG:", message)
    setDebugInfo((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    addDebugInfo("Form submitted")

    if (mode === "login") {
      addDebugInfo(`Attempting login with: ${formData.email}`)
      const result = await login(formData.email, formData.password)
      addDebugInfo(`Login result: ${result.success ? "SUCCESS" : "FAILED"}`)
      if (!result.success) {
        addDebugInfo(`Login error: ${result.error}`)
      }
    } else {
      addDebugInfo("Starting registration process")
      setPendingRegistration({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })
      setShowSecuritySetup(true)
    }
  }

  const handleQuickLogin = async (email: string, password: string) => {
    addDebugInfo(`Quick login attempt: ${email}`)
    setFormData({ email, password, name: "" })
    const result = await login(email, password)
    addDebugInfo(`Quick login result: ${result.success ? "SUCCESS" : "FAILED"}`)
    if (!result.success) {
      addDebugInfo(`Quick login error: ${result.error}`)
    }
  }

  const handleSecurityQuestionComplete = async (questionId: string, answer: string) => {
    if (!pendingRegistration) return

    const result = await register(
      pendingRegistration.email,
      pendingRegistration.password,
      pendingRegistration.name,
      questionId,
      answer,
    )

    if (result.success) {
      setShowSecuritySetup(false)
      setPendingRegistration(null)
      setFormData({ email: "", password: "", name: "" })
    }
  }

  const handleSecurityQuestionSkip = async () => {
    if (!pendingRegistration) return

    const result = await register(pendingRegistration.email, pendingRegistration.password, pendingRegistration.name)

    if (result.success) {
      setShowSecuritySetup(false)
      setPendingRegistration(null)
      setFormData({ email: "", password: "", name: "" })
    }
  }

  const handlePasswordResetSuccess = () => {
    setShowPasswordReset(false)
    setMode("login")
  }

  const clearLocalStorage = () => {
    localStorage.clear()
    addDebugInfo("LocalStorage cleared")
    window.location.reload()
  }

  if (showPasswordReset) {
    return <PasswordReset onBack={() => setShowPasswordReset(false)} onSuccess={handlePasswordResetSuccess} />
  }

  if (showSecuritySetup) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-900 rounded-lg p-8 border border-gray-700">
          <SecurityQuestionSetup onComplete={handleSecurityQuestionComplete} onSkip={handleSecurityQuestionSkip} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Budget App</h1>
          <p className="text-gray-400">Gestisci il tuo budget personale</p>
        </div>

        {/* Quick Login Buttons */}
        <div className="mb-6 space-y-2">
          <button
            onClick={() => handleQuickLogin("demo@test.com", "123456")}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            🚀 Login Demo (demo@test.com)
          </button>
          <button
            onClick={() => handleQuickLogin("test@example.com", "password")}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            🧪 Login Test (test@example.com)
          </button>
        </div>

        <div className="text-center text-gray-400 mb-6">
          <span>oppure</span>
        </div>

        {/* Mode Toggle */}
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                  addDebugInfo(`Name changed: ${e.target.value}`)
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Il tuo nome"
                required={mode === "register"}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }))
                addDebugInfo(`Email changed: ${e.target.value}`)
              }}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tua@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, password: e.target.value }))
                addDebugInfo(`Password changed: ${e.target.value.length} chars`)
              }}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Minimo 6 caratteri"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-white text-black rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            onClick={() => addDebugInfo("Submit button clicked")}
          >
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
          </button>
        </form>

        {/* Forgot Password Link - Only show in login mode */}
        {mode === "login" && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowPasswordReset(true)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Password dimenticata?
            </button>
          </div>
        )}

        {/* Debug Section */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-white text-sm font-medium">🐛 Debug Info</h4>
            <button onClick={clearLocalStorage} className="text-xs text-red-400 hover:text-red-300">
              Clear Storage
            </button>
          </div>

          <div className="space-y-1 text-xs text-gray-300 max-h-32 overflow-y-auto">
            {debugInfo.length === 0 ? (
              <div>Nessun debug info ancora...</div>
            ) : (
              debugInfo.map((info, index) => (
                <div key={index} className="font-mono">
                  {info}
                </div>
              ))
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              <div>Loading: {isLoading ? "YES" : "NO"}</div>
              <div>Error: {error || "None"}</div>
              <div>Mode: {mode}</div>
              <div>Email: {formData.email}</div>
              <div>Password Length: {formData.password.length}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          <p>🔒 I tuoi dati sono salvati in modo sicuro</p>
          <p className="mt-1">💾 Archiviazione locale protetta</p>
        </div>
      </div>
    </div>
  )
}
