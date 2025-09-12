import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'

// ✅ Handle preflight (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// ✅ Handle POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_id, risk_score, reasoning, flags } = body || {}

    if (!event_id) {
      return NextResponse.json(
        { error: 'event_id required' },
        {
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      )
    }

    await connectToDatabase()
    await Event.findByIdAndUpdate(event_id, {
      moderation: {
        risk_score,
        reasoning,
        flags,
      },
    })

    return NextResponse.json(
      { success: true },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  } catch (e) {
    return NextResponse.json(
      { error: 'failed' },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}
