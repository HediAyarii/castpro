import { NextResponse } from "next/server"
import { getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isSecret = searchParams.get("secret") === "true"
    const items = await getPortfolioItems(isSecret)
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const item = await createPortfolioItem(data)
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const item = await updatePortfolioItem(id, data)
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    await deletePortfolioItem(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 })
  }
}
