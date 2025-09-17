import { NextResponse } from "next/server"
import { getAppointments, createAppointment, updateAppointmentStatus } from "@/lib/database"

export async function GET() {
  try {
    const appointments = await getAppointments()
    return NextResponse.json(appointments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Creating appointment with data:', data)
    const appointment = await createAppointment(data)
    console.log('Appointment created successfully:', appointment)
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error in POST /api/appointments:', error)
    return NextResponse.json({ 
      error: "Failed to create appointment", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()
    const appointment = await updateAppointmentStatus(id, status)
    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}
