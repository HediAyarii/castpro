"use client"

import { useState, useEffect } from "react"

interface NetflixOpeningAnimationProps {
  onComplete: () => void
}

export function NetflixOpeningAnimation({ onComplete }: NetflixOpeningAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [logoScale, setLogoScale] = useState(0.3)
  const [logoOpacity, setLogoOpacity] = useState(0)
  const [backgroundOpacity, setBackgroundOpacity] = useState(1)

  useEffect(() => {
    // Animation timeline
    const timeline = [
      // Phase 1: Logo appears and scales up (0-800ms)
      { time: 0, action: () => setLogoOpacity(1) },
      { time: 100, action: () => setLogoScale(0.5) },
      { time: 300, action: () => setLogoScale(0.8) },
      { time: 600, action: () => setLogoScale(1) },
      
      // Phase 2: Hold the logo (800-1200ms)
      { time: 800, action: () => setLogoScale(1.1) },
      { time: 1000, action: () => setLogoScale(1) },
      
      // Phase 3: Fade out (1200-2000ms)
      { time: 1200, action: () => setBackgroundOpacity(0.8) },
      { time: 1400, action: () => setBackgroundOpacity(0.4) },
      { time: 1600, action: () => setLogoOpacity(0.7) },
      { time: 1800, action: () => setLogoOpacity(0.3) },
      { time: 1900, action: () => setBackgroundOpacity(0) },
      { time: 2000, action: () => {
        setIsVisible(false)
        onComplete()
      }}
    ]

    // Execute timeline
    timeline.forEach(({ time, action }) => {
      setTimeout(action, time)
    })

    // Cleanup function
    return () => {
      timeline.forEach(({ time }) => {
        clearTimeout(time)
      })
    }
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300"
      style={{ opacity: backgroundOpacity }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50" />
      
      {/* Logo container */}
      <div 
        className="relative z-10 transition-all duration-500 ease-out"
        style={{ 
          transform: `scale(${logoScale})`,
          opacity: logoOpacity
        }}
      >
        {/* Logo with glow effect */}
        <div className="relative">
          <img
                            src="/images/castpro.png"
            alt="CastPro"
            className="h-32 w-auto filter drop-shadow-2xl"
            style={{
              filter: `drop-shadow(0 0 20px rgba(220, 38, 38, 0.8)) drop-shadow(0 0 40px rgba(220, 38, 38, 0.4))`
            }}
          />
          
          {/* Additional glow rings */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-pulse"
            style={{
              transform: 'scale(1.2)',
              animation: 'pulse 1s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute inset-0 rounded-full border border-red-400/20"
            style={{
              transform: 'scale(1.4)'
            }}
          />
        </div>
        
        {/* Text animation */}
        <div 
          className="mt-4 text-center transition-opacity duration-500"
          style={{ opacity: logoOpacity }}
        >
          <h1 
            className="text-2xl font-bold text-white tracking-wider"
            style={{
              textShadow: '0 0 10px rgba(220, 38, 38, 0.8)',
              fontFamily: 'var(--font-space-grotesk)'
            }}
          >
            CAST PRO
          </h1>
        </div>
      </div>
      
      {/* Netflix-style loading dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  )
}
