"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "Errore di configurazione del server"
      case "AccessDenied":
        return "Accesso negato"
      case "Verification":
        return "Token di verifica non valido"
      default:
        return "Si è verificato un errore durante l'accesso"
    }
  }

  return (
    <div className="min-h-screen bg-black font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-white rounded-4xl shadow-xl p-8">
          <CardHeader className="p-0 mb-6">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-black mb-2">Errore di Accesso</h1>
              <p className="text-gray-600">{getErrorMessage(error)}</p>
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700">Non è stato possibile completare l'accesso</span>
              </div>
            </div>

            <Button asChild className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-2xl">
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Riprova
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
