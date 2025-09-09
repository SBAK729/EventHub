// /app/page.tsx
import Image from "next/image"; 
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
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
  Quote
} from "lucide-react"
export default function Home() {
  return (
    <>
    
       <section className="relative h-[500px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/hero.png')" }}>
      <div className="text-center text-white space-y-6">
        <h1 className="text-4xl font-bold">Your Community is Waiting</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Discover local workshops, cleanups, and festivals. Connect with your
          neighbors and make a difference.
        </p>
        <div className="flex justify-center">
          <div className="flex h-14 w-full max-w-xl items-center rounded-lg border bg-white p-2 shadow-sm">
  {/* 1. Icon */}
  <Search className="mx-2 h-5 w-5 text-gray-500" />

  {/* 2. Input Field */}
  <input
    type="text"
    placeholder="Search for yoga, workshops, art..."
    className="h-full flex-1 bg-transparent text-lg text-black placeholder-gray-500 outline-none ring-0 focus:ring-0 border-none"
  />

  {/* 3. Search Button */}
  <Button
    size="lg"
    asChild
    className="rounded-md bg-[#564287] px-6 text-base text-white hover:bg-[#4a094a]"
  >
    <Link href="#events">
      Search
    </Link>
  </Button>
</div>
        </div>
      </div>
    </section>

      <section className="bg-[#F8F7FC] py-20 px-4 text-center">
  <h2 className="text-3xl font-bold text-gray-900 mb-16">Connect in Three Easy Steps</h2>
  <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-16">

    
    <div className="flex flex-col items-center text-center max-w-xs space-y-4">
      <div className="flex items-center justify-center w-20 h-20 bg-[#564287] rounded-full">
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-10 h-10 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 pt-2">Find an Event</h3>
      <p className="text-base text-gray-600">
        Use our smart search to find events that match your interests and schedule.
      </p>
    </div>

    
    <div className="flex flex-col items-center text-center max-w-xs space-y-4">
      <div className="flex items-center justify-center w-20 h-20 bg-[#564287] rounded-full">
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-10 h-10 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 pt-2">RSVP in a Tap</h3>
      <p className="text-base text-gray-600">
        Instantly confirm your spot and add events directly to your personal calendar.
      </p>
    </div>

    
    <div className="flex flex-col items-center text-center max-w-xs space-y-4">
      <div className="flex items-center justify-center w-20 h-20 bg-[#564287] rounded-full">
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-10 h-10 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 pt-2">Create Your Own</h3>
      <p className="text-base text-gray-600">
        Organizers can post and manage their community events for free.
      </p>
    </div>

  </div>
</section>

<section className="bg-gradient-to-r from-[#281E3E] to-[#6950A4] py-12 md:py-16">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-balance">Recommended For You</h2>
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
        <EventCard
          image="assets\images\urban-concert-stage-with-purple-lighting.png"
          category="Music"
          title="Urban Beats Concert"
          date="Fri, Sept 12 • 7:00 PM"
          location="Kasarani Stadium"
          attendees="554 attending"
          price="500"
        />

        <EventCard
          image="assets\images\volunteers-cleaning-park-environment.png"
          category="Volunteer"
          title="Green Future Cleanup Drive"
          date="Sun, Sept 15 • 9:00 AM"
          location="Uhuru Park, Nairobi"
          attendees="204 attending"
          price="Free"
        />

        <EventCard
          image="assets/images/tech-hackathon-coding-workspace.png"
          category="Tech"
          title="Tech for Tomorrow Hackathon"
          date="Sept 14-15 • 8:00 AM"
          location="Strathmore University, Nairobi"
          attendees="500 attending"
          price="Free"
        />

        <EventCard
          image="assets/images/jazz-festival-concert-crowd-blue-lights.png"
          category="Music"
          title="Summer Jazz Festival"
          date="7/15/2025 at 7:00PM"
          location="Central Park"
          attendees="254 attending"
          price="36"
        />
      </div>
    </div>
