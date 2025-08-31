import { NextResponse } from "next/server"
import { getCollaborationVideos, createCollaborationVideo, deleteCollaborationVideo } from "@/lib/database"

export async function GET() {
  try {
    const videos = await getCollaborationVideos()
    return NextResponse.json(videos)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch collaboration videos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const video = await createCollaborationVideo(data)
    return NextResponse.json(video)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create collaboration video" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    await deleteCollaborationVideo(Number.parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete collaboration video" }, { status: 500 })
  }
}
