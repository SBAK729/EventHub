import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectToDatabase } from '@/lib/database'
import { createOrder } from '@/lib/actions/order.actions'
import { NotificationService } from '@/lib/services/notification.service'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'

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
      
      // Create the order
      await createOrder({
        stripeId: session.id,
        eventId,
        buyerId,
        totalAmount,
        createdAt: new Date()
      })
      
      // Send RSVP notification for paid tickets
      try {
        const eventData = await Event.findById(eventId);
        const buyerData = await User.findOne({ clerkId: buyerId });
        
        if (eventData && buyerData) {
          await NotificationService.sendRSVPNotification(
            {
              firstName: buyerData.firstName,
              lastName: buyerData.lastName,
              email: buyerData.email
            },
            {
              title: eventData.title,
              startDateTime: eventData.startDateTime,
              location: eventData.location
            }
          );
        }
      } catch (notificationError) {
        console.error("Failed to send RSVP notification for paid ticket:", notificationError);
        // Don't fail the webhook if notification fails
      }
    }
    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }
}


