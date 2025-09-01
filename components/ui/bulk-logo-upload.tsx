"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Upload, X, FileImage, CheckCircle, AlertCircle } from "lucide-react"

interface BulkLogoUploadProps {
  isOpen: boolean
  onClose: () => void
  onBulkUpload: (items: Array<{ name: string; logo_url: string; alt_text: string; website_url: string; category: 'partner' | 'client' }>) => void
}

export function BulkLogoUpload({ onBulkUpload, isOpen, onClose }: BulkLogoUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState<'partner' | 'client'>('partner')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{
    current: number
    total: number
    errors: string[]
  } | null>(null)
  const [companyNames, setCompanyNames] = useState<string[]>([])
  const [websiteUrls, setWebsiteUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
    // Initialize company names and website URLs arrays
    setCompanyNames(files.map(() => ''))
    setWebsiteUrls(files.map(() => ''))
  }

  const handleCompanyNameChange = (index: number, value: string) => {
    const newNames = [...companyNames]
    newNames[index] = value
    setCompanyNames(newNames)
  }

  const handleWebsiteUrlChange = (index: number, value: string) => {
    const newUrls = [...websiteUrls]
    newUrls[index] = value
    setWebsiteUrls(newUrls)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress({
      current: 0,
      total: selectedFiles.length,
      errors: []
    })

    try {
      const uploadedLogos = []

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const companyName = companyNames[i] || file.name.replace(/\.[^/.]+$/, "") // Use filename if no name provided
        const websiteUrl = websiteUrls[i] || ""

        // Upload the file
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Erreur lors de l'upload de ${file.name}`)
        }

        const result = await response.json()
        
        if (result.url) {
          uploadedLogos.push({
            name: companyName,
            logo_url: result.url,
            alt_text: companyName,
            website_url: websiteUrl,
            category: selectedCategory
          })
        }

        setUploadProgress(prev => prev ? {
          ...prev,
          current: i + 1
        } : null)
      }

      // Call the callback with all uploaded logos
      onBulkUpload(uploadedLogos)
      
      // Reset form
      setSelectedFiles([])
      setCompanyNames([])
      setWebsiteUrls([])
      setUploadProgress(null)
      onClose()

    } catch (error) {
      console.error('Erreur upload en masse des logos:', error)
      setUploadProgress(prev => prev ? {
        ...prev,
        errors: [...prev.errors, 'Erreur lors de l\'upload en masse']
      } : null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setCompanyNames(prev => prev.filter((_, i) => i !== index))
    setWebsiteUrls(prev => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setSelectedFiles([])
    setCompanyNames([])
    setWebsiteUrls([])
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Upload en Masse - Logos Partenaires
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélection de catégorie */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Catégorie des logos
            </label>
            <Select value={selectedCategory} onValueChange={(value: 'partner' | 'client') => setSelectedCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partner">Logos partenaires</SelectItem>
                <SelectItem value="client">Logos clients</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sélection de fichiers */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sélectionner les logos
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
                Choisir des logos
              </Button>
              <p className="text-sm text-gray-500">
                Glissez-déposez vos logos ici ou cliquez pour sélectionner
              </p>
            </div>
          </div>

          {/* Fichiers sélectionnés avec formulaires */}
          {selectedFiles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                Logos sélectionnés ({selectedFiles.length})
              </h4>
              <div className="space-y-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <FileImage className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">{file.name}</span>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Nom de l'entreprise *
                        </label>
                        <Input
                          placeholder="Nom de l'entreprise"
                          value={companyNames[index] || ''}
                          onChange={(e) => handleCompanyNameChange(index, e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          URL du site web (optionnel)
                        </label>
                        <Input
                          placeholder="https://example.com"
                          value={websiteUrls[index] || ''}
                          onChange={(e) => handleWebsiteUrlChange(index, e.target.value)}
                        />
                      </div>
                    </div>
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
              disabled={selectedFiles.length === 0 || isUploading}
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
                  Upload {selectedFiles.length} logo{selectedFiles.length > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-blue-700">
                Les logos seront ajoutés comme <strong>{selectedCategory === "client" ? "clients" : "partenaires"}</strong>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
