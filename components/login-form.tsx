"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { Mail, User } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    await login(email, name || undefined)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white rounded-4xl shadow-2xl">
        <CardHeader className="text-center p-8 pb-4">
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-2xl font-bold text-black mb-2">Benvenuto in BudgetApp</h1>
          <p className="text-gray-600">Accedi per gestire il tuo budget</p>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="tua@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 rounded-2xl focus:border-black"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome (opzionale)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Il tuo nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 rounded-2xl focus:border-black"
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}

            <Button
              type="submit"
              disabled={!email || isLoading}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
