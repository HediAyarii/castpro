import { NextResponse } from "next/server"
import { getPartnerLogos, createPartnerLogo, deletePartnerLogo } from "@/lib/database"

export async function GET() {
  try {
    const logos = await getPartnerLogos()
    return NextResponse.json(logos)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch partner logos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const logo = await createPartnerLogo(data)
    return NextResponse.json(logo)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create partner logo" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    await deletePartnerLogo(Number.parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete partner logo" }, { status: 500 })
  }
}
