import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

// Configuration pour l'upload de photos de candidats - COMPRESSION ULTRA-AGRESSIVE
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB max
const COMPRESSION_QUALITY = 50 // Compression encore plus agressive
const MAX_WIDTH = 300 // Taille encore plus réduite
const MAX_HEIGHT = 300
const TARGET_SIZE = 50 * 1024 // 50KB maximum après compression

export async function POST(request: NextRequest) {
  try {
    console.log('=== Upload photo candidat ===')
    
    const formData = await request.formData()
    const file = formData.get('photo') as File
    const appointmentId = formData.get('appointmentId') as string
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }
    
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Seuls les fichiers image sont autorisés' }, { status: 400 })
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10MB)' }, { status: 400 })
    }
    
    // Créer le dossier uploads/candidates s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'candidates')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `candidate_${appointmentId || timestamp}_${randomString}.${fileExtension}`
    
    // Chemin du fichier
    const filePath = join(uploadsDir, fileName)
    
    // Conversion en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Compression ultra-agressive pour réduire la taille
    let optimizedBuffer: Buffer
    try {
      const image = sharp(buffer)
      const metadata = await image.metadata()
      
      // Corriger automatiquement la rotation selon les métadonnées EXIF
      image.rotate()
      
      // Compression progressive jusqu'à atteindre 50KB max
      let quality = COMPRESSION_QUALITY
      let targetSize = TARGET_SIZE
      
      // Redimensionner d'abord si très gros
      if (metadata.width && metadata.height) {
        if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
          image.resize(MAX_WIDTH, MAX_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true
          })
        }
      }

      // Compression progressive jusqu'à 50KB
      do {
        const jpegBuffer = await image.jpeg({ quality: quality }).toBuffer()
        optimizedBuffer = Buffer.from(jpegBuffer)
        
        // Si encore trop gros, réduire la qualité
        if (optimizedBuffer.length > targetSize && quality > 15) {
          quality -= 5
          console.log(`Compression ${file.name}: qualité ${quality}%, taille ${Math.round(optimizedBuffer.length / 1024)}KB`)
        } else {
          break
        }
      } while (optimizedBuffer.length > targetSize && quality > 15)
      
      console.log(`Photo candidat ${file.name}: ${Math.round(file.size / 1024)}KB → ${Math.round(optimizedBuffer.length / 1024)}KB (qualité ${quality}%)`)
      
    } catch (sharpError) {
      console.warn(`Erreur Sharp pour ${file.name}, utilisation du fichier original:`, sharpError)
      optimizedBuffer = buffer
    }
    
    // Écrire le fichier
    await writeFile(filePath, optimizedBuffer)
    
    // Retourner l'URL de la photo ET l'image compressée en base64
    const photoUrl = `/api/serve-image/candidates/${fileName}`
    const photoBase64 = optimizedBuffer.toString('base64')
    
    console.log(`Photo candidat uploadée: ${fileName} (${Math.round(optimizedBuffer.length / 1024)}KB)`)
    
    return NextResponse.json({
      success: true,
      photoUrl: photoUrl,
      photoCompressed: photoBase64,
      fileName: fileName,
      size: optimizedBuffer.length,
      compressionRatio: Math.round((1 - optimizedBuffer.length / file.size) * 100)
    })
    
  } catch (error) {
    console.error('Erreur upload photo candidat:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de la photo' },
      { status: 500 }
    )
  }
}
