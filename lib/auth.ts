import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { sql } from "@vercel/postgres"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Controlla se l'utente esiste già
          const existingUser = await sql`
            SELECT id FROM users WHERE email = ${user.email}
          `

          if (existingUser.rows.length === 0) {
            // Crea nuovo utente
            await sql`
              INSERT INTO users (email, name, created_at, updated_at)
              VALUES (${user.email}, ${user.name}, NOW(), NOW())
            `
          }
          return true
        } catch (error) {
          console.error("Error during sign in:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const userResult = await sql`
            SELECT id, email, name FROM users WHERE email = ${session.user.email}
          `

          if (userResult.rows.length > 0) {
            const user = userResult.rows[0]
            session.user.id = user.id.toString()
          }
        } catch (error) {
          console.error("Error fetching user session:", error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
  },
  secret: process.env.NEXTAUTH_SECRET,
}
