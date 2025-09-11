'use client'

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

const AboutPage = () => {
  return (
    <section className="wrapper my-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About EventHub</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Connecting communities through meaningful events — simple, secure, and fast.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[{
            title: 'Create Easily',
            text: 'Publish events in minutes with images, location, and ticketing.'
          },{
            title: 'Discover Faster',
            text: 'Smart search and categories to find exactly what you want.'
          },{
            title: 'Secure Payments',
            text: 'Ticket checkout powered by Stripe for peace of mind.'
          }].map((f, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Host Your Event?</h2>
            <p className="text-white/90">Post your event for free and reach a growing community.</p>
          </div>
          <Link href="/events/create" className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg hover:opacity-90 transition">Create an Event</Link>
        </div>
      </div>
    </section>
  )
}

export default AboutPage


