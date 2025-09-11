import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import Order from '@/lib/database/models/order.model'
import User from '@/lib/database/models/user.model'
// no need: import fetch from 'node-fetch'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)

    const start = new Date(tomorrow)
    start.setHours(0, 0, 0, 0)
    const end = new Date(tomorrow)
    end.setHours(23, 59, 59, 999)

    // Find events happening tomorrow (approved only)
    const events = await Event.find({ startDateTime: { $gte: start, $lte: end }, status: 'approved' })

    for (const ev of events) {
      const orders = await Order.find({ event: ev._id }).populate('buyer')
      for (const ord of orders) {
        const buyer: any = ord.buyer
        if (!buyer?.email) continue
        await fetch(
          process.env.EMAIL_AGENT_WEBHOOK_URL ||
          'https://karanja-kariuki.app.n8n.cloud/webhook/90d9afd1-e9e1-4f79-ae14-aa3cde1d1247',
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              'KK_ACCESS_PASS': process.env.KK_ACCESS_PASS || ''  // ✅ use env variable
            },
            body: JSON.stringify({
              name: `${buyer.firstName} ${buyer.lastName}`.trim(),
              email: buyer.email,
              event_title: ev.title,
              event_date: ev.startDateTime ? new Date(ev.startDateTime).toLocaleDateString() : '',
              event_time: ev.startDateTime ? new Date(ev.startDateTime).toLocaleTimeString() : '',
              event_place: ev.location || '',
              reminder_type: 'reminder'
            })
          }
        ).catch(() => {})
      }
    }

    return NextResponse.json({ ok: true, events: events.length })
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
