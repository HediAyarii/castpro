"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileImage, CheckCircle, AlertCircle } from "lucide-react"

interface BulkUploadProps {
  isOpen: boolean
  onClose: () => void
  onBulkUpload: (items: Array<{ name: string; category: string; image: string; is_secret?: boolean }>) => void
  activeTab?: "main" | "secret" // Onglet actif pour déterminer le portfolio
}

export function BulkUpload({ onBulkUpload, isOpen, onClose, activeTab = "main" }: BulkUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{
    current: number
    total: number
    errors: string[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const handleUpload = async () => {
    if (!selectedCategory || selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress({
      current: 0,
      total: selectedFiles.length,
      errors: []
    })

    try {
      console.log('Début de l\'upload en masse...')
      console.log(`Fichiers sélectionnés: ${selectedFiles.length}`)
      console.log(`Catégorie: ${selectedCategory}`)
      console.log(`Onglet actif: ${activeTab}`)

      const formData = new FormData()
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })
      formData.append('category', selectedCategory)
      formData.append('is_secret', activeTab === "secret" ? "true" : "false")

      const response = await fetch('/api/upload-bulk', {
        method: 'POST',
        body: formData,
      })

      console.log('Réponse reçue:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur de réponse:', errorData)
        throw new Error(errorData.error || 'Erreur lors de l\'upload en masse')
      }

      const result = await response.json()
      console.log('Résultat de l\'upload:', result)
      
      if (result.success) {
        // Convertir les fichiers uploadés en format portfolio
        const portfolioItems = result.uploadedFiles.map((file: any) => ({
          name: file.name,
          category: file.category,
          image: file.url,
          age: '', // Pas d'âge pour l'upload en masse
          description: '', // Pas de description
          experience: '', // Pas d'expérience
          specialties: [],
          is_secret: file.is_secret // Utiliser le paramètre retourné par l'API
        }))

        console.log('Éléments de portfolio créés:', portfolioItems)
        onBulkUpload(portfolioItems)
        
        // Réinitialiser le formulaire
        setSelectedFiles([])
        setSelectedCategory('')
        setUploadProgress(null)
        onClose()
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload en masse')
      }

    } catch (error) {
      console.error('Erreur upload en masse:', error)
      setUploadProgress(prev => prev ? {
        ...prev,
        errors: [...prev.errors, error instanceof Error ? error.message : 'Erreur lors de l\'upload en masse']
      } : null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setSelectedFiles([])
    setSelectedCategory('')
    setUploadProgress(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Upload en Masse - Portfolio {activeTab === "secret" ? "Secret" : "Principal"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélection de catégorie */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Catégorie des talents
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enfants">Enfants</SelectItem>
                <SelectItem value="jeunes">Jeunes</SelectItem>
                <SelectItem value="seniors">Seniors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sélection de fichiers */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sélectionner les images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choisir des images
              </Button>
              <p className="text-sm text-gray-500">
                Glissez-déposez vos images ici ou cliquez pour sélectionner
              </p>
            </div>
          </div>

          {/* Fichiers sélectionnés */}
          {selectedFiles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                Fichiers sélectionnés ({selectedFiles.length})
              </h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <FileImage className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progression de l'upload */}
          {uploadProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Upload en cours...</span>
                <span>{uploadProgress.current}/{uploadProgress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                />
              </div>
              {uploadProgress.errors.length > 0 && (
                <div className="text-red-500 text-sm">
                  {uploadProgress.errors.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedCategory || selectedFiles.length === 0 || isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Upload...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>

          {/* Info sur le portfolio */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-blue-700">
                Les images seront ajoutées au portfolio <strong>{activeTab === "secret" ? "secret" : "principal"}</strong>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
