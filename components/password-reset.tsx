"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Shield, Key, CheckCircle } from "lucide-react"

interface PasswordResetProps {
  onBack: () => void
  onSuccess: () => void
}

type ResetStep = "email" | "security" | "newPassword" | "success"

interface SecurityQuestion {
  id: string
  question: string
}

const SECURITY_QUESTIONS: SecurityQuestion[] = [
  { id: "pet", question: "Qual è il nome del tuo primo animale domestico?" },
  { id: "city", question: "In che città sei nato/a?" },
  { id: "school", question: "Qual è il nome della tua scuola elementare?" },
  { id: "mother", question: "Qual è il cognome da nubile di tua madre?" },
  { id: "car", question: "Qual è stata la marca della tua prima auto?" },
]

export function PasswordReset({ onBack, onSuccess }: PasswordResetProps) {
  const [step, setStep] = useState<ResetStep>("email")
  const [email, setEmail] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [userSecurityQuestion, setUserSecurityQuestion] = useState<SecurityQuestion | null>(null)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simula controllo email nel database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const allUsers = JSON.parse(localStorage.getItem("budgetapp-all-users") || "[]")
      const user = allUsers.find((u: any) => u.email === email)

      if (!user) {
        setError("Email non trovata nel sistema")
        return
      }

      if (!user.securityQuestion || !user.securityAnswer) {
        setError("Questo account non ha una domanda di sicurezza configurata. Contatta il supporto.")
        return
      }

      const question = SECURITY_QUESTIONS.find((q) => q.id === user.securityQuestion)
      if (!question) {
        setError("Errore nel recupero della domanda di sicurezza")
        return
      }

      setUserSecurityQuestion(question)
      setStep("security")
    } catch (err) {
      setError("Errore durante la verifica dell'email")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simula verifica risposta di sicurezza
      await new Promise((resolve) => setTimeout(resolve, 800))

      const allUsers = JSON.parse(localStorage.getItem("budgetapp-all-users") || "[]")
      const user = allUsers.find((u: any) => u.email === email)

      if (!user || user.securityAnswer.toLowerCase() !== securityAnswer.toLowerCase().trim()) {
        setError("Risposta di sicurezza non corretta")
        return
      }

      setStep("newPassword")
    } catch (err) {
      setError("Errore durante la verifica della risposta")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (newPassword.length < 6) {
        setError("La password deve essere di almeno 6 caratteri")
        return
      }

      if (newPassword !== confirmPassword) {
        setError("Le password non coincidono")
        return
      }

      // Simula aggiornamento password
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const allUsers = JSON.parse(localStorage.getItem("budgetapp-all-users") || "[]")
      const userIndex = allUsers.findIndex((u: any) => u.email === email)

      if (userIndex === -1) {
        setError("Errore durante l'aggiornamento della password")
        return
      }

      allUsers[userIndex].password = newPassword
      localStorage.setItem("budgetapp-all-users", JSON.stringify(allUsers))

      setStep("success")
    } catch (err) {
      setError("Errore durante l'aggiornamento della password")
    } finally {
      setIsLoading(false)
    }
  }

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-gray-400">Inserisci la tua email per iniziare il processo di recupero</p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="tua@email.com"
          required
        />
      </div>

      {error && <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">{error}</div>}

      <Button
        type="submit"
        disabled={isLoading || !email}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Verifica in corso...
          </div>
        ) : (
          "Continua"
        )}
      </Button>
    </form>
  )

  const renderSecurityStep = () => (
    <form onSubmit={handleSecuritySubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Domanda di Sicurezza</h2>
        <p className="text-gray-400">Rispondi alla tua domanda di sicurezza per continuare</p>
      </div>

      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-white font-medium">{userSecurityQuestion?.question}</p>
      </div>

      <div>
        <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-300 mb-2">
          La tua risposta
        </label>
        <Input
          type="text"
          id="securityAnswer"
          value={securityAnswer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Inserisci la tua risposta"
          required
        />
      </div>

      {error && <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">{error}</div>}

      <Button
        type="submit"
        disabled={isLoading || !securityAnswer.trim()}
        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Verifica in corso...
          </div>
        ) : (
          "Verifica Risposta"
        )}
      </Button>
    </form>
  )

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Key className="h-12 w-12 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Nuova Password</h2>
        <p className="text-gray-400">Scegli una nuova password sicura per il tuo account</p>
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
          Nuova Password
        </label>
        <Input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Minimo 6 caratteri"
          required
          minLength={6}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
          Conferma Password
        </label>
        <Input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Ripeti la password"
          required
          minLength={6}
        />
      </div>

      {error && <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">{error}</div>}

      <Button
        type="submit"
        disabled={isLoading || !newPassword || !confirmPassword}
        className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Aggiornamento...
          </div>
        ) : (
          "Aggiorna Password"
        )}
      </Button>
    </form>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Password Aggiornata!</h2>
        <p className="text-gray-400">La tua password è stata cambiata con successo.</p>
      </div>

      <Button
        onClick={onSuccess}
        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        Torna al Login
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onBack} className="p-2 text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-white">Recupero Password</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {step === "email" && renderEmailStep()}
            {step === "security" && renderSecurityStep()}
            {step === "newPassword" && renderPasswordStep()}
            {step === "success" && renderSuccessStep()}
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className={`w-2 h-2 rounded-full ${step === "email" ? "bg-blue-500" : "bg-gray-600"}`} />
          <div className={`w-2 h-2 rounded-full ${step === "security" ? "bg-green-500" : "bg-gray-600"}`} />
          <div className={`w-2 h-2 rounded-full ${step === "newPassword" ? "bg-purple-500" : "bg-gray-600"}`} />
          <div className={`w-2 h-2 rounded-full ${step === "success" ? "bg-green-500" : "bg-gray-600"}`} />
        </div>
      </div>
    </div>
  )
}
