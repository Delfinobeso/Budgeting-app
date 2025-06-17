"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
  className?: string
  animated?: boolean
}

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  children,
  className = "",
  animated = true,
}: CircularProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage)
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setAnimatedPercentage(percentage)
    }
  }, [percentage, animated])

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f3f4f6" strokeWidth={strokeWidth} fill="transparent" />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#000000"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}
