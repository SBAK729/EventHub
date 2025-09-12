"use client"

import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Chrome } from "lucide-react"

export default function SignUpPage() {
  const { signUp, isLoaded } = useSignUp()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (!isLoaded) return null

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signUp.create({ emailAddress: email, password })
      if (result.status === "complete") {
        router.push("/")
      }
    } catch (err) {
      console.error("Sign-up error:", err)
    }
  }

  const signUpWithGoogle = () => {
    return signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    })
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl bg-white dark:bg-[#11121a] border border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-purple-700 dark:text-purple-300">
          Create Your Account ✨
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Sign Up
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Sign-Up */}
        <Button
          onClick={signUpWithGoogle}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-purple-50 dark:hover:bg-[#1a1b2a]"
        >
          <Chrome className="w-5 h-5 text-purple-600" />
          Continue with Google
        </Button>

        {/* Switch to Sign In */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-purple-600 hover:underline">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
