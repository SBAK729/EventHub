"use client"

import { useEffect, useState } from 'react'

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    if (stored) {
      const isDark = stored === 'dark'
      setDark(isDark)
      document.documentElement.classList.toggle('dark', isDark)
    } else {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      const isDark = mql.matches
      setDark(isDark)
      document.documentElement.classList.toggle('dark', isDark)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  if (!mounted) return null

  return (
    <button
      aria-label="Toggle Theme"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white hover:bg-white/10 transition"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? (
        <span>🌙</span>
      ) : (
        <span>☀️</span>
      )}
    </button>
  )
}

export default ThemeToggle


