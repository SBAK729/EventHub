import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectToDatabase } from '@/lib/database'
import { createOrder } from '@/lib/actions/order.actions'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const sig = req.headers.get('stripe-signature') as string
  const buf = await req.arrayBuffer()
  try {
    const event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, process.env.STRIPE_WEBHOOK_SECRET!)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const eventId = session.metadata.eventId
      const buyerId = session.metadata.buyerId
      const totalAmount = String((session.amount_total || 0) / 100)
      await connectToDatabase()
      await createOrder({
        stripeId: session.id,
        eventId,
        buyerId,
        totalAmount,
        createdAt: new Date()
      })
    }
    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }
}


