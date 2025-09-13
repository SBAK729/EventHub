import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Order from '@/lib/database/models/order.model'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import { NotificationService } from '@/lib/services/notification.service'

export async function GET(req: NextRequest) {
  try {
    // Verify this is a legitimate cron request (you might want to add authentication)
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    console.log('Starting daily reminder check...')

    // Get all orders for events happening tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)

    // Find all events happening tomorrow
    const eventsTomorrow = await Event.find({
      startDateTime: {
        $gte: tomorrow,
        $lt: dayAfter
      },
      status: 'approved'
    })

    console.log(`Found ${eventsTomorrow.length} events happening tomorrow`)

    let remindersSent = 0
    let errors = 0

    // For each event, find all orders and send reminders
    for (const event of eventsTomorrow) {
      try {
        const orders = await Order.find({ event: event._id })
          .populate('buyer', 'firstName lastName email')

        console.log(`Found ${orders.length} orders for event: ${event.title}`)

        for (const order of orders) {
          try {
            if (order.buyer && typeof order.buyer === 'object' && 'firstName' in order.buyer) {
              const buyer = order.buyer as any
              
              await NotificationService.sendReminderNotification(
                {
                  firstName: buyer.firstName,
                  lastName: buyer.lastName,
                  email: buyer.email
                },
                {
                  title: event.title,
                  startDateTime: event.startDateTime,
                  location: event.location
                }
              )
              
              remindersSent++
              console.log(`Reminder sent to ${buyer.email} for event: ${event.title}`)
            }
          } catch (error) {
            console.error(`Failed to send reminder for order ${order._id}:`, error)
            errors++
          }
        }
      } catch (error) {
        console.error(`Failed to process event ${event._id}:`, error)
        errors++
      }
    }

    console.log(`Reminder check completed. Sent: ${remindersSent}, Errors: ${errors}`)

    return NextResponse.json({
      success: true,
      eventsProcessed: eventsTomorrow.length,
      remindersSent,
      errors
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow POST as well for manual triggering
export async function POST(req: NextRequest) {
  return GET(req)
}