import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { clerkClient } from '@clerk/clerk-sdk-node'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const { type: eventType, data } = evt

    if (eventType === 'user.created') {
      const { id, email_addresses, image_url, first_name, last_name, username } = data

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address ?? '',
        username: username ?? '',
        firstName: first_name ?? '',
        lastName: last_name ?? '',
        photo: image_url ?? '',
      }

      const newUser = await createUser(user)

      if (newUser) {
        await clerkClient.users.updateUser(id, {
          publicMetadata: { userId: newUser._id },
        })
      }

      return NextResponse.json({ message: 'OK', user: newUser })
    }

    if (eventType === 'user.updated') {
      const { id, image_url, first_name, last_name, username } = data

      const user = {
        firstName: first_name ?? '',
        lastName: last_name ?? '',
        username: username ?? '',
        photo: image_url ?? '',
      }

      const updatedUser = await updateUser(id, user)
      return NextResponse.json({ message: 'OK', user: updatedUser })
    }

    if (eventType === 'user.deleted') {
      const { id } = data
      const deletedUser = await deleteUser(id ?? '')
      return NextResponse.json({ message: 'OK', user: deletedUser })
    }

    // Unknown event types
    return NextResponse.json({}, { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json({ error: 'Error verifying webhook' }, { status: 400 })
  }
}
