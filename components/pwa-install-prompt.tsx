"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Share } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    setIsStandalone(standalone)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay if not iOS and not already installed
      if (!iOS && !standalone) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // For iOS, show manual install instructions
    if (iOS && !standalone) {
      setTimeout(() => setShowPrompt(true), 5000)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setShowPrompt(false)
      }
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true")
  }

  // Don't show if already dismissed this session
  if (sessionStorage.getItem("pwa-prompt-dismissed") || isStandalone) {
    return null
  }

  if (!showPrompt) return null

  return (
    <div className="pwa-install-prompt show">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Installa Mobius</h3>
            <p className="text-sm text-gray-300">Accesso rapido dalla home screen</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-white hover:bg-white/10 p-2">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {isIOS ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-300">Per installare l'app:</p>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Share className="h-4 w-4" />
            <span>Tocca il pulsante Condividi</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Download className="h-4 w-4" />
            <span>Seleziona "Aggiungi alla schermata Home"</span>
          </div>
        </div>
      ) : (
        <Button onClick={handleInstall} className="w-full bg-white text-black hover:bg-gray-100 ios-button">
          <Download className="h-4 w-4 mr-2" />
          Installa App
        </Button>
      )}
    </div>
  )
}
