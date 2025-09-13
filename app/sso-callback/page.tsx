"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SSOCallbackPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User successfully signed in, redirect to home
        router.push("/")
      } else {
        // Sign-in failed, redirect to sign-in page
        router.push("/sign-in")
      }
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading state while processing
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing sign-in...</p>
      </div>
    </div>
  )
}
