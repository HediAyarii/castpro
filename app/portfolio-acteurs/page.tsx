"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Heart, Share2, Eye, Lock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function PortfolioActeurs() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const authStatus = sessionStorage.getItem("portfolio-auth")
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "CASTPRO2024") {
      sessionStorage.setItem("portfolio-auth", "authenticated")
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Code d'accès incorrect")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("portfolio-auth")
    setIsAuthenticated(false)
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold font-space-grotesk mb-2">Accès Sécurisé</h1>
              <p className="text-muted-foreground">
                Entrez le code d'accès pour consulter le portfolio exclusif des acteurs
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Code d'accès"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center text-lg tracking-widest"
                />
                {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}
              </div>
              <Button type="submit" className="w-full" size="lg">
                Accéder au Portfolio
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Retour au site principal
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const actors = [
    {
      id: 1,
      name: "Sophie Martin",
      age: 28,
      specialty: "Théâtre Classique",
      image: "/placeholder.svg?height=400&width=300",
      experience: "8 ans",
      location: "Paris",
    },
    {
      id: 2,
      name: "Alexandre Dubois",
      age: 35,
      specialty: "Cinéma d'Auteur",
      image: "/placeholder.svg?height=400&width=300",
      experience: "12 ans",
      location: "Lyon",
    },
    {
      id: 3,
      name: "Camille Rousseau",
      age: 24,
      specialty: "Comédie Musicale",
      image: "/placeholder.svg?height=400&width=300",
      experience: "5 ans",
      location: "Marseille",
    },
    {
      id: 4,
      name: "Thomas Leroy",
      age: 42,
      specialty: "Drame Psychologique",
      image: "/placeholder.svg?height=400&width=300",
      experience: "18 ans",
      location: "Bordeaux",
    },
    {
      id: 5,
      name: "Emma Moreau",
      age: 31,
      specialty: "Télévision",
      image: "/placeholder.svg?height=400&width=300",
      experience: "10 ans",
      location: "Nice",
    },
    {
      id: 6,
      name: "Lucas Bernard",
      age: 26,
      specialty: "Action & Aventure",
      image: "/placeholder.svg?height=400&width=300",
      experience: "6 ans",
      location: "Toulouse",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour au site</span>
            </Link>
            <h1 className="text-xl font-bold font-space-grotesk">Portfolio Exclusif - Acteurs</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{actors.length} Talents</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-space-grotesk mb-4">Portraits Professionnels</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection exclusive d'acteurs talentueux avec leurs portraits professionnels haute
              définition
            </p>
          </div>

          {/* Actors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actors.map((actor) => (
              <Card
                key={actor.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={actor.image || "/placeholder.svg"}
                    alt={`Portrait de ${actor.name}`}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => toggleFavorite(actor.id)}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(actor.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-primary/90 text-white">{actor.specialty}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-space-grotesk mb-2">{actor.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Âge:</strong> {actor.age} ans
                    </p>
                    <p>
                      <strong>Expérience:</strong> {actor.experience}
                    </p>
                    <p>
                      <strong>Localisation:</strong> {actor.location}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir Profil
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Charger plus d'acteurs
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
