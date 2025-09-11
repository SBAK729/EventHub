"use client"
import { useAuth } from "@clerk/nextjs"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateUser, getUserById } from "@/lib/actions/user.actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// const { userId, sessionId, getToken } = useAuth()


export default function UpdateProfilePage() {
  const { userId, getToken } = useAuth()

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", photo: "" })

  // Hydrate from server action
  useState(() => {
    (async () => {
      try {
        // Using window because this is a client page; rely on Clerk frontend
        const resp = await fetch("/api/me")
        const me = await resp.json()
        setForm({
          firstName: me.firstName || "",
          lastName: me.lastName || "",
          username: me.username || "",
          photo: me.photo || "",
        })
      } catch {}
    })()
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error("Failed to update profile")
        alert("Profile updated successfully!")
        router.push("/profile")
      } catch (err) {
        console.error(err)
        alert("Update failed")
      }
    })
  }

  return (
    <div className="wrapper my-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Username</label>
            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Photo URL</label>
            <Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} />
          </div>
          <Button type="submit" disabled={isPending} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  )
}


