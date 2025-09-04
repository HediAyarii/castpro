"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface CameraLensProps {
  children: React.ReactNode
  className?: string
}

export function CameraLens({ children, className }: CameraLensProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className={cn(
        "relative w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 overflow-hidden transition-all duration-500 ease-out",
        "group-hover:scale-110 group-hover:border-primary/50",
        className
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Lens outer ring */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-500" />
      
      {/* Lens inner ring */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-400" />
      
      {/* Lens aperture - animated */}
      <div 
        className={cn(
          "absolute inset-3 rounded-full bg-black transition-all duration-500 ease-out",
          isOpen ? "scale-75 opacity-80" : "scale-100 opacity-100"
        )}
      />
      
      {/* Lens center with icon */}
      <div 
        className={cn(
          "absolute inset-4 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center transition-all duration-500 ease-out",
          isOpen ? "scale-90" : "scale-100"
        )}
      >
        <div className={cn(
          "transition-all duration-500 ease-out",
          isOpen ? "scale-110" : "scale-100"
        )}>
          {children}
        </div>
      </div>
      
      {/* Lens reflection */}
      <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/20" />
      
      {/* Aperture blades - animated */}
      <div className="absolute inset-0 transition-all duration-500 ease-out">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-1 h-6 bg-gray-800 origin-bottom transition-all duration-500 ease-out",
              isOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"
            )}
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
