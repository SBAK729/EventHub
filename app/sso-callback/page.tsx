"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SSOCallbackPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isLoaded && isSignedIn && !hasRedirected) {
      setHasRedirected(true)
      console.log("SSO callback: User signed in, redirecting to home")
      router.replace("/")
    } else if (isLoaded && !isSignedIn) {
      // Set a timeout — if Clerk hasn’t signed them in after 5s, show error
      timeout = setTimeout(() => {
        setError("We couldn’t complete the sign-in. Please try again.")
      }, 5000)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isLoaded, isSignedIn, router, hasRedirected])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => router.replace("/sign-in")}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing sign-in...</p>
      </div>
    </div>
  )
}
