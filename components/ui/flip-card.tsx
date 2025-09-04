"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface FlipCardProps {
  frontContent: React.ReactNode
  backContent: React.ReactNode
  className?: string
}

export function FlipCard({ frontContent, backContent, className }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className={cn(
        "relative w-full h-80 perspective-1000",
        className
      )}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d",
          isFlipped ? "rotate-y-180" : "rotate-y-0"
        )}
      >
        {/* Front side */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {frontContent}
        </div>
        
        {/* Back side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          {backContent}
        </div>
      </div>
    </div>
  )
}
