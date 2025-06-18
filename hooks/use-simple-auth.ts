"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
}

// Utenti predefiniti per test
const TEST_USERS = [
  { id: "1", email: "demo@test.com", password: "123456", name: "Demo User" },
  { id: "2", email: "test@example.com", password: "password", name: "Test User" },
]

export function useSimpleAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carica utente salvato all'avvio
  useEffect(() => {
    const savedUser = localStorage.getItem("current-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error loading user:", error)
        localStorage.removeItem("current-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Cerca negli utenti test
    const testUser = TEST_USERS.find((u) => u.email === email && u.password === password)

    if (testUser) {
      const user: User = {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
      }

      setUser(user)
      localStorage.setItem("current-user", JSON.stringify(user))
      return { success: true }
    }

    // Cerca negli utenti registrati
    const registeredUsers = JSON.parse(localStorage.getItem("registered-users") || "[]")
    const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password)

    if (registeredUser) {
      const user: User = {
        id: registeredUser.id,
        email: registeredUser.email,
        name: registeredUser.name,
      }

      setUser(user)
      localStorage.setItem("current-user", JSON.stringify(user))
      return { success: true }
    }

    return { success: false, error: "Email o password non corretti" }
  }

  const register = async (email: string, password: string, name: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registered-users") || "[]")

    // Controlla se l'email esiste già
    if (registeredUsers.find((u: any) => u.email === email)) {
      return { success: false, error: "Email già registrata" }
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    }

    registeredUsers.push(newUser)
    localStorage.setItem("registered-users", JSON.stringify(registeredUsers))

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    }

    setUser(user)
    localStorage.setItem("current-user", JSON.stringify(user))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("current-user")
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }
}
