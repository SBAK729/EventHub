import { NextRequest, NextResponse } from 'next/server'
import { getEventsByUser } from '@/lib/actions/event.actions'

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  try {
    const { userId } = context.params
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '6')

    const results = await getEventsByUser({ userId, page, limit })
    return NextResponse.json(results)
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch user events' },
      { status: 500 }
    )
  }
}
