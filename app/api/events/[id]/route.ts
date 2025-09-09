import { NextResponse } from 'next/server'
import { getEventById } from '@/lib/actions/event.actions'

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  try {
    const event = await getEventById(params.id)
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(event)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}


