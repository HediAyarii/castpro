import { useState, useEffect } from 'react'

interface PortfolioItem {
  id: string
  name: string
  age: number
  specialty: string
  category: string
  image: string
  experience: string
  location: string
  awards: string[]
  description: string
}

interface PortfolioState {
  items: PortfolioItem[]
  isLoading: boolean
  error: string | null
  categories: { id: string; name: string; count: number }[]
}

export function usePortfolioSecret() {
  const [state, setState] = useState<PortfolioState>({
    items: [],
    isLoading: true,
    error: null,
    categories: []
  })

  // Récupérer les données du portfolio secret
  const fetchPortfolioSecret = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/portfolio-secret')
      const data = await response.json()

      if (data.success) {
        const items = data.items
        
        // Générer les catégories dynamiquement
        const categoryCounts = items.reduce((acc: { [key: string]: number }, item: PortfolioItem) => {
          acc[item.category] = (acc[item.category] || 0) + 1
          return acc
        }, {})

        const categories = [
          { id: "all", name: "Tous", count: items.length },
          ...Object.entries(categoryCounts).map(([category, count]) => ({
            id: category,
            name: category.charAt(0).toUpperCase() + category.slice(1),
            count
          }))
        ]

        setState({
          items,
          categories,
          isLoading: false,
          error: null
        })
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: data.error || 'Erreur lors de la récupération des données'
        }))
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du portfolio secret:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erreur de connexion au serveur'
      }))
    }
  }

  // Filtrer les éléments par catégorie
  const getFilteredItems = (selectedCategory: string): PortfolioItem[] => {
    if (selectedCategory === "all") {
      return state.items
    }
    return state.items.filter(item => item.category === selectedCategory)
  }

  // Récupérer les données au chargement
  useEffect(() => {
    fetchPortfolioSecret()
  }, [])

  // Rafraîchir les données
  const refreshData = () => {
    fetchPortfolioSecret()
  }

  return {
    ...state,
    getFilteredItems,
    refreshData
  }
}
