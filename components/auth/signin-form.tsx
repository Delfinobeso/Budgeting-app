"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EnhancedCircularProgress } from "../enhanced-circular-progress"
import { Chrome, Shield, Zap, Users } from "lucide-react"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", {
        redirectTo: "/",
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Hero Card */}
        <div className="mb-8 animate-fade-in">
          <Card className="bg-white rounded-4xl shadow-2xl p-8 hover:scale-105 transition-all duration-300">
            <CardContent className="p-0 text-center">
              <div className="mb-6">
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-black mb-2">Accesso Sicuro</h3>
                <p className="text-sm text-gray-600">Proteggi i tuoi dati finanziari</p>
              </div>

              <div className="mb-6">
                <EnhancedCircularProgress percentage={85} size={120} color="#22c55e">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-xs text-gray-600">Sicuro</div>
                  </div>
                </EnhancedCircularProgress>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Crittografia</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-full h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Privacy</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-14 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Form */}
        <div className="animate-slide-up">
          <Card className="bg-white rounded-4xl shadow-xl p-8">
            <CardHeader className="p-0 mb-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-black mb-2">Benvenuto</h1>
                <p className="text-gray-600">Accedi per gestire il tuo budget</p>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
              {/* Google Sign In Button */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-14 bg-white hover:bg-gray-50 text-black border-2 border-gray-200 rounded-3xl transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                    <span>Accesso in corso...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Chrome className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Continua con Google</span>
                  </div>
                )}
              </Button>

              {/* Features */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Dati protetti e crittografati</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Accesso rapido e sicuro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Sincronizzazione multi-dispositivo</span>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  Accedendo accetti i nostri{" "}
                  <a href="#" className="text-black hover:underline">
                    Termini di Servizio
                  </a>{" "}
                  e{" "}
                  <a href="#" className="text-black hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Card className="bg-gray-900 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-xs text-white font-medium">Sicurezza</div>
          </Card>
          <Card className="bg-gray-900 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-xs text-white font-medium">Velocità</div>
          </Card>
          <Card className="bg-gray-900 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-xs text-white font-medium">Mobile</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
