import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

// Configuration pour l'upload de photos de candidats
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB max
const COMPRESSION_QUALITY = 80 // Qualité pour les photos de candidats
const MAX_WIDTH = 800 // Taille réduite pour les photos de profil
const MAX_HEIGHT = 800

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
    
    // Compression et redimensionnement
    let optimizedBuffer: Buffer
    try {
      optimizedBuffer = await sharp(buffer)
        .resize(MAX_WIDTH, MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: COMPRESSION_QUALITY })
        .toBuffer()
    } catch (sharpError) {
      console.warn(`Erreur Sharp pour ${file.name}, utilisation du fichier original:`, sharpError)
      optimizedBuffer = buffer
    }
    
    // Écrire le fichier
    await writeFile(filePath, optimizedBuffer)
    
    // Retourner l'URL de la photo
    const photoUrl = `/api/serve-image/candidates/${fileName}`
    
    console.log(`Photo candidat uploadée: ${fileName}`)
    
    return NextResponse.json({
      success: true,
      photoUrl: photoUrl,
      fileName: fileName,
      size: optimizedBuffer.length
    })
    
  } catch (error) {
    console.error('Erreur upload photo candidat:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de la photo' },
      { status: 500 }
    )
  }
}
