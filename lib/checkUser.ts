import { connectToDatabase } from "@/lib/database/index";
import { currentUser, EmailAddress } from "@clerk/nextjs/server";
import User from '@/lib/database/models/user.model'
import { handleError } from '@/lib/utils'


export const checkUser = async () => {
  try {
    await connectToDatabase()

    // Try by Mongo _id first; if it fails, fall back to Clerk ID
    let user = await currentUser()
    const userId = user?.id as string;
    try {
      user = await User.findById(userId)
    } catch {}
    if (!user) {
      user = await User.findOne({ clerkId: userId })
    }
    // Auto-provision user from Clerk if not found
    if (!user) {
      const newUser = await currentUser()
      const email = (newUser?.emailAddresses[0].emailAddress as string) || ''
      const firstName = (newUser?.firstName as string) || ''
      const lastName = (newUser?.lastName as string) || ''
      const username = (newUser?.username as string) || ''
      const photo = (newUser?.imageUrl as string) || ''

      if (!email) return null

      user = await User.create({
        clerkId: userId,
        email,
        firstName,
        lastName,
        username: username || email.split('@')[0],
        photo,
      })
      console.log(user)

    }
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
};