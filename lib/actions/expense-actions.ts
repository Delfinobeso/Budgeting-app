"use server"

import { sql } from "@/lib/db"
import type { DbExpense, CreateExpenseData } from "@/types/database"
import { revalidatePath } from "next/cache"

export async function createExpense(
  data: CreateExpenseData,
): Promise<{ success: boolean; expense?: DbExpense; error?: string }> {
  try {
    // Validazione
    if (data.amount <= 0) {
      return { success: false, error: "Importo non valido" }
    }

    if (!data.category || data.category.trim() === "") {
      return { success: false, error: "Categoria richiesta" }
    }

    // Verifica che il budget esista
    const budgetExists = await sql`
      SELECT id FROM budgets WHERE id = ${data.budget_id} AND user_id = ${data.user_id}
    `

    if (budgetExists.length === 0) {
      return { success: false, error: "Budget non trovato" }
    }

    // Crea nuova spesa
    const result = await sql`
      INSERT INTO expenses (user_id, budget_id, amount, category, description, date)
      VALUES (${data.user_id}, ${data.budget_id}, ${data.amount}, ${data.category}, ${data.description || null}, ${data.date})
      RETURNING id, user_id, budget_id, amount, category, description, date, created_at, updated_at
    `

    const expense = result[0] as DbExpense

    revalidatePath("/dashboard")
    return { success: true, expense }
  } catch (error) {
    console.error("Error creating expense:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante la creazione della spesa",
    }
  }
}

export async function getExpensesByBudget(
  budgetId: number,
): Promise<{ success: boolean; expenses?: DbExpense[]; error?: string }> {
  try {
    const result = await sql`
      SELECT id, user_id, budget_id, amount, category, description, date, created_at, updated_at
      FROM expenses 
      WHERE budget_id = ${budgetId}
      ORDER BY date DESC, created_at DESC
    `

    return { success: true, expenses: result as DbExpense[] }
  } catch (error) {
    console.error("Error getting expenses:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero delle spese",
    }
  }
}

export async function getExpensesByUser(
  userId: number,
  limit?: number,
): Promise<{ success: boolean; expenses?: DbExpense[]; error?: string }> {
  try {
    const result = limit
      ? await sql`
          SELECT id, user_id, budget_id, amount, category, description, date, created_at, updated_at
          FROM expenses 
          WHERE user_id = ${userId}
          ORDER BY date DESC, created_at DESC
          LIMIT ${limit}
        `
      : await sql`
          SELECT id, user_id, budget_id, amount, category, description, date, created_at, updated_at
          FROM expenses 
          WHERE user_id = ${userId}
          ORDER BY date DESC, created_at DESC
        `

    return { success: true, expenses: result as DbExpense[] }
  } catch (error) {
    console.error("Error getting user expenses:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero delle spese",
    }
  }
}

export async function updateExpense(
  id: number,
  data: Partial<CreateExpenseData>,
): Promise<{ success: boolean; expense?: DbExpense; error?: string }> {
  try {
    if (data.amount && data.amount <= 0) {
      return { success: false, error: "Importo non valido" }
    }

    const result = await sql`
      UPDATE expenses 
      SET 
        amount = COALESCE(${data.amount || null}, amount),
        category = COALESCE(${data.category || null}, category),
        description = COALESCE(${data.description || null}, description),
        date = COALESCE(${data.date || null}, date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, user_id, budget_id, amount, category, description, date, created_at, updated_at
    `

    if (result.length === 0) {
      return { success: false, error: "Spesa non trovata" }
    }

    const expense = result[0] as DbExpense

    revalidatePath("/dashboard")
    return { success: true, expense }
  } catch (error) {
    console.error("Error updating expense:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante l'aggiornamento della spesa",
    }
  }
}

export async function deleteExpense(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sql`DELETE FROM expenses WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return { success: false, error: "Spesa non trovata" }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting expense:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante l'eliminazione della spesa",
    }
  }
}

export async function getExpenseStats(
  userId: number,
  budgetId?: number,
): Promise<{
  success: boolean
  stats?: {
    totalExpenses: number
    expensesByCategory: { category: string; total: number; count: number }[]
    monthlyTrend: { month: string; total: number }[]
  }
  error?: string
}> {
  try {
    // Statistiche totali
    const totalQuery = budgetId
      ? sql`SELECT COUNT(*) as count, SUM(amount) as total FROM expenses WHERE user_id = ${userId} AND budget_id = ${budgetId}`
      : sql`SELECT COUNT(*) as count, SUM(amount) as total FROM expenses WHERE user_id = ${userId}`

    const totalResult = await totalQuery
    const totalExpenses = Number(totalResult[0]?.total || 0)

    // Spese per categoria
    const categoryQuery = budgetId
      ? sql`
          SELECT category, SUM(amount) as total, COUNT(*) as count 
          FROM expenses 
          WHERE user_id = ${userId} AND budget_id = ${budgetId}
          GROUP BY category 
          ORDER BY total DESC
        `
      : sql`
          SELECT category, SUM(amount) as total, COUNT(*) as count 
          FROM expenses 
          WHERE user_id = ${userId}
          GROUP BY category 
          ORDER BY total DESC
        `

    const categoryResult = await categoryQuery
    const expensesByCategory = categoryResult.map((row) => ({
      category: row.category as string,
      total: Number(row.total),
      count: Number(row.count),
    }))

    // Trend mensile (ultimi 6 mesi)
    const monthlyQuery = sql`
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        SUM(amount) as total
      FROM expenses 
      WHERE user_id = ${userId}
      AND date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month DESC
    `

    const monthlyResult = await monthlyQuery
    const monthlyTrend = monthlyResult.map((row) => ({
      month: row.month as string,
      total: Number(row.total),
    }))

    return {
      success: true,
      stats: {
        totalExpenses,
        expensesByCategory,
        monthlyTrend,
      },
    }
  } catch (error) {
    console.error("Error getting expense stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il recupero delle statistiche",
    }
  }
}
