import { NextResponse } from "next/server"
import { getAppointments, createAppointment, updateAppointmentStatus } from "@/lib/database"

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function GET() {
  try {
    const appointments = await getAppointments()
    return NextResponse.json(appointments, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Creating appointment with data:', data)
    const appointment = await createAppointment(data)
    console.log('Appointment created successfully:', appointment)
    return NextResponse.json(appointment, { headers: corsHeaders })
  } catch (error) {
    console.error('Error in POST /api/appointments:', error)
    return NextResponse.json({ 
      error: "Failed to create appointment", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500, headers: corsHeaders })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()
    const appointment = await updateAppointmentStatus(id, status)
    return NextResponse.json(appointment, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500, headers: corsHeaders })
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}
