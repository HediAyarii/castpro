"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { checkAccessLevel, getRedirectRoute } from "@/lib/auth-config"

interface AuthGuardProps {
  children: React.ReactNode
  requiredLevel: "secret" | "actors"
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requiredLevel, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const authStatus = sessionStorage.getItem(`${requiredLevel}-portfolio-auth`)
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [requiredLevel])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const accessLevel = checkAccessLevel(password)
    
    if (accessLevel === requiredLevel) {
      sessionStorage.setItem(`${requiredLevel}-portfolio-auth`, "authenticated")
      setIsAuthenticated(true)
      setError("")
    } else if (accessLevel !== "none") {
      // Si le code correspond à un autre niveau, rediriger
      const redirectRoute = getRedirectRoute(accessLevel)
      router.push(redirectRoute)
    } else {
      setError("Code d'accès incorrect. Veuillez réessayer.")
      setPassword("")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(`${requiredLevel}-portfolio-auth`)
    setIsAuthenticated(false)
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    const isSecret = requiredLevel === "secret"
    const bgColor = isSecret ? "from-black via-gray-900 to-black" : "from-gray-900 to-black"
    const accentColor = isSecret ? "red" : "blue"
    const title = isSecret ? "Portfolio Secret" : "Portfolio Acteurs"
    const description = isSecret 
      ? "Entrez le code d'accès pour découvrir notre collection exclusive d'acteurs"
      : "Entrez le code d'accès pour consulter le portfolio des acteurs"

    return (
      <div className={`min-h-screen bg-gradient-to-br ${bgColor} flex items-center justify-center`}>
        <div className="max-w-md w-full mx-4">
          <Card className="p-8 bg-gray-900 border-gray-700">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 bg-${accentColor}-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-${accentColor}-600/30`}>
                <Lock className={`w-10 h-10 text-${accentColor}-600`} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
              <p className="text-gray-300">{description}</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Code d'accès"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center text-lg tracking-widest bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                {error && <p className="text-sm text-red-400 mt-2 text-center">{error}</p>}
              </div>
              <Button 
                type="submit" 
                className={`w-full bg-${accentColor}-600 hover:bg-${accentColor}-700`} 
                size="lg"
              >
                <Lock className="w-4 h-4 mr-2" />
                Accéder au Portfolio
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-400 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Retour au site principal
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
