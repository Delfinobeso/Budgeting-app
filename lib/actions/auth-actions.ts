"use server"

import { sql } from "@/lib/db"
import { validateEmail, validatePassword } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { DbUser, ActionResult } from "@/types/database"

// Hash semplice per la password (in produzione usare bcrypt)
function hashPassword(password: string): string {
  return Buffer.from(password).toString("base64")
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export async function registerUser(formData: {
  email: string
  password: string
  name: string
}): Promise<ActionResult<DbUser>> {
  try {
    console.log("🔐 Registering user:", formData.email)

    // Validazione
    if (!validateEmail(formData.email)) {
      return { success: false, error: "Email non valida" }
    }

    if (!validatePassword(formData.password)) {
      return { success: false, error: "Password deve essere almeno 6 caratteri" }
    }

    if (!formData.name.trim()) {
      return { success: false, error: "Nome è richiesto" }
    }

    // Controlla se l'utente esiste già
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${formData.email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "Email già registrata" }
    }

    // Crea nuovo utente
    const passwordHash = hashPassword(formData.password)
    const result = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${formData.email}, ${formData.name}, ${passwordHash})
      RETURNING id, email, name, created_at, updated_at
    `

    const user = result[0] as DbUser

    console.log("✅ User registered successfully:", user.id)
    revalidatePath("/")

    return { success: true, data: user }
  } catch (error) {
    console.error("❌ Registration error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante la registrazione",
    }
  }
}

export async function loginUser(formData: {
  email: string
  password: string
}): Promise<ActionResult<DbUser>> {
  try {
    console.log("🔐 Logging in user:", formData.email)

    // Validazione
    if (!validateEmail(formData.email)) {
      return { success: false, error: "Email non valida" }
    }

    if (!formData.password) {
      return { success: false, error: "Password richiesta" }
    }

    // Trova utente
    const result = await sql`
      SELECT id, email, name, password_hash, created_at, updated_at
      FROM users 
      WHERE email = ${formData.email}
    `

    if (result.length === 0) {
      return { success: false, error: "Email non trovata" }
    }

    const user = result[0] as DbUser

    // Verifica password
    if (!verifyPassword(formData.password, user.password_hash)) {
      return { success: false, error: "Password non corretta" }
    }

    console.log("✅ User logged in successfully:", user.id)
    revalidatePath("/")

    // Rimuovi password_hash dalla risposta
    const { password_hash, ...userWithoutPassword } = user
    return { success: true, data: userWithoutPassword as DbUser }
  } catch (error) {
    console.error("❌ Login error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il login",
    }
  }
}

export async function getUserById(userId: number): Promise<ActionResult<DbUser>> {
  try {
    const result = await sql`
      SELECT id, email, name, created_at, updated_at
      FROM users 
      WHERE id = ${userId}
    `

    if (result.length === 0) {
      return { success: false, error: "Utente non trovato" }
    }

    return { success: true, data: result[0] as DbUser }
  } catch (error) {
    console.error("❌ Get user error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero utente",
    }
  }
}
