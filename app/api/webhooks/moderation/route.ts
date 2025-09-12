import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'

export default async function handler(req: NextRequest) {
  // ✅ REQUIRED - Handle preflight
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  // ✅ Handle your actual request
  if (req.method === 'POST') {
    try {
      const body = await req.json()
      const { event_id, risk_score, reasoning, flags } = body || {}
      
      if (!event_id) {
        return NextResponse.json({ error: 'event_id required' }, { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        })
      }

      await connectToDatabase()
      await Event.findByIdAndUpdate(event_id, {
        moderation: {
          risk_score,
          reasoning,
          flags,
        },
      })

      // Add CORS headers for actual response too
      return NextResponse.json({ success: true }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      })
    } catch (e) {
      return NextResponse.json({ error: 'failed' }, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      })
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}


