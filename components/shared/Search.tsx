'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

type Event = {
  _id: string
  title: string
  category: string
  startDateTime: string
  endDateTime: string
  location: string
  organizer: string
  price: string
  isFree: boolean
  imageUrl: string
  tags: string
}

export default function Search({ placeholder = 'Search events...', onSearch }: { placeholder?: string, onSearch: (data: Event[], msg: string) => void }) {
  const [query, setQuery] = useState('')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const userId = user?.id || 'guest'
  const apiUrl = 'https://sench729-eventhub.hf.space/search'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, user_id: userId }),
      })

      const data = await res.json()
      console.log(data.results)

      if (data.results && data.results.length > 0) {
        onSearch(data.results, '')
      } else {
        onSearch([], 'No data matching your search')
      }
    } catch (err) {
      console.error('Error searching:', err)
      onSearch([], 'Something went wrong. Please try again.')
    } finally {
      setQuery('')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-2 rounded-l-md w-96 text-black bg-white"
      />
      <button
        type="submit"
        className="bg-purple-600 px-6 py-2 rounded-r-md ml-[-1px] text-white"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}