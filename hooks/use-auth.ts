"use client"

import { useState, useEffect } from "react"
import { createUser, getUserByEmail } from "@/lib/actions/user-actions"
import type { DbUser } from "@/types/database"

export function useAuth() {
  const [user, setUser] = useState<DbUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simula autenticazione con email (in produzione useresti NextAuth o simili)
  const login = async (email: string, name?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Prima prova a trovare l'utente esistente
      const existingUserResult = await getUserByEmail(email)

      if (existingUserResult.success && existingUserResult.user) {
        setUser(existingUserResult.user)
        localStorage.setItem("userEmail", email)
        return { success: true, user: existingUserResult.user }
      }

      // Se non esiste, crea nuovo utente
      const createUserResult = await createUser({ email, name })

      if (createUserResult.success && createUserResult.user) {
        setUser(createUserResult.user)
        localStorage.setItem("userEmail", email)
        return { success: true, user: createUserResult.user }
      }

      setError(createUserResult.error || "Errore durante il login")
      return { success: false, error: createUserResult.error }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Errore durante il login"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("userEmail")
  }

  // Auto-login se c'è un email salvato
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail")
    if (savedEmail && !user) {
      getUserByEmail(savedEmail).then((result) => {
        if (result.success && result.user) {
          setUser(result.user)
        }
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [user])

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
