import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

// Configuration optimisée pour uploads rapides
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB max
const MAX_FILES_PER_BATCH = 10 // Réduire le batch
const COMPRESSION_QUALITY = 75 // Compression plus agressive
const MAX_WIDTH = 1200 // Taille réduite
const UPLOAD_TIMEOUT = 30000 // 30 secondes max

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
        
        // Compression ULTRA-RAPIDE
        let optimizedBuffer: Buffer
        try {
          optimizedBuffer = await sharp(buffer)
            .resize(MAX_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: COMPRESSION_QUALITY })
            .toBuffer()
        } catch (sharpError) {
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