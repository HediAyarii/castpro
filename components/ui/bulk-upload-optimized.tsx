"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface BulkUploadOptimizedProps {
  onBulkUpload: (items: any[]) => void
  isOpen: boolean
  onClose: () => void
  activeTab?: "main" | "secret"
}

export function BulkUploadOptimized({ onBulkUpload, isOpen, onClose, activeTab = "main" }: BulkUploadOptimizedProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{
    current: number
    total: number
    errors: string[]
    completed: number
    failed: number
    totalTimeMs?: number
    averageTimePerFile?: number
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
      errors: [],
      completed: 0,
      failed: 0
    })

    try {
      console.log('Début de l\'upload en masse optimisé...')
      console.log(`Fichiers sélectionnés: ${selectedFiles.length}`)
      console.log(`Catégorie: ${selectedCategory}`)
      console.log(`Onglet actif: ${activeTab}`)

      const formData = new FormData()
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })
      formData.append('category', selectedCategory)
      formData.append('is_secret', activeTab === "secret" ? "true" : "false")

      const startTime = Date.now()
      
      const response = await fetch('/api/upload-bulk-optimized', {
        method: 'POST',
        body: formData,
      })

      const endTime = Date.now()
      const totalTime = endTime - startTime

      console.log('Réponse reçue:', response.status, response.statusText)
      console.log(`Temps total: ${totalTime}ms`)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur de réponse:', errorData)
        throw new Error(errorData.error || 'Erreur lors de l\'upload en masse')
      }

      const result = await response.json()
      console.log('Résultat de l\'upload optimisé:', result)
      
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
          is_secret: file.is_secret
        }))

        console.log('Éléments de portfolio créés:', portfolioItems)
        onBulkUpload(portfolioItems)
        
        // Afficher les statistiques de compression
        if (result.summary) {
          const avgCompression = result.uploadedFiles.reduce((acc: number, file: any) => 
            acc + (file.compressionRatio || 0), 0) / result.uploadedFiles.length
          
          console.log(`Compression moyenne: ${Math.round(avgCompression)}%`)
          console.log(`Temps moyen par fichier: ${result.summary.averageTimePerFile}ms`)
        }
        
        // Réinitialiser le formulaire
        setSelectedFiles([])
        setSelectedCategory('')
        setUploadProgress(null)
        onClose()
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload en masse')
      }

    } catch (error) {
      console.error('Erreur upload en masse optimisé:', error)
      setUploadProgress(prev => prev ? {
        ...prev,
        errors: [...prev.errors, error instanceof Error ? error.message : 'Erreur inconnue']
      } : null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearFiles = () => {
    setSelectedFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload en Masse Optimisé
          </CardTitle>
          <CardDescription>
            Upload rapide et optimisé de plusieurs images avec compression automatique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection de catégorie */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Catégorie</label>
            <div className="flex gap-2">
              {['enfants', 'jeunes', 'seniors'].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  disabled={isUploading}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Sélection de fichiers */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fichiers</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mb-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Sélectionner des images
              </Button>
              <p className="text-sm text-gray-500">
                Maximum 10 fichiers, 5MB par fichier (optimisé pour vitesse)
              </p>
            </div>
          </div>

          {/* Liste des fichiers sélectionnés */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Fichiers sélectionnés ({selectedFiles.length})
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFiles}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{file.name}</span>
                      <Badge variant="secondary">
                        {Math.round(file.size / 1024)} KB
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
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
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progression</span>
                <span className="text-sm text-gray-500">
                  {uploadProgress.completed + uploadProgress.failed} / {uploadProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((uploadProgress.completed + uploadProgress.failed) / uploadProgress.total) * 100}%`
                  }}
                />
              </div>
              {uploadProgress.errors.length > 0 && (
                <div className="space-y-1">
                  {uploadProgress.errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Annuler
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedCategory || selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Optimisé
                </>
              )}
            </Button>
          </div>

          {/* Informations sur l'optimisation */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Optimisations incluses :</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Traitement parallèle</strong> : Tous les fichiers sont traités simultanément</li>
              <li>• <strong>Compression automatique</strong> : Réduction de la taille des images</li>
              <li>• <strong>Redimensionnement intelligent</strong> : Adaptation automatique des dimensions</li>
              <li>• <strong>Timeouts configurés</strong> : Évite les blocages</li>
              <li>• <strong>Limite de fichiers</strong> : Maximum 10 fichiers par batch (optimisé)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
