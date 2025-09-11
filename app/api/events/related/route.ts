import { NextRequest, NextResponse } from 'next/server'
import { getRelatedEventsByCategory } from '@/lib/actions/event.actions'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || ''
    const eventId = searchParams.get('eventId') || ''
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '3')

    if (!categoryId || !eventId) {
      return NextResponse.json(
        { error: 'categoryId and eventId are required' },
        { status: 400 }
      )
    }

    const results = await getRelatedEventsByCategory({ categoryId, eventId, page, limit })
    return NextResponse.json(results)
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch related events' },
      { status: 500 }
    )
  }
}
