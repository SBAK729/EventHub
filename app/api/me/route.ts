import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserById } from '@/lib/actions/user.actions'

export async function GET() {
  try {
    const { sessionClaims } = await auth()
    const userId = sessionClaims?.userId as string

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const me = await getUserById(userId)
    return NextResponse.json(me)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
