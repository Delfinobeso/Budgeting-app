import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Test della connessione
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("✅ Database connected:", result[0].current_time)
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Utility per validazione
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}
