"use client"

import { useRef } from "react"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Users,
  Film,
  Award,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"

import LocationMap from "@/components/location-map"
import { VideoCollaboration } from "@/components/video-collaboration"
import { FlipCard } from "@/components/ui/flip-card"
import { safeLocalStorage } from "@/lib/storage"



const carouselData = [
  {
    title: "Jeunes Talents",
    subtitle: "Acteurs 16-25 ans",
    description: "Découvrez notre sélection de jeunes talents dynamiques pour vos projets modernes et contemporains.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cp3.jpg-bDYroREYAoSa4NByuLk5PULtyIWJX2.jpeg",
    category: "Jeunes",
  },
  {
    title: "Talents Enfants",
    subtitle: "Acteurs 6-12 ans",
    description: "Une collection exceptionnelle de jeunes acteurs pour vos productions familiales et publicitaires.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cp4.jpg-DI5re0Dg3sWflQwN6AKd0gapxSzsqj.jpeg",
    category: "Enfants",
  },
  {
    title: "Talents Expérimentés",
    subtitle: "Acteurs 50+ ans",
    description: "Des acteurs chevronnés avec une riche expérience pour donner du caractère à vos projets.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cp2.jpg-R9zachVmq4bHRgGeeUkjOAPEB9mo3f.jpeg",
    category: "Seniors",
  },
]

