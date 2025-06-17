import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Middleware aggiuntivo se necessario
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Proteggi tutte le route tranne quelle di auth
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true
        }
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
