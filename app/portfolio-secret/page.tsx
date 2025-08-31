"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Heart, Share2, LogOut, Star, Award, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePortfolioSecret } from "@/hooks/use-portfolio-secret"

export default function PortfolioSecret() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [accessKey, setAccessKey] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  // Vérifier l'authentification directement depuis sessionStorage (client-only)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = sessionStorage.getItem('access-key-auth')
        if (authData) {
          const parsed = JSON.parse(authData)
          // Vérifier si la clé n'a pas expiré
          if (parsed.expiresAt) {
            const expiresAt = new Date(parsed.expiresAt)
            const now = new Date()
            if (now > expiresAt) {
              sessionStorage.removeItem('access-key-auth')
              window.location.replace("/")
              return
            }
          }
          setAccessKey(parsed)
          setIsLoading(false)
        } else {
          // Pas d'auth -> redirection côté client
          window.location.replace("/")
        }
      } catch (error) {
        sessionStorage.removeItem('access-key-auth')
        window.location.replace("/")
      }
    }
    checkAuth()
  }, [])
  
  const {
    items: secretActors,
    categories,
    isLoading: portfolioLoading,
    error: portfolioError,
    getFilteredItems,
    refreshData
  } = usePortfolioSecret()

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  // Tant que l'auth n'est pas déterminée, ne rien rendre (évite SSR/window)
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

  // Si toujours pas d'accès (sécurité), ne pas accéder à window ici
  if (!accessKey) {
    return null
  }

  // Chargement des données portfolio
  if (portfolioLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Chargement du portfolio...</p>
        </div>
      </div>
    )
  }

  const filteredActors = getFilteredItems(selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour au site</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Portfolio Secret - Collection Exclusive</h1>
              <p className="text-xs text-gray-400">Accès restreint aux professionnels</p>
              {accessKey && (
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-500">
                    {accessKey.timeRemaining ? `Expire dans ${accessKey.timeRemaining} jours` : 'Accès permanent'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-red-600/20 text-red-400 border-red-600/30">
                {filteredActors.length} Talents Secrets
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="border-gray-600 text-gray-300 hover:bg-blue-600 hover:text-white"
                disabled={portfolioLoading}
              >
                <RefreshCw className={`w-4 h-4 ${portfolioLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  sessionStorage.removeItem('access-key-auth')
                  window.location.replace("/")
                }} 
                className="border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white"
              >
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-6 border border-red-600/30">
              <Star className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Collection Secrète d'Acteurs</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Découvrez notre sélection ultra-exclusive d'acteurs de haut niveau, 
              réservée aux professionnels du cinéma et de la télévision
            </p>
            {accessKey && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Clé d'accès :</strong> {accessKey.name}
                  {accessKey.expiresAt && (
                    <span className="ml-4 text-yellow-400">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {accessKey.timeRemaining ? `Expire dans ${accessKey.timeRemaining} jours` : 'Accès permanent'}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Erreur du portfolio */}
          {portfolioError && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
              <div className="text-red-400 text-center">
                <strong>Erreur :</strong>{' '}
                <span>
                  {typeof portfolioError === 'string' ? portfolioError : JSON.stringify(portfolioError)}
                </span>
                <div className="mt-3">
                  <Button 
                    onClick={refreshData} 
                    variant="outline" 
                    size="sm" 
                    className="ml-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    Réessayer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex justify-center mb-8">
              <div className="flex gap-2 p-1 bg-gray-800 rounded-lg border border-gray-700">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-red-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actors Grid */}
          {filteredActors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActors.map((actor) => (
                <Card
                  key={actor.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-gray-900 border-gray-700 hover:border-red-500/50"
                >
                  <div className="relative">
                    <img
                      src={actor.image || "/placeholder.svg"}
                      alt={`Portrait de ${actor.name}`}
                      className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                      onClick={() => openImageModal(actor.image || "/placeholder.svg")}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-black/80 hover:bg-black text-white border-gray-600"
                        onClick={() => toggleFavorite(actor.id)}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(actor.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-black/80 hover:bg-black text-white border-gray-600">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className={`${
                        actor.category === "elite" 
                          ? "bg-yellow-600/90 text-white" 
                          : "bg-red-600/90 text-white"
                      }`}>
                        {actor.category === "elite" ? "⭐ ÉLITE" : "💎 PREMIUM"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-red-600/90 text-white">{actor.specialty}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{actor.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{actor.description}</p>

                    {actor.awards && actor.awards.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-yellow-500">Récompenses</span>
                        </div>
                        <div className="space-y-1">
                          {actor.awards.map((award, index) => (
                            <div key={index} className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                              {award}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-4">Aucun acteur trouvé</h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory === "all" 
                  ? "Aucun acteur n'est disponible dans le portfolio secret pour le moment."
                  : `Aucun acteur trouvé dans la catégorie "${selectedCategory}".`
                }
              </p>
              <Button onClick={refreshData} variant="outline" className="border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={selectedImage}
              alt="Image agrandie"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={closeImageModal}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 p-0"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