export default function Home() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [counters] = useState({
    talents: 5000,
    productions: 150,
    experience: 12,
    satisfaction: 98,
  })
  const statsRef = useRef<HTMLElement>(null)

  const [portfolioPassword, setPortfolioPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [castings, setCastings] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [partnerLogos, setPartnerLogos] = useState<any[]>([])

  const verifyAccessKey = async (key: string): Promise<boolean> => {
    setAuthLoading(true)
    setAuthError(null)
    
    try {
      const response = await fetch('/api/access-keys/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key })
      })

      const data = await response.json()

      if (data.valid) {
        // Redirection vers le portfolio secret
        console.log("Clé valide, redirection vers le portfolio secret...")
        console.log("Router object:", router)
        console.log("Tentative de redirection...")
        
        // Sauvegarder l'authentification dans sessionStorage AVANT la redirection
        const authData = {
          id: data.accessKey.id,
          name: data.accessKey.name,
          permissions: data.accessKey.permissions,
          expiresAt: data.accessKey.expiresAt,
          timeRemaining: data.accessKey.timeRemaining,
          isActive: data.accessKey.isActive
        }
        sessionStorage.setItem('access-key-auth', JSON.stringify(authData))
        console.log("Authentification sauvegardée dans sessionStorage")
        
        try {
          console.log("Tentative de redirection avec router.push...")
          
          // Essayer d'abord avec router.push
          await router.push("/portfolio-secret")
          console.log("Redirection initiée avec succès")
          
          // Attendre un peu et vérifier si la redirection a fonctionné
          setTimeout(() => {
            console.log("Vérification de l'URL actuelle:", window.location.pathname)
            if (window.location.pathname !== "/portfolio-secret") {
              console.log("Redirection échouée, utilisation de window.location.href...")
              // Forcer la redirection avec window.location
              window.location.replace("/portfolio-secret")
            }
          }, 500)
          
        } catch (error) {
          console.error("Erreur lors de la redirection:", error)
          console.log("Utilisation de window.location.replace comme fallback...")
          // Utiliser replace pour éviter l'historique
          window.location.replace("/portfolio-secret")
        }
        
        return true
      } else {
        setAuthError(data.error || 'Clé d\'accès invalide')
        setPortfolioPassword("")
        return false
      }
    } catch (error) {
      setAuthError('Erreur de connexion au serveur')
      setPortfolioPassword("")
      return false
    } finally {
      setAuthLoading(false)
    }
  }

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [appointmentForm, setAppointmentForm] = useState({
    nom: "",
    prenom: "",
    telephone1: "",
    telephone2: "",
    selectedDate: "",
    selectedTime: "",
  })

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(true)

  // Charger les créneaux disponibles depuis l'API
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setIsLoadingSlots(true)
        const response = await fetch('/api/appointments/available-slots')
        if (response.ok) {
          const slots = await response.json()
          setAvailableSlots(slots)
        } else {
          console.error('Erreur lors du chargement des créneaux:', response.statusText)
          setAvailableSlots([])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des créneaux:', error)
        setAvailableSlots([])
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchAvailableSlots()
  }, [])

  const availableDates = [...new Set(availableSlots.map((slot) => slot.date))]

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    if (!appointmentForm.nom.trim() || !appointmentForm.prenom.trim() || 
        !appointmentForm.telephone1.trim() || !appointmentForm.selectedDate || 
        !appointmentForm.selectedTime) {
      alert("Veuillez remplir tous les champs obligatoires.")
      return
    }

    // Validate phone number format
    const phoneRegex = /^[0-9+\-\s()]+$/
    if (!phoneRegex.test(appointmentForm.telephone1)) {
      alert("Veuillez entrer un numéro de téléphone valide.")
      return
    }

    // Vérifier que le créneau sélectionné est toujours dans la liste des créneaux disponibles
    const selectedSlot = availableSlots.find(
      slot => slot.date === appointmentForm.selectedDate && slot.time === appointmentForm.selectedTime
    )
    
    if (!selectedSlot) {
      alert("Ce créneau n'est plus disponible. Veuillez choisir un autre horaire.")
      return
    }

    const appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      nom: appointmentForm.nom,
      prenom: appointmentForm.prenom,
      telephone1: appointmentForm.telephone1,
      telephone2: appointmentForm.telephone2,
      date: appointmentForm.selectedDate,
      time: appointmentForm.selectedTime,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    }

    try {
      // Save to database via API with timeout and retry logic
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        throw new Error(`Erreur serveur (${response.status}): ${errorText}`)
      }

      const result = await response.json()
      console.log('Appointment saved successfully:', result)

      alert("Rendez-vous demandé avec succès! Nous vous contacterons pour confirmation.")
      setIsAppointmentModalOpen(false)
      setAppointmentForm({
        nom: "",
        prenom: "",
        telephone1: "",
        telephone2: "",
        selectedDate: "",
        selectedTime: "",
      })

      // Recharger les créneaux disponibles après la réservation
      const slotsResponse = await fetch('/api/appointments/available-slots')
      if (slotsResponse.ok) {
        const updatedSlots = await slotsResponse.json()
        setAvailableSlots(updatedSlots)
      }
    } catch (error) {
      console.error('Error saving appointment:', error)
      
      // More specific error messages for mobile users
      let errorMessage = "Erreur lors de la sauvegarde du rendez-vous."
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Délai d'attente dépassé. Vérifiez votre connexion internet et réessayez."
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Problème de connexion. Vérifiez votre connexion internet et réessayez."
        } else if (error.message.includes('Erreur serveur')) {
          errorMessage = error.message
        }
      }
      
      alert(errorMessage + " Veuillez réessayer.")
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingContact(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Message envoyé avec succès !')
        setContactForm({
          name: "",
          email: "",
          message: "",
        })
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de l\'envoi du message')
    } finally {
      setIsSubmittingContact(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Appeler la fonction de vérification (la redirection est gérée en interne)
    await verifyAccessKey(portfolioPassword)
  }

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [carouselData.length])

  useEffect(() => {
    const loadCastings = async () => {
      try {
        const res = await fetch('/api/castings')
        if (res.ok) {
          const data = await res.json()
          setCastings(data)
        }
      } catch (e) {
        console.error('Erreur chargement castings:', e)
      }
    }
    loadCastings()
  }, [])

  const clientLogos = partnerLogos.filter((l: any) => (l.category || 'partner') === 'client')

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials')
        if (res.ok) {
          const data = await res.json()
          setTestimonials(data)
        }
      } catch (e) {
        console.error('Erreur chargement témoignages:', e)
      }
    }
    loadTestimonials()
  }, [])

  useEffect(() => {
    const loadPartnerLogos = async () => {
      try {
        const res = await fetch('/api/partner-logos')
        if (res.ok) {
          const data = await res.json()
          setPartnerLogos(data)
        }
      } catch (e) {
        console.error('Erreur chargement logos partenaires:', e)
      }
    }
    loadPartnerLogos()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length)
  }

  return (
    <div className="min-h-screen bg-background cursor-none">
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
              <img
                src="/images/castpro.png"
                alt="CAST Logo"
                className="h-10 w-auto"
              />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                Mieux nous connaître
              </a>
              <a href="#services" className="text-foreground hover:text-primary transition-colors">
                Services
              </a>
              <a href="#talents" className="text-foreground hover:text-primary transition-colors">
                Talents
              </a>
              <Link href="/portfolio" className="text-foreground hover:text-primary transition-colors">
                Portfolio
              </Link>
              <a href="#collaborations" className="text-foreground hover:text-primary transition-colors">
                Collaborations
              </a>
              <a href="#castings" className="text-foreground hover:text-primary transition-colors">
                Castings
              </a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
                Témoignages
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contactez
              </a>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAppointmentModalOpen(true)}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Prendre un rdv
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#about"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mieux nous connaître
                </a>
                <a
                  href="#services"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </a>
                <a
                  href="#talents"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Talents
                </a>
                <Link
                  href="/portfolio"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Portfolio
                </Link>
                <a
                  href="#collaborations"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collaborations
                </a>
                <a
                  href="#castings"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Castings
                </a>
                <a
                  href="#testimonials"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Témoignages
                </a>
                <a
                  href="#contact"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contactez
                </a>
                <button
                  className="w-full text-left px-3 py-2 text-primary hover:text-primary/80 transition-colors border border-primary rounded-md"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsAppointmentModalOpen(true)
                  }}
                >
                  Prendre un rdv
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0">
          {carouselData.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="w-full h-full object-contain object-center bg-gray-900"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Carousel Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 text-white">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">Agence de Casting Professionnelle</Badge>

          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">{carouselData[currentSlide].title}</h1>
            <h2 className="text-xl md:text-2xl font-medium mb-6">{carouselData[currentSlide].subtitle}</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">{carouselData[currentSlide].description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Play className="w-5 h-5 mr-2" />
              Découvrir nos Services
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              Devenir Talent
            </Button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-primary" : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Carousel Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      <section id="about" className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-space-grotesk mb-4 text-white">Mieux nous connaître</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Depuis plus de 25 ans, CastPro accompagne les talents et les productions dans leurs projets les plus
              ambitieux
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold font-space-grotesk mb-6 text-white">Notre Histoire</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Fondée en 2012 en Tunisie, CastPro est née de la passion de découvrir et révéler des talents uniques de
                demain. Notre équipe d'experts en casting collabore avec les plus grandes productions locales et
                internationales dans les domaines de la télévision, du cinéma, de la publicité et de l'événementiel.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Nous croyons que chaque projet mérite son casting parfait, et que chaque talent mérite l'opportunité de
                briller sur les écrans . Cette conviction guide notre travail&nbsp;au&nbsp;quotidien.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-primary/20 rounded-lg border border-primary/30">
                  <div className="text-2xl font-bold text-primary mb-1">12+</div>
                  <div className="text-sm text-gray-400">Années d'expérience</div>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-lg border border-secondary/30">
                  <div className="text-2xl font-bold text-secondary mb-1">5000+</div>
                  <div className="text-sm text-gray-400">Talents représentés</div>
                </div>
              </div>
            </div>
            <div className="relative bg-black p-4 rounded-lg">
              <img
                src="/images/studio.jpg"
                alt="Charte de hauteur CastPro"
                className="rounded-lg shadow-xl border border-gray-700 w-full aspect-video object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg border border-primary/30">
                <div className="text-lg font-bold">Notre Mission</div>
                <div className="text-sm opacity-90">Révéler les talents de demain</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 border-t border-gray-800 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: 'url(/images/modelady.png)',
            filter: 'brightness(0.8) contrast(1.0)'
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-gray-900/40" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-space-grotesk mb-4 text-white">Nos Services</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Mannequins, Comédiens, Figurants, Catwalks, Publicité, Télévision, en Tunisie et à l'International.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FlipCard
              frontContent={
                <Card className="w-full h-full bg-black border-2 border-gray-800 hover:border-red-500/50 transition-all duration-300">
                  <CardHeader className="h-full flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-red-500/30">
                      <Film className="w-8 h-8 text-red-500" />
                    </div>
                    <CardTitle className="font-space-grotesk text-white text-xl mb-3">Casting Cinéma</CardTitle>
                    <CardDescription className="text-gray-400 text-sm leading-relaxed">
                      Sélection de talents pour longs métrages, courts métrages et productions indépendantes
                    </CardDescription>
                  </CardHeader>
                </Card>
              }
              backContent={
                <Card className="w-full h-full bg-black border-2 border-red-500/50">
                  <CardHeader className="h-full flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-red-500/30 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-red-500/50">
                      <Film className="w-8 h-8 text-red-500" />
                    </div>
                    <CardTitle className="font-space-grotesk text-red-500 text-xl mb-3">Casting Cinéma</CardTitle>
                    <CardDescription className="text-gray-300 text-xs mb-4 leading-relaxed">
                      Découvrez nos services de casting pour le cinéma : auditions, sélections, et accompagnement personnalisé pour vos projets cinématographiques.
                    </CardDescription>
                  </CardHeader>
                </Card>
              }
            />

            <FlipCard
              frontContent={
                <Card className="w-full h-full bg-black border-2 border-gray-800 hover:border-orange-500/50 transition-all duration-300">
                  <CardHeader className="h-full flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-orange-500/30">
                      <Users className="w-8 h-8 text-orange-500" />
                    </div>
                    <CardTitle className="font-space-grotesk text-white text-xl mb-3">Casting TV</CardTitle>
                    <CardDescription className="text-gray-400 text-sm leading-relaxed">
                      Recrutement pour séries, émissions, publicités et contenus télévisuels
                    </CardDescription>
                  </CardHeader>
                </Card>
              }
              backContent={
                <Card className="w-full h-full bg-black border-2 border-orange-500/50">
                  <CardHeader className="h-full flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-orange-500/30 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-orange-500/50">
                      <Users className="w-8 h-8 text-orange-500" />
                    </div>
                    <CardTitle className="font-space-grotesk text-orange-500 text-xl mb-3">Casting TV</CardTitle>
                    <CardDescription className="text-gray-300 text-xs mb-4 leading-relaxed">
                      Notre expertise en casting télévisuel : séries, émissions, publicités et contenus pour tous types de médias.
                    </CardDescription>
                  </CardHeader>
                </Card>
              }
            />

            <FlipCard
              frontContent={
                <Card className="w-full h-full bg-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
                  <CardHeader className="h-full flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-yellow-500/30">
                      <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                    <CardTitle className="font-space-grotesk text-white text-xl mb-3">Street Casting</CardTitle>
                    <CardDescription className="text-gray-400 text-sm leading-relaxed">
                      Sélection de profils authentiques repérés en milieu urbain pour des projets audiovisuels ou publicitaires
                    </CardDescription>
                  </CardHeader>
                </Card>
              }
              backContent={
                <Card className="w-full h-full bg-black border-2 border-yellow-500/50">
                  <CardHeader className="h-full flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-yellow-500/30 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-yellow-500/50">
                      <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                    <CardTitle className="font-space-grotesk text-yellow-500 text-xl mb-3">Street Casting</CardTitle>
                    <CardDescription className="text-gray-300 text-xs mb-4 leading-relaxed">
                      Découvrez des talents authentiques repérés dans les rues : profils naturels et personnalités uniques pour vos projets.
                    </CardDescription>
                  </CardHeader>
                </Card>
              }
            />
          </div>
        </div>
      </section>

      <section id="talents" className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-space-grotesk mb-4 text-white">Nos Talents</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Une sélection exceptionnelle d'artistes pour tous vos projets
            </p>
          </div>

          {/* Talent Categories Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {carouselData.map((category, index) => (
              <Card
                key={index}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-gray-900 border-gray-700 hover:border-primary/50"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center top",
                      filter: "brightness(1.1) contrast(1.05) saturate(1.1)",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold font-space-grotesk mb-1">{category.title}</h3>
                    <p className="text-sm text-white/90">{category.subtitle}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-4">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Portfolio Showcase Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-12 text-center border border-primary/30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/30 rounded-full mb-6 border border-primary/50">
                <Users className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-3xl font-bold font-space-grotesk mb-4 text-white">
                Découvrez un aperçu de nos talents
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Explorez notre portfolio complet avec plus de 500 talents exceptionnels. Filtrez par catégorie et
                trouvez l'artiste parfait pour votre projet.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1500+</div>
                  <div className="text-sm text-gray-400">Enfants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">2000+</div>
                  <div className="text-sm text-gray-400">Jeunes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">1500+</div>
                  <div className="text-sm text-gray-400">Seniors</div>
                </div>
              </div>

              <Link href="/portfolio">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-primary/50"
                >
                  <Users className="w-6 h-6 mr-3" />
                  Explorer le Portfolio
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="collaborations" className="py-20 bg-gradient-to-br from-background to-muted/30">
        <VideoCollaboration />
      </section>

      <section id="portfolio" className="py-20 bg-gradient-to-br from-gray-900 to-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/30 rounded-full mb-6 border border-primary/50">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold font-space-grotesk mb-4 text-white">Portfolio Secret - Accès Exclusif</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Accédez à notre collection ultra-exclusive de portraits d'acteurs de haut niveau
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-space-grotesk mb-2 text-white">Accès au Portfolio Secret</CardTitle>
                <CardDescription className="text-gray-300">
                  Entrez le code d'accès pour découvrir notre collection ultra-exclusive d'acteurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={portfolioPassword}
                      onChange={(e) => setPortfolioPassword(e.target.value)}
                      placeholder="Entrez le code d'accès"
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {authError && <p className="text-red-400 text-sm">{authError}</p>}

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 border border-primary/50"
                    disabled={authLoading}
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    {authLoading ? "Vérification..." : "Accéder au Portfolio Secret"}
                  </Button>
                </form>



                <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Portfolio secret ultra-exclusif</strong>
                    <br />
                    Collection réservée aux professionnels du cinéma et de la télévision
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="castings" className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-space-grotesk mb-4 text-white">Castings</h2>
            <p className="text-xl text-gray-300">Découvrez les opportunités actuelles</p>
          </div>

          {castings && castings.filter((c) => (c.status || 'open') === 'open').length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {castings
                .filter((c) => (c.status || 'open') === 'open')
                .map((casting) => (
                  <Card key={casting.id} className="bg-gray-900 border-gray-700 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="font-space-grotesk text-white">{casting.title}</CardTitle>
                        <Badge variant="secondary" className="bg-secondary/20 text-secondary border border-secondary/30">
                          Ouvert
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        {casting.location} • {(() => { const d = new Date(casting.date); return isNaN(d.getTime()) ? casting.date : d.toLocaleDateString('fr-FR'); })()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p className="line-clamp-4">{casting.description}</p>
                      </div>
                      <Button
                        className="w-full mt-4 bg-primary hover:bg-primary/90 border border-primary/50"
                        onClick={() => setIsAppointmentModalOpen(true)}
                      >
                        Postuler
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-300">Aucun casting en cours pour le moment.</div>
          )}
        </div>
      </section>

      {/* Dynamic Partners Section (category: partner) */}
      <section className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nos Partenaires</h2>
            <p className="text-lg text-gray-300">En collaboration avec nos partenaires de confiance</p>
          </div>
          {partnerLogos.filter((l: any) => (l.category || 'partner') === 'partner').length > 0 ? (
            <div className="flex items-center justify-center space-x-8 flex-wrap">
              {partnerLogos
                .filter((l: any) => (l.category || 'partner') === 'partner')
                .map((logo: any) => (
                  <div key={logo.id} className="flex items-center justify-center">
                    <img
                      src={(logo.logo_url || '').trim() || '/placeholder-logo.png'}
                      alt={logo.alt_text || logo.name || 'Logo partenaire'}
                      className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.src = '/placeholder-logo.png'
                      }}
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-300">Aucun logo partenaire pour le moment.</div>
          )}
        </div>
      </section>

      <section className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Nos Brands</h2>
            <p className="text-xl text-gray-300">Ils nous font confiance</p>
          </div>
          {clientLogos.length > 0 ? (
            <div className="relative overflow-hidden">
              <div className="flex items-center" style={{ width: clientLogos.length >= 6 ? "calc(200% + 48px)" : "auto" }}>
                {(clientLogos.length >= 6 ? [0, 1] : [0]).map((repeat) => (
                  <div key={repeat} className={`flex items-center space-x-12 min-w-max ${clientLogos.length >= 6 ? 'animate-scroll' : ''}`}>
                    {clientLogos.map((logo: any) => (
                      <a key={`${repeat}-${logo.id}`} href={(logo.website_url || '').trim() || undefined} target="_blank" rel="noreferrer">
                        <img
                          src={(logo.logo_url || '').trim() || '/placeholder-logo.png'}
                          alt={logo.alt_text || logo.name || 'Logo partenaire'}
                          className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement
                            img.src = '/placeholder-logo.png'
                          }}
                        />
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-300">Aucun logo partenaire pour le moment.</div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/20 to-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-space-grotesk mb-4 text-white">Nos Chiffres Clés</h2>
            <p className="text-xl text-gray-300">Notre impact en quelques chiffres</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-lg bg-primary/20 border border-primary/30">
              <div className="text-4xl font-bold text-white">{counters.talents}+</div>
              <div className="text-sm text-gray-300">Talents</div>
            </div>
            <div className="p-6 rounded-lg bg-primary/20 border border-primary/30">
              <div className="text-4xl font-bold text-white">{counters.productions}+</div>
              <div className="text-sm text-gray-300">Productions</div>
            </div>
            <div className="p-6 rounded-lg bg-primary/20 border border-primary/30">
              <div className="text-4xl font-bold text-white">{counters.experience}+</div>
              <div className="text-sm text-gray-300">Années d'expérience</div>
            </div>
            <div className="p-6 rounded-lg bg-primary/20 border border-primary/30">
              <div className="text-4xl font-bold text-white">{counters.satisfaction}%</div>
              <div className="text-sm text-gray-300">Satisfaction Client</div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-space-grotesk mb-4 text-white">Témoignages</h2>
            <p className="text-xl text-gray-300">Ce que disent nos clients</p>
          </div>

          {testimonials && testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-gray-900 border-gray-700 hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                        <Quote className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-space-grotesk text-white">{testimonial.name}</CardTitle>
                        <CardDescription className="text-gray-400">{testimonial.company}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 italic">"{testimonial.content}"</p>
                    <div className="flex items-center mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (testimonial.rating || 5) ? 'text-yellow-500 fill-current' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-300">Aucun témoignage pour le moment.</div>
          )}
        </div>
      </section>

      <section id="contact" className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-space-grotesk mb-4 text-white">Contactez-nous</h2>
            <p className="text-xl text-gray-300">Nous sommes à votre écoute</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-lg bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white">Envoyez-nous un message</CardTitle>
                  <CardDescription className="text-gray-300">
                    Nous vous répondrons dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="Votre email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="Votre message"
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={isSubmittingContact}
                      className="w-full bg-primary hover:bg-primary/90 border border-primary/50 disabled:opacity-50"
                    >
                      {isSubmittingContact ? 'Envoi en cours...' : 'Envoyer'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <Card className="shadow-lg bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white">Nos coordonnées</CardTitle>
                  <CardDescription className="text-gray-300">N'hésitez pas à nous contacter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-gray-300">castpro.hf@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-gray-300">+216 53 456 789</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-gray-300">
                      Avenue de la République,
                      <br />
                      Tunis, Tunisie
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <a 
                      href="https://www.instagram.com/castpro_tunisie" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center space-x-3 text-gray-300 hover:text-primary transition-colors"
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        <img
                          src="/images/Instagram-Logo.png"
                          alt="Instagram CastPro Tunisie"
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement
                            img.src = '/placeholder-logo.png'
                          }}
                        />
                      </div>
                      <span>@castpro_tunisie</span>
                    </a>
                  </div>
                  <LocationMap />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Modal */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsAppointmentModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div
              className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      Demande de Rendez-vous
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Veuillez remplir le formulaire ci-dessous pour demander un rendez-vous.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleAppointmentSubmit}>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-col">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="nom"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        value={appointmentForm.nom}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, nom: e.target.value })}
                        required
                        autoComplete="family-name"
                        inputMode="text"
                      />
                    </div>
                    <div>
                      <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="prenom"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        value={appointmentForm.prenom}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, prenom: e.target.value })}
                        required
                        autoComplete="given-name"
                        inputMode="text"
                      />
                    </div>
                    <div>
                      <label htmlFor="telephone1" className="block text-sm font-medium text-gray-700">
                        Téléphone 1
                      </label>
                      <input
                        type="tel"
                        id="telephone1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        value={appointmentForm.telephone1}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, telephone1: e.target.value })}
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="Ex: +216 22 222 222"
                      />
                    </div>
                    <div>
                      <label htmlFor="telephone2" className="block text-sm font-medium text-gray-700">
                        Téléphone 2 (Optionnel)
                      </label>
                      <input
                        type="tel"
                        id="telephone2"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        value={appointmentForm.telephone2}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, telephone2: e.target.value })}
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="Ex: +216 22 222 222"
                      />
                    </div>
                    <div>
                      <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <select
                        id="selectedDate"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-gray-900 bg-white"
                        value={appointmentForm.selectedDate}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, selectedDate: e.target.value })}
                        required
                      >
                        <option value="">Sélectionner une date</option>
                        {isLoadingSlots ? (
                          <option disabled>Chargement des créneaux...</option>
                        ) : (
                          availableDates.map((date) => (
                            <option key={date} value={date}>
                              {availableSlots.find((slot) => slot.date === date)?.dateDisplay}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="selectedTime" className="block text-sm font-medium text-gray-700">
                        Heure
                      </label>
                      <select
                        id="selectedTime"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-gray-900 bg-white"
                        value={appointmentForm.selectedTime}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, selectedTime: e.target.value })}
                        required
                      >
                        <option value="">Sélectionner une heure</option>
                        {isLoadingSlots ? (
                          <option disabled>Chargement des créneaux...</option>
                        ) : (
                          availableSlots
                            .filter((slot) => slot.date === appointmentForm.selectedDate)
                            .map((slot) => (
                              <option key={slot.date + slot.time} value={slot.time}>
                                {slot.time}
                              </option>
                            ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Confirmer
                  </Button>
                  <Button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsAppointmentModalOpen(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Appointment Booking Button */}
      <button
        onClick={() => setIsAppointmentModalOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center group"
        aria-label="Prendre rendez-vous"
      >
        <svg
          className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center mb-6">
                  <img
                    src="/images/castpro.png"
                    alt="CastPro Logo"
                    className="h-12 w-auto"
                  />
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  CastPro Tunisie - Votre partenaire de confiance pour tous vos projets de casting. 
                  Découvrez des talents exceptionnels pour le cinéma, la télévision et la publicité.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.instagram.com/castpro_tunisie" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-gray-400 hover:text-primary transition-colors"
                    aria-label="Suivez-nous sur Instagram"
                  >
                    <img
                      src="/images/Instagram-Logo.png"
                      alt="Instagram CastPro Tunisie"
                      className="h-8 w-8 object-contain"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.src = '/placeholder-logo.png'
                      }}
                    />
                  </a>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Nos Services</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#services" className="text-gray-300 hover:text-primary transition-colors">
                      Casting Cinéma
                    </a>
                  </li>
                  <li>
                    <a href="#services" className="text-gray-300 hover:text-primary transition-colors">
                      Casting TV
                    </a>
                  </li>
                  <li>
                    <a href="#services" className="text-gray-300 hover:text-primary transition-colors">
                      Street Casting
                    </a>
                  </li>
                  <li>
                    <a href="#castings" className="text-gray-300 hover:text-primary transition-colors">
                      Castings Ouverts
                    </a>
                  </li>
                  <li>
                    <a href="#portfolio" className="text-gray-300 hover:text-primary transition-colors">
                      Portfolio Secret
                    </a>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Liens Rapides</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/portfolio" className="text-gray-300 hover:text-primary transition-colors">
                      Portfolio Public
                    </Link>
                  </li>
                  <li>
                    <a href="#about" className="text-gray-300 hover:text-primary transition-colors">
                      À Propos
                    </a>
                  </li>
                  <li>
                    <a href="#talents" className="text-gray-300 hover:text-primary transition-colors">
                      Nos Talents
                    </a>
                  </li>
                  <li>
                    <a href="#testimonials" className="text-gray-300 hover:text-primary transition-colors">
                      Témoignages
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="text-gray-300 hover:text-primary transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">castpro.hf@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">+216 53 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">
                        Avenue de la République<br />
                        Tunis, Tunisie
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={() => setIsAppointmentModalOpen(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Prendre un Rendez-vous
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} CastPro Tunisie. Tous droits réservés.
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Conditions d'utilisation
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Politique de confidentialité
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Mentions légales
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
