'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import { handleError } from '@/lib/utils'
import { ObjectId } from 'mongodb'

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventStatusParams,
} from '@/types'

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    console.log('createEvent called with userId:', userId)
    console.log('createEvent called with event data:', event)

    await connectToDatabase()
    console.log('Database connected')

    // Map Clerk userId to internal User._id
    const organizer = await User.findOne({ clerkId: userId })
    console.log('Organizer found:', organizer)
    if (!organizer) throw new Error('Organizer not found')

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: organizer._id,
      status: 'pending'
    })

    // Fire-and-forget moderation webhook
    try {
      await fetch(process.env.MODERATION_WEBHOOK_URL || 'https://karanja-kariuki.app.n8n.cloud/webhook/92c9b343-6599-4253-afb4-711946738a55', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'KK_ACCESS_PASS': 'CFtMJFnPwxAT8EMI5aPOfS7fA4E9qA3dX' },
        body: JSON.stringify({
          event_id: newEvent._id.toString(),
          title: newEvent.title,
          description: newEvent.description || ''
        })
      }).catch(() => { })
    } catch { }
    console.log('Event created in database:', newEvent)

    // Revalidate key pages
    if (path) revalidatePath(path)
    revalidatePath('/profile')
    revalidatePath('/admin')
    revalidatePath('/')

    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    console.error('createEvent error:', error)
    handleError(error)
    return null
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase()

    const event = await populateEvent(Event.findById(eventId))

    if (!event) throw new Error('Event not found')

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase()

    const eventToUpdate = await Event.findById(event._id)
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    )

    // Re-run moderation after updates
    if (updatedEvent) {
      try {
        await fetch(process.env.MODERATION_WEBHOOK_URL || 'https://karanja-kariuki.app.n8n.cloud/webhook/92c9b343-6599-4253-afb4-711946738a55', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'KK_ACCESS_PASS': 'CFtMJFnPwxAT8EMI5aPOfS7fA4E9qA3dX' },
          body: JSON.stringify({
            event_id: updatedEvent._id.toString(),
            title: updatedEvent.title,
            description: updatedEvent.description || ''
          })
        }).catch(() => { })
      } catch { }
    }
    if (path) revalidatePath(path)
    revalidatePath('/profile')
    revalidatePath('/admin')
    revalidatePath('/')

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase()

    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (deletedEvent) {
      if (path) revalidatePath(path)
      revalidatePath('/profile')
      revalidatePath('/admin')
      revalidatePath('/')
    }
  } catch (error) {
    handleError(error)
  }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await connectToDatabase()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    const conditions = {
      $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}, { status: 'approved' }],
    }

    const skipAmount = (Number(page) - 1) * limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const owner = await User.findOne({ clerkId: userId })
    if (!owner) throw new Error('User not found')
    const conditions = { organizer: owner._id }
    const skipAmount = (page - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// ADMIN: Approve/Reject Event
export async function updateEventStatus({ eventId, status }: UpdateEventStatusParams) {
  try {
    await connectToDatabase()
    const updated = await Event.findByIdAndUpdate(eventId, { status }, { new: true })
    revalidatePath('/admin')
    revalidatePath('/')
    return JSON.parse(JSON.stringify(updated))
  } catch (error) {
    handleError(error)
  }
}

// ADMIN: Get all pending events
export async function getPendingEvents() {
  try {
    await connectToDatabase()
    const eventsQuery = Event.find({ status: 'pending' }).sort({ createdAt: 'desc' })
    const events = await populateEvent(eventsQuery)
    return JSON.parse(JSON.stringify(events))
  } catch (error) {
    handleError(error)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
