"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Link as LinkIcon, Check } from "lucide-react"

export default function ShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await onCopy()
    } catch {}
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        onClick={onShare}
        variant="outline"
        className="gap-2 text-gray-700 dark:text-gray-200"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      <Button
        type="button"
        onClick={onCopy}
        variant="outline"
        className="gap-2 text-gray-700 dark:text-gray-200"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <LinkIcon className="w-4 h-4" />
        )}
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  )
}
