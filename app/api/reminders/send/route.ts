import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Order from '@/lib/database/models/order.model'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import { NotificationService } from '@/lib/services/notification.service'

export async function POST(req: NextRequest) {
  try {
    const { eventId, userId } = await req.json()
    
    if (!eventId || !userId) {
      return NextResponse.json(
        { error: 'eventId and userId are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Find the event
    const event = await Event.findById(eventId)
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Find the user
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has an order for this event
    const order = await Order.findOne({ 
      event: eventId, 
      buyer: user._id 
    })

    if (!order) {
      return NextResponse.json(
        { error: 'No ticket found for this user and event' },
        { status: 404 }
      )
    }

    // Send reminder notification
    const success = await NotificationService.sendReminderNotification(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      {
        title: event.title,
        startDateTime: event.startDateTime,
        location: event.location
      }
    )

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Reminder sent successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send reminder' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Manual reminder error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
