// Utility to help generate proper iOS icons from the source logo
export interface IconSpec {
  size: number
  filename: string
  purpose: "any" | "maskable" | "apple"
  padding?: number
}

export const IOS_ICON_SPECS: IconSpec[] = [
  // Apple Touch Icons (iOS specific)
  { size: 180, filename: "apple-touch-icon.png", purpose: "apple" },
  { size: 167, filename: "apple-touch-icon-167x167.png", purpose: "apple" },
  { size: 152, filename: "apple-touch-icon-152x152.png", purpose: "apple" },
  { size: 120, filename: "apple-touch-icon-120x120.png", purpose: "apple" },

  // PWA Icons with proper padding for maskable
  { size: 512, filename: "icon-512x512.png", purpose: "maskable", padding: 80 },
  { size: 384, filename: "icon-384x384.png", purpose: "maskable", padding: 60 },
  { size: 192, filename: "icon-192x192.png", purpose: "maskable", padding: 30 },
  { size: 144, filename: "icon-144x144.png", purpose: "maskable", padding: 22 },
  { size: 128, filename: "icon-128x128.png", purpose: "maskable", padding: 20 },
  { size: 96, filename: "icon-96x96.png", purpose: "maskable", padding: 15 },
  { size: 72, filename: "icon-72x72.png", purpose: "maskable", padding: 11 },
]

export const ICON_REQUIREMENTS = {
  // iOS specific requirements
  ios: {
    format: "PNG",
    colorSpace: "sRGB",
    compression: "lossless",
    background: "opaque", // iOS doesn't support transparency
    cornerRadius: "none", // iOS applies its own corner radius
    minSize: 57,
    maxSize: 1024,
    recommendedSizes: [180, 167, 152, 120],
  },

  // PWA maskable requirements
  maskable: {
    format: "PNG",
    safeZone: "20%", // 20% padding from edges
    background: "solid", // Should have solid background
    aspectRatio: "1:1",
    minContrast: "3:1",
  },
}

// Helper function to validate icon specifications
export function validateIconSpecs(sourceLogoPath: string): {
  isValid: boolean
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []

  // Check if source logo exists and meets requirements
  recommendations.push(
    "Ensure source logo is at least 1024x1024px for best quality",
    "Use PNG format with transparent background for source",
    "Maintain square aspect ratio (1:1)",
    "Use vector format (SVG) as source when possible",
  )

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  }
}
