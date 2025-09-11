import { NextRequest, NextResponse } from 'next/server'
import { getEventById } from '@/lib/actions/event.actions'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } } // must NOT be a Promise
) {
  try {
    const { id } = context.params
    const event = await getEventById(id)

    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
