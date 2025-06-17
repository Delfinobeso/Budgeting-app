"use server"

import { sql, validateEmail } from "@/lib/db"
import type { DbUser, CreateUserData } from "@/types/database"
import { revalidatePath } from "next/cache"

export async function createUser(data: CreateUserData): Promise<{ success: boolean; user?: DbUser; error?: string }> {
  try {
    // Validazione
    if (!validateEmail(data.email)) {
      return { success: false, error: "Email non valida" }
    }

    // Verifica se l'utente esiste già
    const existingUser = await sql`
      SELECT id, email, name, created_at, updated_at 
      FROM users 
      WHERE email = ${data.email}
    `

    if (existingUser.length > 0) {
      return { success: true, user: existingUser[0] as DbUser }
    }

    // Crea nuovo utente
    const result = await sql`
      INSERT INTO users (email, name)
      VALUES (${data.email}, ${data.name || null})
      RETURNING id, email, name, created_at, updated_at
    `

    const user = result[0] as DbUser

    revalidatePath("/dashboard")
    return { success: true, user }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante la creazione dell'utente",
    }
  }
}

export async function getUserByEmail(email: string): Promise<{ success: boolean; user?: DbUser; error?: string }> {
  try {
    if (!validateEmail(email)) {
      return { success: false, error: "Email non valida" }
    }

    const result = await sql`
      SELECT id, email, name, created_at, updated_at 
      FROM users 
      WHERE email = ${email}
    `

    if (result.length === 0) {
      return { success: false, error: "Utente non trovato" }
    }

    return { success: true, user: result[0] as DbUser }
  } catch (error) {
    console.error("Error getting user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero dell'utente",
    }
  }
}

export async function updateUser(
  id: number,
  data: Partial<CreateUserData>,
): Promise<{ success: boolean; user?: DbUser; error?: string }> {
  try {
    if (data.email && !validateEmail(data.email)) {
      return { success: false, error: "Email non valida" }
    }

    const result = await sql`
      UPDATE users 
      SET 
        email = COALESCE(${data.email || null}, email),
        name = COALESCE(${data.name || null}, name),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, email, name, created_at, updated_at
    `

    if (result.length === 0) {
      return { success: false, error: "Utente non trovato" }
    }

    const user = result[0] as DbUser

    revalidatePath("/dashboard")
    return { success: true, user }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante l'aggiornamento dell'utente",
    }
  }
}
