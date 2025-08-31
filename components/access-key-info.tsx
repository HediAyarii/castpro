"use client"

import { Clock, Key, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AccessKeyInfoProps {
  accessKey: {
    name: string
    expiresAt: string | null
    timeRemaining: number | null
    permissions: string[]
  } | null
}

export function AccessKeyInfo({ accessKey }: AccessKeyInfoProps) {
  if (!accessKey) return null

  const getTimeRemaining = (): string => {
    if (!accessKey.timeRemaining) return "Accès permanent"
    
    const days = accessKey.timeRemaining
    if (days === 0) return "Expire aujourd'hui"
    if (days === 1) return "Expire demain"
    if (days < 7) return `Expire dans ${days} jours`
    if (days < 30) return `Expire dans ${Math.ceil(days / 7)} semaines`
    return `Expire dans ${Math.ceil(days / 30)} mois`
  }

  const getTimeRemainingColor = (): string => {
    if (!accessKey.timeRemaining) return "text-green-400"
    
    const days = accessKey.timeRemaining
    if (days <= 1) return "text-red-400"
    if (days <= 3) return "text-orange-400"
    if (days <= 7) return "text-yellow-400"
    return "text-green-400"
  }

  const getTimeRemainingIcon = () => {
    if (!accessKey.timeRemaining) return null
    
    const days = accessKey.timeRemaining
    if (days <= 1) return <AlertTriangle className="w-4 h-4 text-red-400" />
    if (days <= 3) return <Clock className="w-4 h-4 text-orange-400" />
    return <Clock className="w-4 h-4 text-yellow-400" />
  }

  return (
    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Informations d'Accès</span>
        </div>
        {accessKey.expiresAt && (
          <Badge variant="outline" className="border-gray-600 text-xs">
            {getTimeRemainingIcon()}
            <span className={`ml-1 ${getTimeRemainingColor()}`}>
              {getTimeRemaining()}
            </span>
          </Badge>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <p className="text-gray-300">
          <strong className="text-white">Clé :</strong> {accessKey.name}
        </p>
        
        {accessKey.permissions.length > 0 && (
          <p className="text-gray-300">
            <strong className="text-white">Permissions :</strong>
            <span className="ml-2 text-blue-400">
              {accessKey.permissions.join(", ")}
            </span>
          </p>
        )}
        
        {accessKey.expiresAt && (
          <p className="text-gray-300">
            <strong className="text-white">Expire le :</strong>
            <span className={`ml-2 ${getTimeRemainingColor()}`}>
              {new Date(accessKey.expiresAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
