import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { updateUser, getUserById } from '@/lib/actions/user.actions'

export async function GET() {
  try {
    const { sessionClaims } = await auth()
    const userId = sessionClaims?.userId as string
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const me = await getUserById(userId)
    return NextResponse.json(me)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth()
    const clerkId = sessionClaims?.userId as string
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const updated = await updateUser(clerkId, body)
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


