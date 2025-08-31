import { NextResponse } from "next/server"
import { getCastings, createCasting, updateCasting, deleteCasting } from "@/lib/database"

export async function GET() {
  try {
    const castings = await getCastings()
    return NextResponse.json(castings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch castings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const casting = await createCasting(data)
    return NextResponse.json(casting)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create casting" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const casting = await updateCasting(id, data)
    return NextResponse.json(casting)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update casting" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    await deleteCasting(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete casting" }, { status: 500 })
  }
}
