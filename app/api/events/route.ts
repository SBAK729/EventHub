import { NextRequest, NextResponse } from 'next/server'
import { getAllEvents } from '@/lib/actions/event.actions'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || ''
    const category = searchParams.get('category') || ''
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '6')

    const results = await getAllEvents({ query, category, page, limit })
    return NextResponse.json(results)
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
