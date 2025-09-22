import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Seuls les fichiers image sont autorisés' },
        { status: 400 }
      )
    }

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (max 10MB)' },
        { status: 400 }
      )
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `portfolio_${timestamp}_${randomString}.${fileExtension}`

    // Chemin complet du fichier
    const filePath = join(uploadsDir, fileName)

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Optimiser l'image avec Sharp (correction de rotation + compression)
    let optimizedBuffer: Buffer = buffer
    try {
      const image = sharp(buffer)
      
      // Corriger automatiquement la rotation selon les métadonnées EXIF
      image.rotate()
      
      // Optimiser selon le format
      if (fileExtension === 'png') {
        const pngBuffer = await image.png({ quality: 85 }).toBuffer()
        optimizedBuffer = Buffer.from(pngBuffer)
      } else {
        const jpegBuffer = await image.jpeg({ quality: 85 }).toBuffer()
        optimizedBuffer = Buffer.from(jpegBuffer)
      }
    } catch (sharpError) {
      console.warn(`Erreur Sharp pour ${file.name}, utilisation du fichier original:`, sharpError)
      // En cas d'erreur Sharp, utiliser le fichier original
      optimizedBuffer = buffer
    }

    // Écrire le fichier optimisé
    await writeFile(filePath, optimizedBuffer)

    // Retourner l'URL de l'API de service d'images
    const fileUrl = `/api/serve-image/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    )
  }
}
