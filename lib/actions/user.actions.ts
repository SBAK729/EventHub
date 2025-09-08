'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/user.model'
import Order from '@/lib/database/models/order.model'
import Event from '@/lib/database/models/event.model'
import { handleError } from '@/lib/utils'

import { CreateUserParams, UpdateUserParams } from '@/types'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    // Try by Mongo _id first; if it fails, fall back to Clerk ID
    let user = null as any
    try {
      user = await User.findById(userId)
    } catch {}
    if (!user) {
      user = await User.findOne({ clerkId: userId })
    }

    // Auto-provision user from Clerk if not found
    if (!user) {
      const { sessionClaims } = await auth()
      const email = (sessionClaims?.email as string) || ''
      const firstName = (sessionClaims?.firstName as string) || ''
      const lastName = (sessionClaims?.lastName as string) || ''
      const username = (sessionClaims?.username as string) || ''
      const photo = (sessionClaims?.image as string) || ''

      if (!email) throw new Error('User not found')

      user = await User.create({
        clerkId: userId,
        email,
        firstName,
        lastName,
        username: username || email.split('@')[0],
        photo,
      })
    }
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export const getAllUsers = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}) => {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const users = await User.find(
      query
        ? { firstName: { $regex: query, $options: "i" } } // example: search by firstName
        : {},
      { password: 0 }
    )
      .skip(skip)
      .limit(limit);

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    handleError(error);
  }
};


export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error('User not found')
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}