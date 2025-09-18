import { NextResponse } from "next/server"
import { getAvailableAppointmentSlots, checkAppointmentAvailability } from "@/lib/database"

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function GET() {
  try {
    const availableSlots = await getAvailableAppointmentSlots()
    return NextResponse.json(availableSlots, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json({ 
      error: "Failed to fetch available slots", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request: Request) {
  try {
    const { date, time } = await request.json()
    
    if (!date || !time) {
      return NextResponse.json({ 
        error: "Date and time are required" 
      }, { status: 400, headers: corsHeaders })
    }
    
    const isAvailable = await checkAppointmentAvailability(date, time)
    return NextResponse.json({ 
      available: isAvailable,
      date,
      time 
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Error checking appointment availability:', error)
    return NextResponse.json({ 
      error: "Failed to check availability", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500, headers: corsHeaders })
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}
