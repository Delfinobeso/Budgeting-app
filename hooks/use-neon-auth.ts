"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

// Utenti predefiniti per testing
const DEFAULT_USERS = [
  {
    id: 1,
    email: "demo@test.com",
    password: "123456",
    name: "Demo User",
    createdAt: new Date().toISOString(),
    securityQuestion: "pet",
    securityAnswer: "fluffy",
  },
  {
    id: 2,
    email: "test@example.com",
    password: "password",
    name: "Test User",
    createdAt: new Date().toISOString(),
    securityQuestion: "city",
    securityAnswer: "roma",
  },
]

export function useNeonAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  // Carica utente salvato al mount
  useEffect(() => {
    const loadSavedUser = () => {
      try {
        console.log("🔄 Loading saved user from localStorage...")
        const savedUser = localStorage.getItem("budgetapp-user")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          console.log("✅ Found saved user:", user.email)

          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          })
          console.log("✅ Auth state updated - user authenticated")
          return
        } else {
          console.log("ℹ️ No saved user found")
        }
      } catch (error) {
        console.error("❌ Error loading saved user:", error)
        localStorage.removeItem("budgetapp-user")
      }

      setState((prev) => ({ ...prev, isLoading: false }))
      console.log("✅ Auth loading completed - no user")
    }

    loadSavedUser()
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string, securityQuestion?: string, securityAnswer?: string) => {
      console.log("🔄 Starting registration process...")
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        console.log("📝 Registering user:", email)

        // Validazione
        if (!email || !password || !name) {
          throw new Error("Tutti i campi sono richiesti")
        }

        if (password.length < 6) {
          throw new Error("Password deve essere almeno 6 caratteri")
        }

        // Controlla se l'utente esiste già
        const existingUsers = JSON.parse(localStorage.getItem("budgetapp-all-users") || "[]")
        console.log("👥 Existing users count:", existingUsers.length)

        if (existingUsers.find((u: any) => u.email === email)) {
          throw new Error("Email già registrata")
        }

        // Crea nuovo utente
        const newUser: User = {
          id: Date.now(),
          email,
          name,
          createdAt: new Date().toISOString(),
        }

        // Salva nella lista utenti con dati aggiuntivi
        const userWithCredentials = {
          ...newUser,
          password,
          securityQuestion: securityQuestion || null,
          securityAnswer: securityAnswer || null,
        }

        const allUsers = [...existingUsers, userWithCredentials]
        localStorage.setItem("budgetapp-all-users", JSON.stringify(allUsers))
        console.log("💾 Saved user to all-users list")

        // Salva utente corrente
        localStorage.setItem("budgetapp-user", JSON.stringify(newUser))
        console.log("💾 Saved current user")

        setState({
          user: newUser,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        })

        console.log("✅ Registration successful - auth state updated:", newUser.email)
        return { success: true }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Errore durante la registrazione"
        console.error("❌ Registration error:", error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))
        return { success: false, error: errorMessage }
      }
    },
    [],
  )

  const login = useCallback(async (email: string, password: string) => {
    console.log("🔄 Starting login process...")
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      console.log("🔐 Attempting login for:", email)
      console.log("🔑 Password length:", password.length)

      // Carica utenti esistenti dal localStorage
      let allUsers = JSON.parse(localStorage.getItem("budgetapp-all-users") || "[]")
      console.log("👥 Found users in storage:", allUsers.length)

      // Se non ci sono utenti salvati, inizializza con utenti predefiniti
      if (allUsers.length === 0) {
        console.log("📝 No users found, initializing with default users")
        allUsers = DEFAULT_USERS
        localStorage.setItem("budgetapp-all-users", JSON.stringify(allUsers))
        console.log("💾 Saved default users to storage")
      }

      console.log(
        "👥 Available users:",
        allUsers.map((u: any) => ({
          email: u.email,
          hasPassword: !!u.password,
          passwordLength: u.password?.length || 0,
        })),
      )

      // Cerca l'utente
      const foundUser = allUsers.find((u: any) => {
        const emailMatch = u.email.toLowerCase().trim() === email.toLowerCase().trim()
        const passwordMatch = u.password === password
        console.log(`🔍 Checking user ${u.email}:`)
        console.log(
          `  - Email match: ${emailMatch} (${u.email.toLowerCase().trim()} === ${email.toLowerCase().trim()})`,
        )
        console.log(`  - Password match: ${passwordMatch} (${u.password} === ${password})`)
        return emailMatch && passwordMatch
      })

      if (!foundUser) {
        console.log("❌ User not found or password incorrect")
        console.log("🔍 Tried to match:", { email: email.toLowerCase().trim(), password })
        throw new Error("Email o password non corretti")
      }

      console.log("✅ User found:", foundUser.email)

      const user: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        createdAt: foundUser.createdAt,
      }

      localStorage.setItem("budgetapp-user", JSON.stringify(user))
      console.log("💾 Saved current user to storage")

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })

      console.log("✅ Login successful - auth state updated:", user.email)

      // Force a small delay to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 100))

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Errore durante il login"
      console.error("❌ Login error:", error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const logout = useCallback(() => {
    console.log("🔐 Logging out user")
    localStorage.removeItem("budgetapp-user")
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    })
  }, [])

  // Debug log dello stato corrente
  console.log("🔍 useNeonAuth state:", {
    hasUser: !!state.user,
    userEmail: state.user?.email,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
  })

  return {
    ...state,
    register,
    login,
    logout,
  }
}
