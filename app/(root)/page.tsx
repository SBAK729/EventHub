'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Search from '@/components/shared/Search'
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Music,
  Palette,
  Coffee,
  UsersIcon,
  Laptop,
  Heart,
  Mountain,
  Wrench,
  Facebook,
  Twitter,
  Instagram,
  Github,
} from 'lucide-react'

type Event = {
  _id: string
  title: string
  category: string
  startDateTime: string
  endDateTime?: string
  location: string
  organizer: string
  price: string
  isFree: boolean
  imageUrl: string
  tags?: string
}

export default function Home() {
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<Event[]>([])
  const [message, setMessage] = useState('')
  const [approved, setApproved] = useState<Event[]>([])

  useEffect(() => {
    const loadApproved = async () => {
      try {
        console.log('Fetching events from API...')
        const res = await fetch('/api/events?limit=8&page=1', { cache: 'no-store' })
        console.log('API response status:', res.status)
        console.log('API response headers:', res.headers)
        
        if (!res.ok) {
          throw new Error(`API request failed with status: ${res.status}`)
        }
        
        const json = await res.json()
        console.log('API response data:', json)
        
        const data: any[] = json?.data || []
        console.log('Events data:', data)
        
        const mapped = data.map((e: any) => ({
          _id: e._id,
          title: e.title,
          category: e.category?.name || 'General',
          startDateTime: e.startDateTime,
          endDateTime: e.endDateTime,
          location: e.location,
          organizer: e.organizer ? `${e.organizer.firstName} ${e.organizer.lastName}` : '—',
          price: e.price,
          isFree: e.isFree,
          imageUrl: e.imageUrl,
          tags: e.tags || '',
        })) as Event[]
        
        console.log('Mapped events:', mapped)
        setApproved(mapped)
      } catch (e) {
        console.error('Error loading events:', e)
      }
    }
    loadApproved()
  }, [])

  const handleSearchResults = (data: Event[], msg: string) => {
    setResults(data)
    setMessage(msg)
    setShowResults(true)
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/hero.png')" }}
      >
        <div className="text-center text-white space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow">Your Community is Waiting</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Discover local workshops, cleanups, and festivals. Connect with your neighbors and make a difference.
          </p>
          <div className="flex justify-center">
            <Search onSearch={handleSearchResults} />
          </div>
        </div>
      </section>

      {showResults ? (
        <SearchResults
          results={results}
          message={message}
          onBack={() => setShowResults(false)}
        />
      ) : (
        <>
          <StepsSection />
          <RecommendedSection approved={approved} />
          <TrendingSection />
          <InterestsSection />
          <TestimonialSection />
          <HostCTA />
        </>
      )}

      <Footer />
    </>
  )
}

// ---------------- Event Card ----------------
interface EventCardProps {
  image: string
  category: string
  title: string
  date: string
  location: string
  attendees: string
  price: string
  organizer?: string
  variant?: 'dark' | 'light'
  id?: string
}

function EventCard({
  image,
  category,
  title,
  date,
  location,
  attendees,
  price,
  organizer,
  variant = "light",
  id,
}: EventCardProps) {
  const isDark = variant === "dark";

  return (
    <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="object-cover w-full h-full"
        />
        <Badge
          className={`absolute top-3 left-3 ${
            isDark ? "bg-white text-purple-700" : "bg-purple-100 text-purple-700"
          }`}
        >
          {category}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold mb-2 text-lg truncate">{title}</h3>

        <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate" title={location}>{location}</span>
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{attendees || "N/A"}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>{price}</span>
          </div>
        </div>

        {/* Organizer */}
        {organizer && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xs font-semibold">{organizer[0]}</span>
            </div>
            <span className="text-sm text-gray-700 truncate" title={organizer}>{organizer}</span>
          </div>
        )}

        {/* Button */}
        <div className="mt-auto">
          {id ? (
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Link href={`/events/${id}`}>Learn More</Link>
            </Button>
          ) : (
            <Button disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed">
              Learn More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


// ---------------- Interest Card ----------------
interface InterestCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
}

function InterestCard({ icon: Icon, title }: InterestCardProps) {
  return (
    <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer rounded-lg">
      <Icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
      <h3 className="font-medium text-sm">{title}</h3>
    </Card>
  )
}

// ---------------- Sections ----------------
function SearchResults({ results, message, onBack }: { results: Event[]; message: string; onBack: () => void }) {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Search Results</h2>
        {message && <p className="text-red-600">{message}</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map(event => (
            <EventCard
              key={event._id}
              id={event._id}
              image={event.imageUrl}
              category={event.category}
              title={event.title}
              date={new Date(event.startDateTime).toLocaleDateString()}
              location={event.location}
              attendees="N/A"
              price={event.isFree ? 'Free' : `$${event.price}`}
              organizer={event.organizer}
              variant="light"
            />
          ))}
        </div>
        <div className="mt-6">
          <Button onClick={onBack} className="bg-gray-300 text-black hover:bg-gray-400">⬅ Back to Homepage</Button>
        </div>
      </div>
    </section>
  )
}

function StepsSection() {
  return (
    <section className="bg-gray-100 py-16 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Connect in Three Easy Steps</h2>
      <div className="flex justify-center gap-12 flex-wrap">
        <StepCard icon="🔍" title="Find an Event" description="Use our smart search to find events that match your interests." />
        <StepCard icon="✅" title="RSVP in a Tap" description="Confirm your spot and add events to your calendar." />
        <StepCard icon="➕" title="Create Your Own" description="Organizers can post and manage events for free." />
      </div>
    </section>
  )
}

function StepCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="w-60 space-y-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="text-4xl text-purple-600">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function RecommendedSection({ approved }: { approved: Event[] }) {
  console.log('RecommendedSection rendered with approved events:', approved)
  console.log('Number of approved events:', approved.length)
  
  return (
    <section className="bg-purple-700 py-12 md:py-16">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Recommended For You</h2>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approved.length > 0 ? approved.map(ev => {
            console.log('Rendering event card for:', ev.title)
            return (
              <EventCard
                key={ev._id}
                id={ev._id}
                image={ev.imageUrl}
                category={ev.category}
                title={ev.title}
                date={new Date(ev.startDateTime).toLocaleString()}
                location={ev.location}
                attendees=""
                price={ev.isFree ? 'Free' : ev.price}
                organizer={ev.organizer}
              />
            )
          }) : <p className="text-white">No recommended events yet.</p>}
        </div>
      </div>
    </section>
  )
}

