import { NextRequest, NextResponse } from "next/server"
import { verifyAccessKey } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json()
    
    if (!key) {
      return NextResponse.json({ error: "Clé d'accès requise" }, { status: 400 })
    }

    const accessKey = await verifyAccessKey(key)
    
    if (!accessKey) {
      return NextResponse.json({ 
        error: "Clé d'accès invalide ou expirée",
        valid: false 
      }, { status: 401 })
    }

    // Calculer le temps restant
    let timeRemaining = null
    if (accessKey.expires_at) {
      const expiresAt = new Date(accessKey.expires_at)
      const now = new Date()
      const diffTime = expiresAt.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      timeRemaining = diffDays > 0 ? diffDays : 0
    }

    return NextResponse.json({
      valid: true,
      accessKey: {
        id: accessKey.id,
        name: accessKey.name,
        permissions: accessKey.permissions,
        expiresAt: accessKey.expires_at,
        timeRemaining,
        isActive: accessKey.is_active
      }
    })

  } catch (error) {
    console.error("Erreur lors de la vérification de la clé:", error)
    return NextResponse.json({ 
      error: "Erreur interne du serveur",
      valid: false 
    }, { status: 500 })
  }
}
