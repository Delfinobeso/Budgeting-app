"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { DbBudget, ActionResult } from "@/types/database"

export async function createBudget(budgetData: {
  user_id: number
  total_amount: number
  categories_json: any
  month: number
  year: number
}): Promise<ActionResult<DbBudget>> {
  try {
    console.log("💰 Creating budget for user:", budgetData.user_id)

    // Validazione
    if (budgetData.total_amount <= 0) {
      return { success: false, error: "Budget deve essere maggiore di 0" }
    }

    if (budgetData.month < 1 || budgetData.month > 12) {
      return { success: false, error: "Mese non valido" }
    }

    if (budgetData.year < 2020) {
      return { success: false, error: "Anno non valido" }
    }

    // Controlla se esiste già un budget per questo mese/anno
    const existing = await sql`
      SELECT id FROM budgets 
      WHERE user_id = ${budgetData.user_id} 
      AND month = ${budgetData.month} 
      AND year = ${budgetData.year}
    `

    if (existing.length > 0) {
      return { success: false, error: "Budget già esistente per questo mese" }
    }

    // Crea nuovo budget
    const result = await sql`
      INSERT INTO budgets (user_id, total_amount, categories_json, month, year)
      VALUES (${budgetData.user_id}, ${budgetData.total_amount}, ${JSON.stringify(budgetData.categories_json)}, ${budgetData.month}, ${budgetData.year})
      RETURNING *
    `

    const budget = result[0] as DbBudget

    console.log("✅ Budget created successfully:", budget.id)
    revalidatePath("/")

    return { success: true, data: budget }
  } catch (error) {
    console.error("❌ Create budget error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante la creazione del budget",
    }
  }
}

export async function getCurrentBudget(userId: number): Promise<ActionResult<DbBudget>> {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    console.log("📊 Getting current budget for user:", userId, `${currentMonth}/${currentYear}`)

    const result = await sql`
      SELECT * FROM budgets 
      WHERE user_id = ${userId} 
      AND month = ${currentMonth} 
      AND year = ${currentYear}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (result.length === 0) {
      console.log("📝 No current budget found")
      return { success: true, data: null }
    }

    const budget = result[0] as DbBudget
    console.log("✅ Current budget found:", budget.id)

    return { success: true, data: budget }
  } catch (error) {
    console.error("❌ Get current budget error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero del budget",
    }
  }
}

export async function getBudgetsByUser(userId: number): Promise<ActionResult<DbBudget[]>> {
  try {
    console.log("📊 Getting all budgets for user:", userId)

    const result = await sql`
      SELECT * FROM budgets 
      WHERE user_id = ${userId}
      ORDER BY year DESC, month DESC
    `

    console.log("✅ Found budgets:", result.length)
    return { success: true, data: result as DbBudget[] }
  } catch (error) {
    console.error("❌ Get budgets error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero dei budget",
    }
  }
}

export async function deleteBudget(budgetId: number, userId: number): Promise<ActionResult> {
  try {
    console.log("🗑️ Deleting budget:", budgetId, "for user:", userId)

    // Verifica che il budget appartenga all'utente
    const budget = await sql`
      SELECT id FROM budgets 
      WHERE id = ${budgetId} AND user_id = ${userId}
    `

    if (budget.length === 0) {
      return { success: false, error: "Budget non trovato o non autorizzato" }
    }

    // Elimina il budget (le spese verranno eliminate automaticamente per CASCADE)
    await sql`
      DELETE FROM budgets 
      WHERE id = ${budgetId} AND user_id = ${userId}
    `

    console.log("✅ Budget deleted successfully")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("❌ Delete budget error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante l'eliminazione del budget",
    }
  }
}
