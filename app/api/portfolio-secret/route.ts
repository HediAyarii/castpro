import { NextResponse } from "next/server"
import { getPortfolioItems } from "@/lib/database"

export async function GET() {
  try {
    // Récupérer uniquement les éléments du portfolio secret (is_secret = true)
    const secretItems = await getPortfolioItems(true)
    
    // Transformer les données pour correspondre au format attendu par le frontend
    const transformedItems = secretItems.map(item => {
      const specialties = typeof item.specialties === 'string' 
        ? item.specialties 
        : (item.specialties ? JSON.stringify(item.specialties) : 'Spécialité non définie')
      const name = typeof item.name === 'string' ? item.name : String(item.name ?? '')
      const category = typeof item.category === 'string' ? item.category : String(item.category ?? 'premium')
      const image = typeof item.image === 'string' ? item.image : '/placeholder.svg'
      const experience = typeof item.experience === 'string' ? item.experience : String(item.experience ?? 'Expérience non définie')
      const description = typeof item.description === 'string' ? item.description : String(item.description ?? 'Description non disponible')

      return ({
        id: String(item.id),
        name,
        age: typeof item.age === 'number' ? item.age : Number(item.age ?? 0),
        specialty: specialties,
        category,
        image,
        experience,
        location: 'Localisation non définie',
        awards: Array.isArray(item.awards) ? item.awards.map((a: any) => (typeof a === 'string' ? a : JSON.stringify(a))) : [],
        description,
      })
    })

    return NextResponse.json({
      success: true,
      items: transformedItems,
      count: transformedItems.length
    })

  } catch (error) {
    console.error("Erreur lors de la récupération du portfolio secret:", error)
    return NextResponse.json({ 
      error: "Erreur lors de la récupération du portfolio secret",
      success: false 
    }, { status: 500 })
  }
}
