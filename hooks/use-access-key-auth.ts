import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AccessKey {
  id: string
  name: string
  permissions: string[]
  expiresAt: string | null
  timeRemaining: number | null
  isActive: boolean
}

interface AuthState {
  isAuthenticated: boolean
  accessKey: AccessKey | null
  isLoading: boolean
  error: string | null
}

export function useAccessKeyAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessKey: null,
    isLoading: true,
    error: null
  })
  
  const router = useRouter()

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const authData = sessionStorage.getItem('access-key-auth')
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          const now = new Date()
          
          // Vérifier si la clé n'a pas expiré
          if (parsed.expiresAt) {
            const expiresAt = new Date(parsed.expiresAt)
            if (now > expiresAt) {
              // Clé expirée, supprimer l'authentification
              sessionStorage.removeItem('access-key-auth')
              setAuthState({
                isAuthenticated: false,
                accessKey: null,
                isLoading: false,
                error: 'Votre clé d\'accès a expiré'
              })
              return
            }
          }
          
          setAuthState({
            isAuthenticated: true,
            accessKey: parsed,
            isLoading: false,
            error: null
          })
        } catch (error) {
          sessionStorage.removeItem('access-key-auth')
          setAuthState({
            isAuthenticated: false,
            accessKey: null,
            isLoading: false,
            error: 'Erreur de session'
          })
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          accessKey: null,
          isLoading: false,
          error: null
        })
      }
    }

    checkAuth()
  }, [])

  // Vérifier une clé d'accès
  const verifyAccessKey = async (key: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
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
        // Sauvegarder l'authentification
        const authData = {
          ...data.accessKey,
          verifiedAt: new Date().toISOString()
        }
        sessionStorage.setItem('access-key-auth', JSON.stringify(authData))
        
        setAuthState({
          isAuthenticated: true,
          accessKey: data.accessKey,
          isLoading: false,
          error: null
        })
        
        return true
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.error || 'Clé d\'accès invalide'
        }))
        return false
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erreur de connexion au serveur'
      }))
      return false
    }
  }

  // Déconnexion
  const logout = () => {
    sessionStorage.removeItem('access-key-auth')
    setAuthState({
      isAuthenticated: false,
      accessKey: null,
      isLoading: false,
      error: null
    })
    router.push('/')
  }

  // Vérifier les permissions
  const hasPermission = (permission: string): boolean => {
    if (!authState.accessKey) return false
    return authState.accessKey.permissions.includes(permission)
  }

  // Obtenir le temps restant
  const getTimeRemaining = (): string | null => {
    if (!authState.accessKey?.timeRemaining) return null
    
    const days = authState.accessKey.timeRemaining
    if (days === 0) return 'Expire aujourd\'hui'
    if (days === 1) return 'Expire demain'
    if (days < 7) return `Expire dans ${days} jours`
    if (days < 30) return `Expire dans ${Math.ceil(days / 7)} semaines`
    return `Expire dans ${Math.ceil(days / 30)} mois`
  }

  return {
    ...authState,
    verifyAccessKey,
    logout,
    hasPermission,
    getTimeRemaining
  }
}
