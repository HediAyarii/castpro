"use client"

import { useState, useEffect } from "react"
import { NetflixOpeningAnimation } from "@/components/netflix-opening-animation"

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    // Check if animation has been shown before in this session
    const hasShownAnimation = sessionStorage.getItem('castpro-animation-shown')
    if (hasShownAnimation) {
      setShowAnimation(false)
    } else {
      // Mark animation as shown for this session
      sessionStorage.setItem('castpro-animation-shown', 'true')
    }
  }, [])

  const handleAnimationComplete = () => {
    setShowAnimation(false)
  }

  return (
    <>
      {showAnimation && (
        <NetflixOpeningAnimation onComplete={handleAnimationComplete} />
      )}
      {children}
    </>
  )
}
