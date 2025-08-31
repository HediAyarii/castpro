import { NextResponse } from "next/server"
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/database"

export async function GET() {
  try {
    const testimonials = await getTestimonials()
    return NextResponse.json(testimonials)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const testimonial = await createTestimonial(data)
    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const testimonial = await updateTestimonial(id, data)
    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    
    await deleteTestimonial(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
