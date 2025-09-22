import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

// Configuration optimisée pour uploads rapides avec compression automatique
const MAX_FILE_SIZE = 30 * 1024 * 1024 // 30MB max (pour accepter les gros fichiers)
const MAX_FILES_PER_BATCH = 10 // Réduire le batch
const COMPRESSION_QUALITY = 75 // Compression plus agressive
const MAX_WIDTH = 1920 // Taille réduite
const UPLOAD_TIMEOUT = 30000 // 30 secondes max
const TARGET_SIZE = 5 * 1024 * 1024 // 5MB target après compression

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('=== Upload optimisé ULTRA-RAPIDE ===')
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string
    const isSecret = formData.get('is_secret') === 'true'
    
    // Limiter le nombre de fichiers
    if (files.length > MAX_FILES_PER_BATCH) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES_PER_BATCH} fichiers par batch` },
        { status: 400 }
      )
    }
    
    // Créer le dossier uploads
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Traitement ULTRA-RAPIDE en parallèle
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Validation rapide
        if (!file.type.startsWith('image/') || file.size > MAX_FILE_SIZE) {
          throw new Error(`Fichier invalide: ${file.name}`)
        }
        
        // Nom de fichier optimisé
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 8)
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `portfolio_${isSecret ? 'secret' : 'main'}_${category}_${timestamp}_${randomString}.${fileExtension}`
        
        // Chemin du fichier
        const filePath = join(uploadsDir, fileName)
        
        // Conversion rapide en buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Compression automatique agressive pour réduire à 5MB max
        let optimizedBuffer: Buffer
        try {
          const image = sharp(buffer)
          const metadata = await image.metadata()
          
          // Corriger automatiquement la rotation selon les métadonnées EXIF
          image.rotate()
          
          // Compression progressive jusqu'à atteindre 5MB max
          let quality = COMPRESSION_QUALITY
          let targetSize = TARGET_SIZE
          
          // Redimensionner d'abord si très gros
          if (metadata.width && metadata.height) {
            if (metadata.width > MAX_WIDTH || metadata.height > MAX_WIDTH) {
              image.resize(MAX_WIDTH, MAX_WIDTH, {
                fit: 'inside',
                withoutEnlargement: true
              })
            }
          }

          // Compression progressive
          do {
            if (fileExtension === 'png') {
              const pngBuffer = await image.png({ quality: quality }).toBuffer()
              optimizedBuffer = Buffer.from(pngBuffer)
            } else {
              const jpegBuffer = await image.jpeg({ quality: quality }).toBuffer()
              optimizedBuffer = Buffer.from(jpegBuffer)
            }
            
            // Si encore trop gros, réduire la qualité
            if (optimizedBuffer.length > targetSize && quality > 30) {
              quality -= 10
              console.log(`Compression ${file.name}: qualité ${quality}%, taille ${Math.round(optimizedBuffer.length / 1024 / 1024)}MB`)
            } else {
              break
            }
          } while (optimizedBuffer.length > targetSize && quality > 30)
          
          console.log(`Fichier ${file.name}: ${Math.round(file.size / 1024 / 1024)}MB → ${Math.round(optimizedBuffer.length / 1024 / 1024)}MB (qualité ${quality}%)`)
          
        } catch (sharpError) {
          console.warn(`Erreur Sharp pour ${file.name}, utilisation du fichier original:`, sharpError)
          optimizedBuffer = buffer
        }
        
        // Écriture directe
        await writeFile(filePath, optimizedBuffer)
        
        return {
          fileName: fileName,
          url: `/api/serve-image/${fileName}`,
          name: `${category.charAt(0).toUpperCase() + category.slice(1)}${index + 1}`,
          category: category,
          is_secret: isSecret,
          size: optimizedBuffer.length
        }
        
      } catch (error) {
        return { error: `${file.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}` }
      }
    })
    
    // Attendre tous les uploads avec timeout
    const results = await Promise.allSettled(uploadPromises)
    
    // Séparer succès et erreurs
    const uploadedFiles: any[] = []
    const errors: string[] = []
    
    results.forEach((result: any) => {
      if (result.status === 'fulfilled' && !result.value.error) {
        uploadedFiles.push(result.value)
      } else if (result.status === 'rejected') {
        errors.push(`Erreur: ${result.reason}`)
      } else if (result.status === 'fulfilled' && result.value.error) {
        errors.push(result.value.error)
      }
    })
    
    const endTime = Date.now()
    const totalTime = endTime - startTime
    
    console.log(`Upload terminé en ${totalTime}ms - ${uploadedFiles.length}/${files.length} fichiers`)
    
    return NextResponse.json({
      success: true,
      uploadedFiles,
      errors,
      summary: {
        total: files.length,
        uploaded: uploadedFiles.length,
        failed: errors.length,
        totalTimeMs: totalTime
      }
    })
    
  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}