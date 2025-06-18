"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  email: string
  name: string
  avatar: string
  avatarBg: string
  createdAt: string
}

interface AuthResult {
  success: boolean
  error?: string
  user?: User
}

// Avatar 3D characters e sfondi colorati
const AVATAR_CHARACTERS = [
  "🧑‍💼",
  "👩‍💻",
  "🧑‍🎨",
  "👨‍🔬",
  "👩‍🚀",
  "🧑‍🍳",
  "👨‍🎓",
  "👩‍⚕️",
  "🧑‍🏫",
  "👨‍💼",
  "👩‍🎨",
  "🧑‍🔧",
  "👨‍🌾",
  "👩‍🏭",
  "🧑‍💻",
  "👨‍🎤",
]

const AVATAR_BACKGROUNDS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)",
  "linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)",
]

// Utenti predefiniti con avatar
const DEFAULT_USERS = [
  {
    id: "demo-1",
    email: "demo@test.com",
    password: "123456",
    name: "Demo User",
    avatar: "🧑‍💼",
    avatarBg: AVATAR_BACKGROUNDS[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: "test-1",
    email: "test@example.com",
    password: "password",
    name: "Test User",
    avatar: "👩‍💻",
    avatarBg: AVATAR_BACKGROUNDS[1],
    createdAt: new Date().toISOString(),
  },
]

export function useAuthSystem() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Inizializza il sistema di autenticazione
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = useCallback(async () => {
    try {
      console.log("🔄 Initializing auth system...")

      // Carica utente corrente
      const currentUser = localStorage.getItem("auth-current-user")
      if (currentUser) {
        const user = JSON.parse(currentUser)
        console.log("✅ Found current user:", user.email)
        setUser(user)
        setIsAuthenticated(true)
      }

      // Inizializza utenti predefiniti se necessario
      const allUsers = localStorage.getItem("auth-all-users")
      if (!allUsers) {
        console.log("📝 Initializing default users...")
        localStorage.setItem("auth-all-users", JSON.stringify(DEFAULT_USERS))
      }
    } catch (error) {
      console.error("❌ Auth initialization error:", error)
    } finally {
      setIsLoading(false)
      console.log("✅ Auth system initialized")
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    console.log("🔐 Login attempt:", email)

    try {
      // Simula delay di rete
      await new Promise((resolve) => setTimeout(resolve, 500))

      const allUsers = JSON.parse(localStorage.getItem("auth-all-users") || "[]")
      const foundUser = allUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )

      if (!foundUser) {
        console.log("❌ Login failed: Invalid credentials")
        return { success: false, error: "Email o password non corretti" }
      }

      const user: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        avatar: foundUser.avatar,
        avatarBg: foundUser.avatarBg,
        createdAt: foundUser.createdAt,
      }

      // Salva utente corrente
      localStorage.setItem("auth-current-user", JSON.stringify(user))

      // Aggiorna stato
      setUser(user)
      setIsAuthenticated(true)

      console.log("✅ Login successful:", user.email)
      return { success: true, user }
    } catch (error) {
      console.error("❌ Login error:", error)
      return { success: false, error: "Errore durante il login" }
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string): Promise<AuthResult> => {
    console.log("📝 Registration attempt:", email)

    try {
      // Simula delay di rete
      await new Promise((resolve) => setTimeout(resolve, 800))

      const allUsers = JSON.parse(localStorage.getItem("auth-all-users") || "[]")

      // Controlla se email esiste già
      if (allUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: "Email già registrata" }
      }

      // Crea nuovo utente con avatar casuale
      const randomAvatar = AVATAR_CHARACTERS[Math.floor(Math.random() * AVATAR_CHARACTERS.length)]
      const randomBg = AVATAR_BACKGROUNDS[Math.floor(Math.random() * AVATAR_BACKGROUNDS.length)]

      const newUserData = {
        id: `user-${Date.now()}`,
        email,
        password,
        name,
        avatar: randomAvatar,
        avatarBg: randomBg,
        createdAt: new Date().toISOString(),
      }

      // Salva nella lista utenti
      allUsers.push(newUserData)
      localStorage.setItem("auth-all-users", JSON.stringify(allUsers))

      const user: User = {
        id: newUserData.id,
        email: newUserData.email,
        name: newUserData.name,
        avatar: newUserData.avatar,
        avatarBg: newUserData.avatarBg,
        createdAt: newUserData.createdAt,
      }

      // Salva utente corrente
      localStorage.setItem("auth-current-user", JSON.stringify(user))

      // Aggiorna stato
      setUser(user)
      setIsAuthenticated(true)

      console.log("✅ Registration successful:", user.email)
      return { success: true, user }
    } catch (error) {
      console.error("❌ Registration error:", error)
      return { success: false, error: "Errore durante la registrazione" }
    }
  }, [])

  const logout = useCallback(() => {
    console.log("🔐 Logging out user:", user?.email)

    // Rimuovi utente corrente
    localStorage.removeItem("auth-current-user")

    // Reset stato
    setUser(null)
    setIsAuthenticated(false)

    console.log("✅ Logout successful - session cleared")

    // Force page reload to ensure clean state
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }, [user])

  const updateProfile = useCallback(
    (updates: Partial<Pick<User, "name" | "avatar" | "avatarBg">>) => {
      if (!user) return

      const updatedUser = { ...user, ...updates }

      // Aggiorna utente corrente
      localStorage.setItem("auth-current-user", JSON.stringify(updatedUser))

      // Aggiorna nella lista utenti
      const allUsers = JSON.parse(localStorage.getItem("auth-all-users") || "[]")
      const userIndex = allUsers.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        allUsers[userIndex] = { ...allUsers[userIndex], ...updates }
        localStorage.setItem("auth-all-users", JSON.stringify(allUsers))
      }

      setUser(updatedUser)
      console.log("✅ Profile updated")
    },
    [user],
  )

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    avatarCharacters: AVATAR_CHARACTERS,
    avatarBackgrounds: AVATAR_BACKGROUNDS,
  }
}
