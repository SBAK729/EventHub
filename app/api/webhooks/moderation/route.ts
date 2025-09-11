import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_id, risk_score, reasoning, flags } = body || {}
    if (!event_id) return NextResponse.json({ error: 'event_id required' }, { status: 400 })
    await connectToDatabase()
    await Event.findByIdAndUpdate(event_id, {
      moderation: {
        risk_score,
        reasoning,
        flags,
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}


