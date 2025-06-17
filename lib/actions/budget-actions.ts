"use server"

import { sql, validateBudgetAmount } from "@/lib/db"
import type { DbBudget, CreateBudgetData } from "@/types/database"
import { revalidatePath } from "next/cache"

export async function createBudget(
  data: CreateBudgetData,
): Promise<{ success: boolean; budget?: DbBudget; error?: string }> {
  try {
    // Validazione
    if (!validateBudgetAmount(data.total_amount)) {
      return { success: false, error: "Importo budget non valido" }
    }

    if (data.month < 1 || data.month > 12) {
      return { success: false, error: "Mese non valido" }
    }

    if (data.year < 2020 || data.year > 2030) {
      return { success: false, error: "Anno non valido" }
    }

    // Verifica se esiste già un budget per questo mese/anno
    const existingBudget = await sql`
      SELECT id FROM budgets 
      WHERE user_id = ${data.user_id} 
      AND month = ${data.month} 
      AND year = ${data.year}
    `

    if (existingBudget.length > 0) {
      return { success: false, error: "Budget già esistente per questo periodo" }
    }

    // Crea nuovo budget
    const result = await sql`
      INSERT INTO budgets (user_id, total_amount, categories_json, month, year)
      VALUES (${data.user_id}, ${data.total_amount}, ${JSON.stringify(data.categories_json)}, ${data.month}, ${data.year})
      RETURNING id, user_id, total_amount, categories_json, month, year, created_at, updated_at
    `

    const budget = result[0] as DbBudget

    revalidatePath("/dashboard")
    return { success: true, budget }
  } catch (error) {
    console.error("Error creating budget:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante la creazione del budget",
    }
  }
}

export async function getBudgetsByUser(
  userId: number,
): Promise<{ success: boolean; budgets?: DbBudget[]; error?: string }> {
  try {
    const result = await sql`
      SELECT id, user_id, total_amount, categories_json, month, year, created_at, updated_at
      FROM budgets 
      WHERE user_id = ${userId}
      ORDER BY year DESC, month DESC
    `

    return { success: true, budgets: result as DbBudget[] }
  } catch (error) {
    console.error("Error getting budgets:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero dei budget",
    }
  }
}

export async function getCurrentBudget(
  userId: number,
): Promise<{ success: boolean; budget?: DbBudget; error?: string }> {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    const result = await sql`
      SELECT id, user_id, total_amount, categories_json, month, year, created_at, updated_at
      FROM budgets 
      WHERE user_id = ${userId} 
      AND month = ${currentMonth} 
      AND year = ${currentYear}
    `

    if (result.length === 0) {
      return { success: false, error: "Budget corrente non trovato" }
    }

    return { success: true, budget: result[0] as DbBudget }
  } catch (error) {
    console.error("Error getting current budget:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero del budget corrente",
    }
  }
}

export async function updateBudget(
  id: number,
  data: Partial<CreateBudgetData>,
): Promise<{ success: boolean; budget?: DbBudget; error?: string }> {
  try {
    if (data.total_amount && !validateBudgetAmount(data.total_amount)) {
      return { success: false, error: "Importo budget non valido" }
    }

    const result = await sql`
      UPDATE budgets 
      SET 
        total_amount = COALESCE(${data.total_amount || null}, total_amount),
        categories_json = COALESCE(${data.categories_json ? JSON.stringify(data.categories_json) : null}, categories_json),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, user_id, total_amount, categories_json, month, year, created_at, updated_at
    `

    if (result.length === 0) {
      return { success: false, error: "Budget non trovato" }
    }

    const budget = result[0] as DbBudget

    revalidatePath("/dashboard")
    return { success: true, budget }
  } catch (error) {
    console.error("Error updating budget:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante l'aggiornamento del budget",
    }
  }
}

export async function deleteBudget(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Prima elimina tutte le spese associate
    await sql`DELETE FROM expenses WHERE budget_id = ${id}`

    // Poi elimina il budget
    const result = await sql`DELETE FROM budgets WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return { success: false, error: "Budget non trovato" }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting budget:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante l'eliminazione del budget",
    }
  }
}
