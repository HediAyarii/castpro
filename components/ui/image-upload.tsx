"use client"

import { useState, useRef } from 'react'
import { Button } from './button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  currentImage?: string
  className?: string
}

export function ImageUpload({ onImageUpload, currentImage, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image')
      return
    }

    // Vérifier la taille (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier est trop volumineux (max 10MB)')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Créer un aperçu local
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload vers le serveur
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload')
      }

      const result = await response.json()
      
      if (result.success) {
        onImageUpload(result.url)
        setError(null)
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload')
      }

    } catch (error) {
      console.error('Erreur upload:', error)
      setError('Erreur lors de l\'upload de l\'image')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Upload en cours...' : 'Joindre une photo'}
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemoveImage}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
            Supprimer
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {previewUrl && (
        <div className="relative">
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Aperçu
          </div>
        </div>
      )}

      {!previewUrl && (
        <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
            <p>Aucune image sélectionnée</p>
            <p className="text-sm">Cliquez sur "Joindre une photo" pour sélectionner une image</p>
          </div>
        </div>
      )}
    </div>
  )
}