</section>

      {/* Trending in Nairobi */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-balance">Trending in Nairobi</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <EventCard
              image="assets/images/yoga-wellness-morning-session.png"
              category="Health"
              title="Wellness & Yoga Morning"
              date="Sat, Sept 21 • 6:30 AM"
              location="Karura Forest, Nairobi"
              attendees="500 Attending"
              price="KES 300"
              variant="light"
            />

            <EventCard
              image="assets/images/street-food-festival-night-market.png"
              category="Food"
              title="Street Food Festival"
              date="Sat, Sept 28 • 11:00 AM"
              location="KICC Grounds, Nairobi"
              attendees="354 attending"
              price="200"
              variant="light"
            />

            <EventCard
              image="assets/images/business-startup-pitch-presentation.png"
              category="Business"
              title="Startup Pitch Night"
              date="Thurs, Sept 26 • 6:00 PM"
              location="iHub, Nairobi"
              attendees="645 attending"
              price="1000"
              variant="light"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard
              image="assets/images/local-football-derby-match-stadium.png"
              category="Sports"
              title="Local Football Derby"
              date="Sat, Oct 5 • 3:00 PM"
              location="Nyayo National Stadium, Nairobi"
              attendees="400 attending"
              price="150"
              variant="light"
            />

            <EventCard
              image="assets/images/church-youth-conference-gathering.png"
              category="Church"
              title="Church Youth Conference"
              date="Sun, Sept 29 • 2:00 PM"
              location="Nairobi Chapel, Ngong Road"
              attendees="300 attending"
              price="Free"
              variant="light"
            />

            <EventCard
              image="assets/images/campus-talent-show-performance-stage.png"
              category="Community"
              title="Campus Talent Show"
              date="Wed, Sept 18 • 5:30 PM"
              location="Kenyatta University Main Hall"
              attendees="400 attending"
              price="200"
              variant="light"
            />
          </div>
        </div>
      </section>

      {/* Explore Your Interests */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-balance">Explore Your Interests</h2>

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

      {/* Community Testimonial */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-balance">What Our Community is Saying</h2>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Quote className="mx-auto h-12 w-12 text-black mb-4" fill="currentColor" />
              <p className="text-lg mb-6 text-pretty">
                Posting my events on EventHub has doubled my attendance, it's the easiest way to reach the right
                audience.
              </p>
              <div>
                <p className="font-semibold">David Kamau</p>
                <p className="text-muted-foreground text-sm">Community Workshop Organizer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Host Your Own Event CTA */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance">Want to Host Your Own Event?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            EventHub is the easiest way to reach an engaged local audience. Post your event in minutes and watch your
            community grow.
          </p>
          <Button className="bg-[#4E3C7B] hover:bg-[#3F3063] text-white px-8 py-3 text-lg">
    Create an Event for Free
</Button>
        </div>
      </section>

      {/* Footer */}
    <footer className="bg-gradient-to-r from-[#4E3C7B] to-[#6950A4] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* 2. Responsiveness is maintained with this grid structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* First Column with updated Logo */}
          <div>
            <Image
              src="/assets/images/logo.png"
              width={128}
              height={38}
              alt="EventHub logo"
              className="mb-4" // Added margin-bottom for spacing
            />
            <p className="text-white/80 text-sm text-pretty">
              Connecting communities through meaningful events. Discover, create, and participate in local experiences
              that bring people together.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  My Events
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Create Event
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Search Event
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
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
    </>
  )
}

interface EventCardProps {
  image: string
  category: string
  title: string
  date: string
  location: string
  attendees: string
  price: string
  organizer?: string
  variant?: "dark" | "light"
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
  variant = "dark",
  id,
}: EventCardProps) {
  const isDark = variant === "dark"

  return (
    <Card className={`overflow-hidden ${isDark ? "bg-white" : "bg-white"} hover:shadow-lg transition-shadow`}>
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        <Badge
          className={`absolute top-3 left-3 ${isDark ? "bg-white text-purple-700" : "bg-purple-100 text-purple-700"}`}
        >
          {category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 text-balance">{title}</h3>

        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{attendees}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>{price}</span>
          </div>
        </div>

        {organizer && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xs font-semibold">{organizer[0]}</span>
            </div>
            <span className="text-sm text-muted-foreground">{organizer}</span>
          </div>
        )}

        <Button asChild className="w-full bg-[#564287] hover:bg-[#483773] text-white">
    <Link href={id ? `/events/${id}` : '/events'}>Learn More</Link>
</Button>
      </CardContent>
    </Card>
  )
}

interface InterestCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
}

function InterestCard({ icon: Icon, title }: InterestCardProps) {
  return (
    <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
  <Icon className="w-8 h-8 mx-auto mb-3 text-black" />
  <h3 className="font-medium text-sm">{title}</h3>
</Card>
  )
}

   


