"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { DbExpense, ActionResult } from "@/types/database"

export async function createExpense(expenseData: {
  user_id: number
  budget_id: number
  amount: number
  category: string
  description?: string
  date: string
}): Promise<ActionResult<DbExpense>> {
  try {
    console.log("💸 Creating expense for user:", expenseData.user_id)

    // Validazione
    if (expenseData.amount <= 0) {
      return { success: false, error: "Importo deve essere maggiore di 0" }
    }

    if (!expenseData.category.trim()) {
      return { success: false, error: "Categoria richiesta" }
    }

    if (!expenseData.date) {
      return { success: false, error: "Data richiesta" }
    }

    // Verifica che il budget appartenga all'utente
    const budget = await sql`
      SELECT id FROM budgets 
      WHERE id = ${expenseData.budget_id} AND user_id = ${expenseData.user_id}
    `

    if (budget.length === 0) {
      return { success: false, error: "Budget non trovato o non autorizzato" }
    }

    // Crea nuova spesa
    const result = await sql`
      INSERT INTO expenses (user_id, budget_id, amount, category, description, date)
      VALUES (${expenseData.user_id}, ${expenseData.budget_id}, ${expenseData.amount}, ${expenseData.category}, ${expenseData.description || null}, ${expenseData.date})
      RETURNING *
    `

    const expense = result[0] as DbExpense

    console.log("✅ Expense created successfully:", expense.id)
    revalidatePath("/")

    return { success: true, data: expense }
  } catch (error) {
    console.error("❌ Create expense error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante la creazione della spesa",
    }
  }
}

export async function getExpensesByBudget(budgetId: number): Promise<ActionResult<DbExpense[]>> {
  try {
    console.log("📊 Getting expenses for budget:", budgetId)

    const result = await sql`
      SELECT * FROM expenses 
      WHERE budget_id = ${budgetId}
      ORDER BY date DESC, created_at DESC
    `

    console.log("✅ Found expenses:", result.length)
    return { success: true, data: result as DbExpense[] }
  } catch (error) {
    console.error("❌ Get expenses error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero delle spese",
    }
  }
}

export async function getExpensesByUser(userId: number): Promise<ActionResult<DbExpense[]>> {
  try {
    console.log("📊 Getting all expenses for user:", userId)

    const result = await sql`
      SELECT * FROM expenses 
      WHERE user_id = ${userId}
      ORDER BY date DESC, created_at DESC
    `

    console.log("✅ Found expenses:", result.length)
    return { success: true, data: result as DbExpense[] }
  } catch (error) {
    console.error("❌ Get user expenses error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero delle spese",
    }
  }
}

export async function deleteExpense(expenseId: number, userId: number): Promise<ActionResult> {
  try {
    console.log("🗑️ Deleting expense:", expenseId, "for user:", userId)

    // Verifica che la spesa appartenga all'utente
    const expense = await sql`
      SELECT id FROM expenses 
      WHERE id = ${expenseId} AND user_id = ${userId}
    `

    if (expense.length === 0) {
      return { success: false, error: "Spesa non trovata o non autorizzata" }
    }

    // Elimina la spesa
    await sql`
      DELETE FROM expenses 
      WHERE id = ${expenseId} AND user_id = ${userId}
    `

    console.log("✅ Expense deleted successfully")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("❌ Delete expense error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante l'eliminazione della spesa",
    }
  }
}
