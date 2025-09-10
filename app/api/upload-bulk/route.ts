import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Début upload en masse ===')
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string
    const isSecret = formData.get('is_secret') === 'true'
    
    console.log(`Nombre de fichiers: ${files.length}`)
    console.log(`Catégorie: ${category}`)
    console.log(`Secret: ${isSecret}`)
    
    if (!files || files.length === 0) {
      console.log('Erreur: Aucun fichier fourni')
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    if (!category) {
      console.log('Erreur: Catégorie requise')
      return NextResponse.json(
        { error: 'Catégorie requise' },
        { status: 400 }
      )
    }

    // Vérifier que la catégorie est valide
    const validCategories = ['enfants', 'jeunes', 'seniors']
    if (!validCategories.includes(category)) {
      console.log(`Erreur: Catégorie invalide: ${category}`)
      return NextResponse.json(
        { error: `Catégorie invalide. Valeurs acceptées: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    console.log(`Dossier uploads: ${uploadsDir}`)
    
    if (!existsSync(uploadsDir)) {
      console.log('Création du dossier uploads...')
      await mkdir(uploadsDir, { recursive: true })
    }

    const uploadedFiles = []
    const errors = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`Traitement du fichier ${i + 1}/${files.length}: ${file.name}`)
      
      try {
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
          const errorMsg = `${file.name}: Seuls les fichiers image sont autorisés (type: ${file.type})`
          console.log(errorMsg)
          errors.push(errorMsg)
          continue
        }

        // Vérifier la taille (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          const errorMsg = `${file.name}: Le fichier est trop volumineux (${Math.round(file.size / 1024 / 1024)}MB, max 10MB)`
          console.log(errorMsg)
          errors.push(errorMsg)
          continue
        }

        // Générer un nom de fichier unique
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `portfolio_${isSecret ? 'secret' : 'main'}_${category}_${timestamp}_${randomString}.${fileExtension}`

        // Chemin complet du fichier
        const filePath = join(uploadsDir, fileName)
        console.log(`Sauvegarde vers: ${filePath}`)

        // Convertir le fichier en buffer et l'écrire
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)
        
        console.log(`Fichier sauvegardé avec succès: ${fileName}`)

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
        const errorMsg = `${file.name}: Erreur lors de l'upload - ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        console.error(`Erreur lors de l'upload de ${file.name}:`, error)
        errors.push(errorMsg)
      }
    }

    console.log(`Upload terminé. Fichiers uploadés: ${uploadedFiles.length}, Erreurs: ${errors.length}`)
    console.log('=== Fin upload en masse ===')

    return NextResponse.json({
      success: true,
      uploadedFiles,
      errors,
      summary: {
        total: files.length,
        uploaded: uploadedFiles.length,
        failed: errors.length
      }
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload en masse:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'upload en masse',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
