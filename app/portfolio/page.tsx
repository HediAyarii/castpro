"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Filter, Search, X } from "lucide-react"
import Link from "next/link"

export default function PortfolioPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<{ src: string; name: string; age: string } | null>(null)
  const [talents, setTalents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch talents from database (portfolio principal uniquement)
  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const response = await fetch('/api/portfolio')
        if (response.ok) {
          const data = await response.json()
          setTalents(data)
        } else {
          console.error('Failed to fetch talents')
          setTalents([])
        }
      } catch (error) {
        console.error('Error fetching talents:', error)
        setTalents([])
      } finally {
        setLoading(false)
      }
    }

    fetchTalents()
  }, [])



  // Dynamic categories based on actual data
  const [categories, setCategories] = useState([
    { id: "all", name: "Tous", count: 0 },
    { id: "enfants", name: "Enfants", count: 0 },
    { id: "jeunes", name: "Jeunes", count: 0 },
    { id: "seniors", name: "Seniors", count: 0 },
  ])

  // Filtrer les talents selon l'onglet actif
  const getFilteredTalents = () => {
    return talents.filter((talent) => {
      const matchesCategory = selectedCategory === "all" || talent.category === selectedCategory
      const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }

  const filteredTalents = getFilteredTalents()

  // Update categories count when talents change
  useEffect(() => {
    setCategories([
      { id: "all", name: "Tous", count: talents.length },
      { id: "enfants", name: "Enfants", count: talents.filter(t => t.category === "enfants").length },
      { id: "jeunes", name: "Jeunes", count: talents.filter(t => t.category === "jeunes").length },
      { id: "seniors", name: "Seniors", count: talents.filter(t => t.category === "seniors").length },
    ])
  }, [talents])

  const openImageModal = (image: string, name: string, age: string) => {
    setSelectedImage({ src: image, name, age })
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }






  // Fonction pour obtenir l'URL correcte de l'image
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg"
    
    // Si c'est déjà une URL complète
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // Si c'est un chemin relatif, le construire correctement
    if (imagePath.startsWith('/')) {
      return imagePath
    }
    
    // Sinon, ajouter le slash
    return `/${imagePath}`
  }

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeImageModal()
      }
    }

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [selectedImage])

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Cursor */}
      <div
        className="fixed w-5 h-5 bg-primary rounded-full pointer-events-none z-50 transition-all duration-100 ease-out shadow-lg"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          boxShadow: "0 0 15px rgba(220, 38, 38, 0.5)",
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <img
                  src="/images/castpro.png"
                  alt="CAST Logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#services" className="text-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="/#casting" className="text-foreground hover:text-primary transition-colors">
                Casting
              </Link>
              <Link href="/#talents" className="text-foreground hover:text-primary transition-colors">
                Talents
              </Link>
              <Link href="/#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
            <Button className="bg-primary hover:bg-primary/90">Rejoindre</Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold font-space-grotesk mb-2">Portfolio des Talents</h1>
              <p className="text-xl text-muted-foreground">Découvrez nos artistes exceptionnels</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un talent..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Principal */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Portfolio Principal</h2>
            <p className="text-muted-foreground">Nos talents publics disponibles</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">Chargement des talents...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {talents.map((talent) => (
                <Card
                  key={talent.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className="relative h-80 overflow-hidden cursor-pointer"
                    onClick={() => openImageModal(getImageUrl(talent.image), talent.name, talent.age)}
                  >
                    <img
                      src={getImageUrl(talent.image)}
                      alt={talent.name}
                      className="w-full h-full object-cover bg-gray-50 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="text-sm font-medium">Cliquer pour agrandir</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold font-space-grotesk mb-1">{talent.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{talent.age}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {talents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Aucun talent public disponible.</p>
            </div>
          )}
        </div>
      </section>



      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.name}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />

              <div className="mt-4 text-center text-white">
                <h3 className="text-2xl font-bold font-space-grotesk">{selectedImage.name}</h3>
                <p className="text-lg text-white/80">{selectedImage.age}</p>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
