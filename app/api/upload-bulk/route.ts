import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string
    const isSecret = formData.get('is_secret') === 'true' // Ajouter le paramètre secret
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie requise' },
        { status: 400 }
      )
    }

    // Vérifier que la catégorie est valide
    const validCategories = ['enfants', 'jeunes', 'seniors']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Catégorie invalide' },
        { status: 400 }
      )
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const uploadedFiles = []
    const errors = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name}: Seuls les fichiers image sont autorisés`)
          continue
        }

        // Vérifier la taille (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name}: Le fichier est trop volumineux (max 10MB)`)
          continue
        }

        // Générer un nom de fichier unique
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = file.name.split('.').pop()
        const fileName = `portfolio_${isSecret ? 'secret' : 'main'}_${category}_${timestamp}_${randomString}.${fileExtension}`

        // Chemin complet du fichier
        const filePath = join(uploadsDir, fileName)

        // Convertir le fichier en buffer et l'écrire
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        // Générer le nom générique selon la catégorie
        let genericName = ''
        switch (category) {
          case 'enfants':
            genericName = `Enfant${i + 1}`
            break
          case 'jeunes':
            genericName = `Jeune${i + 1}`
            break
          case 'seniors':
            genericName = `Senior${i + 1}`
            break
        }

        uploadedFiles.push({
          fileName: fileName,
          url: `/api/serve-image/${fileName}`,
          name: genericName,
          category: category,
          is_secret: isSecret
        })

      } catch (error) {
        console.error(`Erreur lors de l'upload de ${file.name}:`, error)
        errors.push(`${file.name}: Erreur lors de l'upload`)
      }
    }

    return NextResponse.json({
      success: true,
      uploadedFiles,
      errors
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload en masse:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload en masse' },
      { status: 500 }
    )
  }
}
