"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Eye } from "lucide-react"

export function IconDebugPanel() {
  const [isVisible, setIsVisible] = useState(false)

  const iconSizes = [
    { size: "180x180", path: "/icons/apple-touch-icon.png", type: "Apple Touch Icon" },
    { size: "167x167", path: "/icons/apple-touch-icon-167x167.png", type: "iPad Pro" },
    { size: "152x152", path: "/icons/apple-touch-icon-152x152.png", type: "iPad" },
    { size: "120x120", path: "/icons/apple-touch-icon-120x120.png", type: "iPhone" },
    { size: "512x512", path: "/icons/icon-512x512.png", type: "PWA Large" },
    { size: "192x192", path: "/icons/icon-192x192.png", type: "PWA Standard" },
  ]

  const clearIconCache = () => {
    // Force reload of icons by adding timestamp
    const timestamp = Date.now()
    iconSizes.forEach((icon) => {
      const link = document.querySelector(`link[href="${icon.path}"]`) as HTMLLinkElement
      if (link) {
        link.href = `${icon.path}?v=${timestamp}`
      }
    })

    // Clear service worker cache if available
    if ("serviceWorker" in navigator && "caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes("icon") || name.includes("image")) {
            caches.delete(name)
          }
        })
      })
    }

    alert("Icon cache cleared! Please refresh the page and re-add to home screen.")
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 z-40 bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <Eye className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-20 right-4 w-80 max-h-96 overflow-y-auto z-40 bg-white shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Icon Debug Panel</CardTitle>
          <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm" className="h-6 w-6 p-0">
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={clearIconCache} className="w-full bg-red-600 hover:bg-red-700 text-white" size="sm">
          <RefreshCw className="w-3 h-3 mr-1" />
          Clear Icon Cache
        </Button>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-600">Current Icons:</h4>
          {iconSizes.map((icon) => (
            <div key={icon.size} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <img
                src={icon.path || "/placeholder.svg"}
                alt={`${icon.type} ${icon.size}`}
                className="w-8 h-8 rounded border"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{icon.type}</div>
                <div className="text-xs text-gray-500">{icon.size}</div>
              </div>
              <a href={icon.path} download className="text-blue-600 hover:text-blue-800">
                <Download className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Debug Steps:</strong>
          </p>
          <p>1. Check if icons load correctly above</p>
          <p>2. Clear cache if icons are outdated</p>
          <p>3. Remove app from home screen</p>
          <p>4. Re-add to home screen</p>
        </div>
      </CardContent>
    </Card>
  )
}
