import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

// Configuration des limites
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES_PER_BATCH = 20 // Limite de fichiers par batch
const COMPRESSION_QUALITY = 85 // Qualité JPEG
const MAX_WIDTH = 1920 // Largeur maximale
const MAX_HEIGHT = 1080 // Hauteur maximale

// Configuration des timeouts
const FILE_TIMEOUT = 30000 // 30 secondes par fichier
const TOTAL_TIMEOUT = 300000 // 5 minutes total

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('=== Début upload en masse optimisé ===')
    
    // Vérifier le timeout total
    const timeoutId = setTimeout(() => {
      throw new Error('Timeout: Upload trop long')
    }, TOTAL_TIMEOUT)
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string
    const isSecret = formData.get('is_secret') === 'true'
    
    console.log(`Nombre de fichiers: ${files.length}`)
    console.log(`Catégorie: ${category}`)
    console.log(`Secret: ${isSecret}`)
    
    // Validations
    if (!files || files.length === 0) {
      clearTimeout(timeoutId)
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    if (files.length > MAX_FILES_PER_BATCH) {
      clearTimeout(timeoutId)
      return NextResponse.json(
        { error: `Trop de fichiers. Maximum: ${MAX_FILES_PER_BATCH}` },
        { status: 400 }
      )
    }

    if (!category) {
      clearTimeout(timeoutId)
      return NextResponse.json(
        { error: 'Catégorie requise' },
        { status: 400 }
      )
    }

    const validCategories = ['enfants', 'jeunes', 'seniors']
    if (!validCategories.includes(category)) {
      clearTimeout(timeoutId)
      return NextResponse.json(
        { error: `Catégorie invalide. Valeurs acceptées: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Créer le dossier uploads
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Fonction pour traiter un fichier individuel
    const processFile = async (file: File, index: number) => {
      return new Promise(async (resolve, reject) => {
        const fileTimeout = setTimeout(() => {
          reject(new Error(`Timeout pour ${file.name}`))
        }, FILE_TIMEOUT)

        try {
          console.log(`Traitement du fichier ${index + 1}/${files.length}: ${file.name}`)
          
          // Vérifications
          if (!file.type.startsWith('image/')) {
            throw new Error(`Seuls les fichiers image sont autorisés (type: ${file.type})`)
          }

          if (file.size > MAX_FILE_SIZE) {
            throw new Error(`Fichier trop volumineux (${Math.round(file.size / 1024 / 1024)}MB, max 10MB)`)
          }

          // Générer un nom de fichier unique
          const timestamp = Date.now()
          const randomString = Math.random().toString(36).substring(2, 15)
          const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
          const fileName = `portfolio_${isSecret ? 'secret' : 'main'}_${category}_${timestamp}_${randomString}.${fileExtension}`

          // Chemin complet du fichier
          const filePath = join(uploadsDir, fileName)

          // Convertir le fichier en buffer
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)

          // Optimiser l'image avec Sharp
          let optimizedBuffer: Buffer = buffer
          try {
            const image = sharp(buffer)
            const metadata = await image.metadata()
            
            // Corriger automatiquement la rotation selon les métadonnées EXIF
            image.rotate()
            
            // Redimensionner si nécessaire
            if (metadata.width && metadata.height) {
              if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
                image.resize(MAX_WIDTH, MAX_HEIGHT, {
                  fit: 'inside',
                  withoutEnlargement: true
                })
              }
            }

            // Optimiser selon le format
            if (fileExtension === 'png') {
              const pngBuffer = await image.png({ quality: COMPRESSION_QUALITY }).toBuffer()
              optimizedBuffer = Buffer.from(pngBuffer)
            } else {
              const jpegBuffer = await image.jpeg({ quality: COMPRESSION_QUALITY }).toBuffer()
              optimizedBuffer = Buffer.from(jpegBuffer)
            }
          } catch (sharpError) {
            console.warn(`Erreur Sharp pour ${file.name}, utilisation du fichier original:`, sharpError)
            // En cas d'erreur Sharp, utiliser le fichier original
            optimizedBuffer = buffer
          }

          // Écrire le fichier optimisé
          await writeFile(filePath, optimizedBuffer)
          
          console.log(`Fichier optimisé et sauvegardé: ${fileName}`)

          // Générer le nom générique
          let genericName = ''
          switch (category) {
            case 'enfants':
              genericName = `Enfant${index + 1}`
              break
            case 'jeunes':
              genericName = `Jeune${index + 1}`
              break
            case 'seniors':
              genericName = `Senior${index + 1}`
              break
          }

          clearTimeout(fileTimeout)
          resolve({
            fileName: fileName,
            url: `/api/serve-image/${fileName}`,
            name: genericName,
            category: category,
            is_secret: isSecret,
            originalSize: file.size,
            optimizedSize: optimizedBuffer.length,
            compressionRatio: Math.round((1 - optimizedBuffer.length / file.size) * 100)
          })

        } catch (error) {
          clearTimeout(fileTimeout)
          reject(error)
        }
      })
    }

    // Traitement parallèle des fichiers
    console.log('Début du traitement parallèle...')
    const uploadPromises = files.map((file, index) => 
      processFile(file, index).catch(error => ({
        error: `${file.name}: ${error.message}`,
        fileName: file.name
      }))
    )

    // Attendre tous les uploads
    const results = await Promise.all(uploadPromises)
    
    // Séparer les succès et les erreurs
    const uploadedFiles: any[] = []
    const errors: string[] = []
    
    results.forEach((result: any) => {
      if (result.error) {
        errors.push(result.error)
      } else {
        uploadedFiles.push(result)
      }
    })

    clearTimeout(timeoutId)
    
    const endTime = Date.now()
    const totalTime = endTime - startTime
    
    console.log(`Upload terminé en ${totalTime}ms`)
    console.log(`Fichiers uploadés: ${uploadedFiles.length}, Erreurs: ${errors.length}`)
    console.log('=== Fin upload en masse optimisé ===')

    return NextResponse.json({
      success: true,
      uploadedFiles,
      errors,
      summary: {
        total: files.length,
        uploaded: uploadedFiles.length,
        failed: errors.length,
        totalTimeMs: totalTime,
        averageTimePerFile: Math.round(totalTime / files.length)
      }
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload en masse optimisé:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'upload en masse',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