function TrendingSection() {
  return (
    <section className="bg-white dark:bg-gray-900 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-purple-700 dark:text-purple-400">Trending in Nairobi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard image="/assets/images/yoga-wellness-morning-session.png" category="Health" title="Wellness & Yoga Morning" date="Sat, Sept 21 • 6:30 AM" location="Karura Forest, Nairobi" attendees="500 Attending" price="KES 300" variant="light"/>
          <EventCard image="/assets/images/street-food-festival-night-market.png" category="Food" title="Street Food Festival" date="Sat, Sept 28 • 11:00 AM" location="KICC Grounds, Nairobi" attendees="354 attending" price="200" variant="light"/>
          <EventCard image="/assets/images/business-startup-pitch-presentation.png" category="Business" title="Startup Pitch Night" date="Thurs, Sept 26 • 6:00 PM" location="iHub, Nairobi" attendees="645 attending" price="1000" variant="light"/>
        </div>
      </div>
    </section>
  )
}

function InterestsSection() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-purple-700 dark:text-purple-400">Explore Your Interests</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <InterestCard icon={Music} title="Music" />
          <InterestCard icon={Palette} title="Art & Culture" />
          <InterestCard icon={Coffee} title="Food & Drink" />
          <InterestCard icon={UsersIcon} title="Community" />
          <InterestCard icon={Laptop} title="Tech" />
          <InterestCard icon={Heart} title="Health & Wellness" />
          <InterestCard icon={Mountain} title="Outdoors" />
          <InterestCard icon={Wrench} title="Workshops" />
        </div>
      </div>
    </section>
  )
}

function TestimonialSection() {
  const testimonials = [
    { quote: "EventHub doubled our attendance in two months.", name: "David Kamau", title: "Workshop Organizer" },
    { quote: "The checkout is seamless. Our team loves it.", name: "Aisha Ali", title: "Community Lead" },
    { quote: "The easiest way to discover local events.", name: "Brian Otieno", title: "Student" },
    { quote: "Posting events takes minutes. So good!", name: "Lucy Wanjiru", title: "Volunteer Coordinator" },
  ]
  return (
    <section className="bg-white dark:bg-gray-900 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-purple-700 dark:text-purple-400">What Our Community is Saying</h2>
        <div className="overflow-hidden">
          <div className="flex gap-6 animate-[slide_24s_linear_infinite] hover:[animation-play-state:paused]">
          {testimonials.map((t, idx) => (
              <Card key={idx} className="min-w-[280px] sm:min-w-[360px] rounded-lg shadow-md">
                <CardContent className="p-6 text-left">
                  <div className="text-3xl text-purple-600 mb-3">"</div>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">{t.quote}</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  )
}

function HostCTA() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-purple-700 dark:text-purple-400">
          Want to Host Your Own Event?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          EventHub is the easiest way to reach an engaged local audience. Post your event in minutes and watch your
          community grow.
        </p>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-lg">
          <Link href="/events/create">Create an Event for Free</Link>
        </Button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-purple-700 dark:bg-purple-950 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-700 font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-lg">EventHub</span>
            </div>
            <p className="text-white/80 text-sm">
              Connecting communities through meaningful events. Discover, create, and participate in local experiences
              that bring people together.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/80 hover:text-white">Discover Events</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">For Organizers</a></li>
              <li><Link href="/about" className="text-white/80 hover:text-white">About Us</Link></li>
              <li><a href="#" className="text-white/80 hover:text-white">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/80 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Community Guidelines</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
              <Github className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

