import { NextResponse } from "next/server"
import { getAccessKeys, createAccessKey, updateAccessKey, deleteAccessKey } from "@/lib/database"

export async function GET() {
  try {
    const keys = await getAccessKeys()
    return NextResponse.json(keys)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch access keys" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const key = await createAccessKey(data)
    return NextResponse.json(key)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create access key" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const key = await updateAccessKey(data)
    return NextResponse.json(key)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update access key" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    await deleteAccessKey(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete access key" }, { status: 500 })
  }
}
