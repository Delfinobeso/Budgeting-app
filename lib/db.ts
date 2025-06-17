import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Utility per gestire gli errori del database
export class DatabaseError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message)
    this.name = "DatabaseError"
  }
}

// Utility per validare i dati
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateBudgetAmount(amount: number): boolean {
  return amount > 0 && amount <= 1000000 // Max 1M euro
}

export function validatePercentage(percentage: number): boolean {
  return percentage >= 0 && percentage <= 100
}
