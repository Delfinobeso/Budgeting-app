"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface EnhancedCircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
  className?: string
  color?: string
  backgroundColor?: string
  animated?: boolean
  showPercentage?: boolean
}

export function EnhancedCircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  children,
  className = "",
  color = "#000000",
  backgroundColor = "#f3f4f6",
  animated = true,
  showPercentage = false,
}: EnhancedCircularProgressProps) {
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ||
          (showPercentage && (
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color }}>
                {Math.round(animatedPercentage)}%
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
