"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { BulkUpload } from "@/components/ui/bulk-upload"
import { safeLocalStorage } from "@/lib/storage"
import {
  Calendar,
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Star,
  Plus,
  Edit,
  Trash2,
  Save,
  Film,
  Key,
  ImageIcon,
  Copy,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react"

interface Appointment {
  id: string
  nom: string
  prenom: string
  telephone1: string
  telephone2: string
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

interface PortfolioItem {
  id: string
  name: string
  age: string
  category: string
  image: string
  description: string
  experience: string
  specialties: string[]
}

interface Casting {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  date: string
  status: "open" | "closed"
  createdAt: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  image: string
}

interface AccessKey {
  id: string
  name: string
  key: string
  permissions: string[]
  createdAt: string
  expiresAt: string
  isActive: boolean
}

interface MediaItem {
  id: string
  name: string
  type: "video" | "logo"
  url: string
  description: string
  createdAt: string
}

interface PartnerLogo {
  id?: number
  name: string
  logo_url: string
  alt_text?: string
  website_url?: string
  category?: 'partner' | 'client'
  created_at?: string
}

export default function AdminLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("appointments")

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState("")

  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [secretPortfolio, setSecretPortfolio] = useState<PortfolioItem[]>([])
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null)
  const [newPortfolioItem, setNewPortfolioItem] = useState<Partial<PortfolioItem>>({})
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false)

  // Castings state
  const [castings, setCastings] = useState<Casting[]>([])
  const [editingCasting, setEditingCasting] = useState<Casting | null>(null)
  const [newCasting, setNewCasting] = useState<Partial<Casting>>({})

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({})

  const [accessKeys, setAccessKeys] = useState<AccessKey[]>([])
  const [newAccessKey, setNewAccessKey] = useState<Partial<AccessKey>>({})
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [newMediaItem, setNewMediaItem] = useState<Partial<MediaItem>>({})
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([])
  const [newPartnerLogo, setNewPartnerLogo] = useState<Partial<PartnerLogo>>({})
  const [showKeyValues, setShowKeyValues] = useState<{ [key: string]: boolean }>({})
  const [activePortfolioTab, setActivePortfolioTab] = useState<"main" | "secret">("main")

  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuthenticated")
    if (adminAuth === "true") {
      setIsLoggedIn(true)
      loadAllData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "ADMIN2024") {
      setIsLoggedIn(true)
      sessionStorage.setItem("adminAuthenticated", "true")
      setError("")
      loadAllData()
    } else {
      setError("Mot de passe incorrect")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem("adminAuthenticated")
    setPassword("")
  }

  const loadAllData = () => {
    loadAppointments()
    loadPortfolios()
    loadCastings()
    loadTestimonials()
    loadAccessKeys()
    loadMediaItems()
    loadPartnerLogos()
  }

  const loadAppointments = () => {
    const stored = safeLocalStorage.getItem("appointments")
    if (stored) {
      setAppointments(JSON.parse(stored))
    }
  }

  const loadPortfolios = async () => {
    try {
      // Charger le portfolio principal depuis l'API
      const mainResponse = await fetch('/api/portfolio')
      if (mainResponse.ok) {
        const mainData = await mainResponse.json()
        setPortfolioItems(mainData)
      }

      // Charger le portfolio secret depuis l'API
      const secretResponse = await fetch('/api/portfolio?secret=true')
      if (secretResponse.ok) {
        const secretData = await secretResponse.json()
        setSecretPortfolio(secretData)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des portfolios:', error)
    }
  }

  const savePortfolioItem = async (item: PortfolioItem, isSecret = false) => {
    try {
      let savedItem
      
      if (item.id) {
        // Mise à jour
        const response = await fetch('/api/portfolio', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, is_secret: isSecret })
        })
        if (response.ok) {
          savedItem = await response.json()
        }
      } else {
        // Création
        const response = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, is_secret: isSecret })
        })
        if (response.ok) {
          savedItem = await response.json()
        }
      }

      if (savedItem) {
        // Recharger les portfolios depuis l'API
        await loadPortfolios()
        setEditingPortfolio(null)
        setNewPortfolioItem({})
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du portfolio:', error)
    }
  }

  const deletePortfolioItem = async (id: string, isSecret = false) => {
    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Recharger les portfolios depuis l'API
        await loadPortfolios()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du portfolio:', error)
    }
  }

  const handleBulkUpload = async (uploadedItems: Array<{ name: string; category: string; image: string; is_secret?: boolean }>) => {
    try {
      // Sauvegarder chaque item via l'API
      for (const item of uploadedItems) {
        const portfolioItem = {
          ...item,
          age: '',
          description: '',
          experience: '',
          specialties: [],
          is_secret: item.is_secret || false // Utiliser le paramètre retourné par l'API
        }

        await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(portfolioItem)
        })
      }

      // Recharger les portfolios depuis l'API
      await loadPortfolios()
    } catch (error) {
      console.error('Erreur lors de l\'upload en masse:', error)
    }
  }

  const loadCastings = async () => {
    try {
      const response = await fetch('/api/castings')
      if (response.ok) {
        const data = await response.json()
        setCastings(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des castings:', error)
    }
  }

  const saveCasting = async (casting: Casting) => {
    try {
      let savedCasting
      
      if (casting.id && !casting.id.startsWith('temp_')) {
        // Mise à jour
        const response = await fetch('/api/castings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(casting)
        })
        if (response.ok) {
          savedCasting = await response.json()
        }
      } else {
        // Création
        const newCasting = {
          ...casting,
          id: undefined, // La base de données générera l'ID
          createdAt: new Date().toISOString()
        }
        
        const response = await fetch('/api/castings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCasting)
        })
        if (response.ok) {
          savedCasting = await response.json()
        }
      }

      if (savedCasting) {
        // Recharger les castings depuis l'API
        await loadCastings()
        setEditingCasting(null)
        setNewCasting({})
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du casting:', error)
    }
  }

  const deleteCasting = async (id: string) => {
    try {
      const response = await fetch(`/api/castings?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Recharger les castings depuis l'API
        await loadCastings()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du casting:', error)
    }
  }

  const loadTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error)
    }
  }

  const saveTestimonial = async (testimonial: Testimonial) => {
    try {
      let savedTestimonial
      
      if (testimonial.id && !testimonial.id.startsWith('temp_')) {
        // Mise à jour
        const response = await fetch('/api/testimonials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testimonial)
        })
        if (response.ok) {
          savedTestimonial = await response.json()
        }
      } else {
        // Création
        const newTestimonial = {
          ...testimonial,
          id: undefined, // La base de données générera l'ID
          createdAt: new Date().toISOString()
        }
        
        const response = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTestimonial)
        })
        if (response.ok) {
          savedTestimonial = await response.json()
        }
      }

      if (savedTestimonial) {
        // Recharger les témoignages depuis l'API
        await loadTestimonials()
        setEditingTestimonial(null)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du témoignage:', error)
    }
  }

  const deleteTestimonial = async (id: string) => {
    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Recharger les témoignages depuis l'API
        await loadTestimonials()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du témoignage:', error)
    }
  }

  const updateAppointmentStatus = (id: string, status: "confirmed" | "cancelled") => {
    const updated = appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    setAppointments(updated)
    safeLocalStorage.setItem("appointments", JSON.stringify(updated))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé"
      case "cancelled":
        return "Annulé"
      default:
        return "En attente"
    }
  }

  const filteredAppointments = selectedDate ? appointments.filter((apt) => apt.date === selectedDate) : appointments

  const loadAccessKeys = async () => {
    try {
      const response = await fetch('/api/access-keys')
      if (response.ok) {
        const data = await response.json()
        setAccessKeys(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clés:', error)
    }
  }

  const generateAccessKey = () => {
    return "ck_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const saveAccessKey = async (accessKey: AccessKey) => {
    try {
      let savedKey
      
      if (accessKey.id) {
        // Mise à jour
        const response = await fetch('/api/access-keys', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(accessKey)
        })
        if (response.ok) {
          savedKey = await response.json()
        }
      } else {
        // Création
        const newKey = {
          ...accessKey,
          key: generateAccessKey(),
          createdAt: new Date().toISOString(),
        }
        
        const response = await fetch('/api/access-keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newKey)
        })
        if (response.ok) {
          savedKey = await response.json()
        }
      }

      if (savedKey) {
        // Recharger les clés depuis l'API
        await loadAccessKeys()
        setNewAccessKey({})
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la clé:', error)
    }
  }

  const toggleAccessKey = async (id: string) => {
    try {
      const accessKey = accessKeys.find(k => k.id === id)
      if (accessKey) {
        const response = await fetch('/api/access-keys', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...accessKey, isActive: !accessKey.isActive })
        })
        
        if (response.ok) {
          await loadAccessKeys()
        }
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la clé:', error)
    }
  }

  const deleteAccessKey = async (id: string) => {
    try {
      const response = await fetch(`/api/access-keys?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await loadAccessKeys()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la clé:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const loadMediaItems = () => {
    const stored = safeLocalStorage.getItem("mediaItems")
    if (stored) {
      setMediaItems(JSON.parse(stored))
    }
  }

  const loadPartnerLogos = async () => {
    try {
      const res = await fetch('/api/partner-logos')
      if (res.ok) {
        setPartnerLogos(await res.json())
      }
    } catch (e) {
      console.error('Erreur lors du chargement des logos partenaires:', e)
    }
  }

  const savePartnerLogo = async (logo: PartnerLogo) => {
    try {
      const res = await fetch('/api/partner-logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logo)
      })
      if (res.ok) {
        await loadPartnerLogos()
        setNewPartnerLogo({})
      }
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du logo partenaire:', e)
    }
  }

  const deletePartnerLogo = async (id: number) => {
    try {
      const res = await fetch(`/api/partner-logos?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await loadPartnerLogos()
      }
    } catch (e) {
      console.error('Erreur lors de la suppression du logo partenaire:', e)
    }
  }

  const saveMediaItem = (mediaItem: MediaItem) => {
    const updated = mediaItem.id
      ? mediaItems.map((m) => (m.id === mediaItem.id ? mediaItem : m))
      : [
          ...mediaItems,
          {
            ...mediaItem,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          },
        ]

    setMediaItems(updated)
    safeLocalStorage.setItem("mediaItems", JSON.stringify(updated))
    setNewMediaItem({})
  }

  const deleteMediaItem = (id: string) => {
    const updated = mediaItems.filter((m) => m.id !== id)
    setMediaItems(updated)
    safeLocalStorage.setItem("mediaItems", JSON.stringify(updated))
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin CastPro</CardTitle>
            <CardDescription>Connexion à l'interface d'administration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe administrateur"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin CastPro</h1>
              <p className="text-gray-600">Gestion complète de la plateforme</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "appointments" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Calendar className="h-5 w-5 inline mr-2" />
              Rendez-vous
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "portfolio" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Users className="h-5 w-5 inline mr-2" />
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab("castings")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "castings" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Film className="h-5 w-5 inline mr-2" />
              Castings
            </button>
            <button
              onClick={() => setActiveTab("testimonials")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "testimonials" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Star className="h-5 w-5 inline mr-2" />
              Témoignages
            </button>
            <button
              onClick={() => setActiveTab("access-keys")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "access-keys" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Key className="h-5 w-5 inline mr-2" />
              Clés d'accès
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "media" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <ImageIcon className="h-5 w-5 inline mr-2" />
              Médias
            </button>
            <button
              onClick={() => setActiveTab("partner-logos")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "partner-logos" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <ImageIcon className="h-5 w-5 inline mr-2" />
              Logos partenaires
            </button>
          </div>
        </div>

        {activeTab === "appointments" && (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total RDV</p>
                      <p className="text-2xl font-bold">{appointments.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">En attente</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {appointments.filter((apt) => apt.status === "pending").length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Confirmés</p>
                      <p className="text-2xl font-bold text-green-600">
                        {appointments.filter((apt) => apt.status === "confirmed").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Annulés</p>
                      <p className="text-2xl font-bold text-red-600">
                        {appointments.filter((apt) => apt.status === "cancelled").length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par date</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-48"
                    />
                  </div>
                  <Button onClick={() => setSelectedDate("")} variant="outline" className="mt-6">
                    Toutes les dates
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <Card>
              <CardHeader>
                <CardTitle>Rendez-vous ({filteredAppointments.length})</CardTitle>
                <CardDescription>Gérez et confirmez les rendez-vous après contact téléphonique</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun rendez-vous trouvé</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <User className="h-5 w-5 text-gray-500" />
                              <h3 className="font-semibold text-lg">
                                {appointment.prenom} {appointment.nom}
                              </h3>
                              <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                                {getStatusText(appointment.status)}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(appointment.date).toLocaleDateString("fr-FR")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{appointment.telephone1}</span>
                              </div>
                              {appointment.telephone2 && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{appointment.telephone2}</span>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                              Créé le {new Date(appointment.createdAt).toLocaleString("fr-FR")}
                            </p>
                          </div>

                          <div className="flex gap-2 ml-4">
                            {appointment.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirmer
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Annuler
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Portfolios</h2>
              <div className="flex gap-2">
                <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter en masse
                </Button>
                <Button onClick={() => setNewPortfolioItem({ category: "main" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un talent
                </Button>
              </div>
            </div>

            {/* Portfolio Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex border-b">
                <button 
                  onClick={() => setActivePortfolioTab("main")}
                  className={`px-4 py-2 font-medium ${activePortfolioTab === "main" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                >
                  Portfolio Principal ({portfolioItems.length})
                </button>
                <button 
                  onClick={() => setActivePortfolioTab("secret")}
                  className={`px-4 py-2 font-medium ${activePortfolioTab === "secret" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                >
                  Portfolio Secret ({secretPortfolio.length})
                </button>
              </div>

              <div className="p-6">
                {/* Add/Edit Form */}
                {(newPortfolioItem.category || editingPortfolio) && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>{editingPortfolio ? "Modifier le talent" : "Ajouter un nouveau talent"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Nom complet"
                          value={editingPortfolio?.name || newPortfolioItem.name || ""}
                          onChange={(e) =>
                            editingPortfolio
                              ? setEditingPortfolio({ ...editingPortfolio, name: e.target.value })
                              : setNewPortfolioItem({ ...newPortfolioItem, name: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Âge (ex: 25 ans)"
                          value={editingPortfolio?.age || newPortfolioItem.age || ""}
                          onChange={(e) =>
                            editingPortfolio
                              ? setEditingPortfolio({ ...editingPortfolio, age: e.target.value })
                              : setNewPortfolioItem({ ...newPortfolioItem, age: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Catégorie (enfants, jeunes, seniors)"
                          value={editingPortfolio?.category || newPortfolioItem.category || ""}
                          onChange={(e) =>
                            editingPortfolio
                              ? setEditingPortfolio({ ...editingPortfolio, category: e.target.value })
                              : setNewPortfolioItem({ ...newPortfolioItem, category: e.target.value })
                          }
                        />
                        <div className="md:col-span-2">
                          <ImageUpload
                            onImageUpload={(imageUrl) => {
                              if (editingPortfolio) {
                                setEditingPortfolio({ ...editingPortfolio, image: imageUrl })
                              } else {
                                setNewPortfolioItem({ ...newPortfolioItem, image: imageUrl })
                              }
                            }}
                            currentImage={editingPortfolio?.image || newPortfolioItem.image}
                          />
                        </div>
                        <Input
                          placeholder="Années d'expérience"
                          value={editingPortfolio?.experience || newPortfolioItem.experience || ""}
                          onChange={(e) =>
                            editingPortfolio
                              ? setEditingPortfolio({ ...editingPortfolio, experience: e.target.value })
                              : setNewPortfolioItem({ ...newPortfolioItem, experience: e.target.value })
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Description du talent"
                        className="mt-4"
                        value={editingPortfolio?.description || newPortfolioItem.description || ""}
                        onChange={(e) =>
                          editingPortfolio
                            ? setEditingPortfolio({ ...editingPortfolio, description: e.target.value })
                            : setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })
                        }
                      />
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => {
                            if (editingPortfolio) {
                              savePortfolioItem(editingPortfolio, activePortfolioTab === "secret")
                            } else {
                              const item = { ...newPortfolioItem, id: `temp_${Date.now()}` } as PortfolioItem
                              savePortfolioItem(item, activePortfolioTab === "secret")
                            }
                          }}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder {activePortfolioTab === "secret" ? "en Secret" : ""}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingPortfolio(null)
                            setNewPortfolioItem({})
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Portfolio Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {(activePortfolioTab === "main" ? portfolioItems : secretPortfolio).map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                          {item.image && item.image.trim() !== '' ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="text-gray-500 text-lg font-medium text-center p-4">
                                      <div class="text-2xl mb-2">🖼️</div>
                                      <div>${item.name}</div>
                                      <div class="text-sm text-gray-400 mt-1">Image non disponible</div>
                                    </div>
                                  `
                                }
                              }}
                              onLoad={() => {
                                console.log(`Image chargée pour ${item.name}:`, item.image)
                              }}
                            />
                          ) : (
                            <div className="text-gray-500 text-lg font-medium text-center p-4">
                              <div className="text-2xl mb-2">📷</div>
                              <div>{item.name}</div>
                              <div className="text-sm text-gray-400 mt-1">Aucune image</div>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.age}</p>
                        <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                        <p className="text-sm text-gray-600 mb-2">{item.experience}</p>
                        {activePortfolioTab === "secret" && (
                          <Badge variant="secondary" className="mb-2">Portfolio Secret</Badge>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={() => setEditingPortfolio(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deletePortfolioItem(item.id, activePortfolioTab === "secret")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Bulk Upload Modal */}
            <BulkUpload
              isOpen={isBulkUploadOpen}
              onClose={() => setIsBulkUploadOpen(false)}
              onBulkUpload={handleBulkUpload}
              activeTab={activePortfolioTab}
            />
          </div>
        )}

        {activeTab === "castings" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Castings</h2>
              <Button onClick={() => setNewCasting({ status: "open" })}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un casting
              </Button>
            </div>

            {/* Add/Edit Casting Form */}
            {(Object.keys(newCasting).length > 0 || editingCasting) && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingCasting ? "Modifier le casting" : "Créer un nouveau casting"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Titre du casting"
                      value={editingCasting?.title || newCasting.title || ""}
                      onChange={(e) =>
                        editingCasting
                          ? setEditingCasting({ ...editingCasting, title: e.target.value })
                          : setNewCasting({ ...newCasting, title: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Lieu"
                      value={editingCasting?.location || newCasting.location || ""}
                      onChange={(e) =>
                        editingCasting
                          ? setEditingCasting({ ...editingCasting, location: e.target.value })
                          : setNewCasting({ ...newCasting, location: e.target.value })
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Date du casting"
                      value={editingCasting?.date || newCasting.date || ""}
                      onChange={(e) =>
                        editingCasting
                          ? setEditingCasting({ ...editingCasting, date: e.target.value })
                          : setNewCasting({ ...newCasting, date: e.target.value })
                      }
                    />
                    
                  </div>
                  <Textarea
                    placeholder="Description du casting"
                    className="mt-4"
                    value={editingCasting?.description || newCasting.description || ""}
                    onChange={(e) =>
                      editingCasting
                        ? setEditingCasting({ ...editingCasting, description: e.target.value })
                        : setNewCasting({ ...newCasting, description: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Exigences et critères"
                    className="mt-4"
                    value={editingCasting?.requirements || newCasting.requirements || ""}
                    onChange={(e) =>
                      editingCasting
                        ? setEditingCasting({ ...editingCasting, requirements: e.target.value })
                        : setNewCasting({ ...newCasting, requirements: e.target.value })
                    }
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => {
                        const casting = editingCasting || ({ ...newCasting, status: "open" } as Casting)
                        saveCasting(casting)
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingCasting(null)
                        setNewCasting({})
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Castings List */}
            <div className="grid gap-6">
              {castings.map((casting) => (
                <Card key={casting.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{casting.title}</CardTitle>
                        <CardDescription>
                          {casting.location} • {(() => { const d = new Date(casting.date); return isNaN(d.getTime()) ? casting.date : d.toLocaleDateString("fr-FR"); })()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={casting.status === "open" ? "bg-green-500" : "bg-red-500"}>
                          {casting.status === "open" ? "Ouvert" : "Fermé"}
                        </Badge>
                        <Button size="sm" onClick={() => setEditingCasting(casting)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCasting(casting.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{casting.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Créé le:</strong> {(() => { const d = new Date(casting.createdAt); return isNaN(d.getTime()) ? casting.createdAt : d.toLocaleDateString("fr-FR"); })()}
                      </div>
                    </div>
                    {casting.requirements && (
                      <div className="mt-4">
                        <strong>Exigences:</strong>
                        <p className="text-gray-600 mt-1">{casting.requirements}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Témoignages</h2>
              <Button onClick={() => setNewTestimonial({ rating: 5 })}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un témoignage
              </Button>
            </div>

            {/* Add/Edit Testimonial Form */}
            {(Object.keys(newTestimonial).length > 0 || editingTestimonial) && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingTestimonial ? "Modifier le témoignage" : "Créer un nouveau témoignage"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Nom"
                      value={editingTestimonial?.name || newTestimonial.name || ""}
                      onChange={(e) =>
                        editingTestimonial
                          ? setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                          : setNewTestimonial({ ...newTestimonial, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Rôle/Fonction"
                      value={editingTestimonial?.role || newTestimonial.role || ""}
                      onChange={(e) =>
                        editingTestimonial
                          ? setEditingTestimonial({ ...editingTestimonial, role: e.target.value })
                          : setNewTestimonial({ ...newTestimonial, role: e.target.value })
                      }
                    />
                    <Input
                      placeholder="URL de l'image"
                      value={editingTestimonial?.image || newTestimonial.image || ""}
                      onChange={(e) =>
                        editingTestimonial
                          ? setEditingTestimonial({ ...editingTestimonial, image: e.target.value })
                          : setNewTestimonial({ ...newTestimonial, image: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Note (1-5)"
                      value={editingTestimonial?.rating || newTestimonial.rating || 5}
                      onChange={(e) =>
                        editingTestimonial
                          ? setEditingTestimonial({ ...editingTestimonial, rating: Number.parseInt(e.target.value) })
                          : setNewTestimonial({ ...newTestimonial, rating: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Contenu du témoignage"
                    className="mt-4"
                    value={editingTestimonial?.content || newTestimonial.content || ""}
                    onChange={(e) =>
                      editingTestimonial
                        ? setEditingTestimonial({ ...editingTestimonial, content: e.target.value })
                        : setNewTestimonial({ ...newTestimonial, content: e.target.value })
                    }
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => {
                        if (editingTestimonial) {
                          saveTestimonial(editingTestimonial)
                        } else {
                          const testimonial = { ...newTestimonial, id: `temp_${Date.now()}` } as Testimonial
                          saveTestimonial(testimonial)
                        }
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingTestimonial(null)
                        setNewTestimonial({})
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    {editingTestimonial?.id === testimonial.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Nom"
                            value={editingTestimonial.name}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                          />
                          <Input
                            placeholder="Rôle/Fonction"
                            value={editingTestimonial.role}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                          />
                          <Input
                            placeholder="URL de l'image"
                            value={editingTestimonial.image}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, image: e.target.value })}
                          />
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            placeholder="Note (1-5)"
                            value={editingTestimonial.rating}
                            onChange={(e) =>
                              setEditingTestimonial({ ...editingTestimonial, rating: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <Textarea
                          placeholder="Contenu du témoignage"
                          value={editingTestimonial.content}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => saveTestimonial(editingTestimonial)}>
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </Button>
                          <Button variant="outline" onClick={() => setEditingTestimonial(null)}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{testimonial.name}</h3>
                              <p className="text-gray-600 text-sm">{testimonial.role}</p>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <Button size="sm" onClick={() => setEditingTestimonial(testimonial)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteTestimonial(testimonial.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700">{testimonial.content}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "access-keys" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Clés d'Accès</h2>
              <Button onClick={() => setNewAccessKey({ permissions: [], isActive: true })}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une clé
              </Button>
            </div>

            {/* Create Access Key Form */}
            {Object.keys(newAccessKey).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Créer une nouvelle clé d'accès</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Nom de la clé"
                      value={newAccessKey.name || ""}
                      onChange={(e) => setNewAccessKey({ ...newAccessKey, name: e.target.value })}
                    />
                    <Input
                      type="date"
                      placeholder="Date d'expiration"
                      value={newAccessKey.expiresAt || ""}
                      onChange={(e) => setNewAccessKey({ ...newAccessKey, expiresAt: e.target.value })}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "read_portfolio",
                        "write_portfolio",
                        "read_castings",
                        "write_castings",
                        "read_appointments",
                        "write_appointments",
                      ].map((permission) => (
                        <label key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newAccessKey.permissions?.includes(permission) || false}
                            onChange={(e) => {
                              const permissions = newAccessKey.permissions || []
                              if (e.target.checked) {
                                setNewAccessKey({ ...newAccessKey, permissions: [...permissions, permission] })
                              } else {
                                setNewAccessKey({
                                  ...newAccessKey,
                                  permissions: permissions.filter((p) => p !== permission),
                                })
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{permission.replace("_", " ")}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => saveAccessKey(newAccessKey as AccessKey)}>
                      <Save className="h-4 w-4 mr-2" />
                      Créer la clé
                    </Button>
                    <Button variant="outline" onClick={() => setNewAccessKey({})}>
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Access Keys List */}
            <div className="grid gap-4">
              {accessKeys.map((accessKey) => (
                <Card key={accessKey.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{accessKey.name}</h3>
                          <Badge className={accessKey.isActive ? "bg-green-500" : "bg-red-500"}>
                            {accessKey.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {showKeyValues[accessKey.id] ? accessKey.key : "••••••••••••••••"}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setShowKeyValues({ ...showKeyValues, [accessKey.id]: !showKeyValues[accessKey.id] })
                            }
                          >
                            {showKeyValues[accessKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(accessKey.key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Permissions: {accessKey.permissions.join(", ")}</p>
                          <p>Créée le: {new Date(accessKey.createdAt).toLocaleDateString("fr-FR")}</p>
                          {accessKey.expiresAt && (
                            <p>Expire le: {new Date(accessKey.expiresAt).toLocaleDateString("fr-FR")}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => toggleAccessKey(accessKey.id)}>
                          {accessKey.isActive ? "Désactiver" : "Activer"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteAccessKey(accessKey.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Médias</h2>
              <Button onClick={() => setNewMediaItem({ type: "video" })}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un média
              </Button>
            </div>

            {/* Add Media Form */}
            {Object.keys(newMediaItem).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un nouveau média</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Nom du média"
                      value={newMediaItem.name || ""}
                      onChange={(e) => setNewMediaItem({ ...newMediaItem, name: e.target.value })}
                    />
                    <select
                      value={newMediaItem.type || "video"}
                      onChange={(e) => setNewMediaItem({ ...newMediaItem, type: e.target.value as "video" | "logo" })}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="video">Vidéo de collaboration</option>
                      <option value="logo">Logo partenaire</option>
                    </select>
                    <Input
                      placeholder="URL du média"
                      value={newMediaItem.url || ""}
                      onChange={(e) => setNewMediaItem({ ...newMediaItem, url: e.target.value })}
                      className="md:col-span-2"
                    />
                  </div>
                  <Textarea
                    placeholder="Description"
                    className="mt-4"
                    value={newMediaItem.description || ""}
                    onChange={(e) => setNewMediaItem({ ...newMediaItem, description: e.target.value })}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => saveMediaItem(newMediaItem as MediaItem)}>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={() => setNewMediaItem({})}>
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Media Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((media) => (
                <Card key={media.id}>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      {media.type === "video" ? (
                        <video src={media.url} className="w-full h-full object-cover rounded-lg" controls />
                      ) : (
                        <img
                          src={media.url || "/placeholder.svg"}
                          alt={media.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{media.name}</h3>
                      <Badge variant="outline">{media.type === "video" ? "Vidéo" : "Logo"}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{media.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(media.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                      <Button size="sm" variant="destructive" onClick={() => deleteMediaItem(media.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "partner-logos" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Logos</h2>
              <Button onClick={() => setNewPartnerLogo({})}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un logo
              </Button>
            </div>

            {newPartnerLogo && (
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un logo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Nom de l'entreprise"
                      value={newPartnerLogo.name || ''}
                      onChange={(e) => setNewPartnerLogo({ ...newPartnerLogo, name: e.target.value })}
                    />
                    <div className="md:col-span-2">
                      <ImageUpload
                        onImageUpload={(imageUrl) => setNewPartnerLogo({ ...newPartnerLogo, logo_url: imageUrl })}
                        currentImage={newPartnerLogo.logo_url}
                      />
                    </div>
                    <Input
                      placeholder="Texte alternatif (alt)"
                      value={newPartnerLogo.alt_text || ''}
                      onChange={(e) => setNewPartnerLogo({ ...newPartnerLogo, alt_text: e.target.value })}
                    />
                    <Input
                      placeholder="URL du site web (optionnel)"
                      value={newPartnerLogo.website_url || ''}
                      onChange={(e) => setNewPartnerLogo({ ...newPartnerLogo, website_url: e.target.value })}
                    />
                    <select
                      value={newPartnerLogo.category || 'partner'}
                      onChange={(e) => setNewPartnerLogo({ ...newPartnerLogo, category: e.target.value as 'partner' | 'client' })}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="partner">Logo partenaire</option>
                      <option value="client">Logo client</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => savePartnerLogo(newPartnerLogo as PartnerLogo)}>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={() => setNewPartnerLogo({})}>Annuler</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {partnerLogos.map((logo) => (
                <Card key={logo.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={logo.logo_url} alt={logo.alt_text || logo.name} className="h-10 w-auto" />
                      <div>
                        <div className="font-semibold">{logo.name}</div>
                        <div className="text-xs text-gray-500">{logo.category === 'client' ? 'Client' : 'Partenaire'}</div>
                        {logo.website_url && <div className="text-sm text-gray-600">{logo.website_url}</div>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" onClick={() => deletePartnerLogo(logo.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ... existing code for other tabs ... */}
      </div>
    </div>
  )
}
