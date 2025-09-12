import Image from "next/image"
import { formatDateTime } from "@/lib/utils"
import CheckoutButton from "./CheckoutButton"
import ShareBar from "./ShareBar"
import { Calendar, MapPin, Clock, User, ExternalLink } from "lucide-react"

type EventDetailProps = {
  event: {
    _id: string
    title: string
    description: string
    imageUrl: string
    startDateTime: string | Date
    endDateTime: string | Date
    location: string
    isFree: boolean
    price: string
    url?: string
    category: { _id: string; name: string }
    organizer: { _id: string; firstName: string; lastName: string }
  }
}

export default function EventDetail({ event }: EventDetailProps) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-[#0b0b12]">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden rounded-b-3xl">
          <Image
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-purple-900/40 to-transparent" />

          {/* Floating badges */}
          <div className="absolute top-6 left-6 flex gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${
                event.isFree ? "bg-emerald-500/90 text-white" : "bg-purple-600/90 text-white shadow-md"
              }`}
            >
              {event.isFree ? "FREE EVENT" : `$${event.price}`}
            </span>
            <span className="px-4 py-2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md text-white text-sm font-medium border border-white/30">
              {event.category?.name}
            </span>
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance leading-tight">{event.title}</h1>
              <div className="flex items-center gap-2 text-lg opacity-90">
                <User className="w-5 h-5" />
                <span>Hosted by</span>
                <span className="font-semibold text-accent">
                  {event.organizer?.firstName} {event.organizer?.lastName}
                </span>
              </div>
              <div className="mt-4">
                <ShareBar title={event.title} url={typeof window !== 'undefined' ? window.location.href : ''} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time Card */}
              <div className="bg-white/90 dark:bg-[#11121a]/90 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40">
                    <Calendar className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Date & Time</h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {formatDateTime(event.startDateTime as Date).dateOnly}
                      </p>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                        <span>{formatDateTime(event.startDateTime as Date).timeOnly}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Ends {formatDateTime(event.endDateTime as Date).dateOnly} •{" "}
                        {formatDateTime(event.endDateTime as Date).timeOnly}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white/90 dark:bg-[#11121a]/90 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-fuchsia-100 to-rose-100 dark:from-fuchsia-900/40 dark:to-rose-900/40">
                    <MapPin className="w-6 h-6 text-fuchsia-700 dark:text-fuchsia-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white/90 dark:bg-[#11121a]/90 border border-purple-200 dark:border-purple-800 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About This Event</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{event.description}</p>
              </div>

              {event.url && (
                <div className="mt-6 pt-6 border-t border-purple-200 dark:border-purple-800">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-purple-700 dark:text-purple-300 hover:opacity-90 font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Event Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Checkout Card */}
              <div className="bg-white/90 dark:bg-[#11121a]/90 border border-purple-300 dark:border-purple-800 rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                    {event.isFree ? "Free" : `$${event.price}`}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">per ticket</p>
                </div>

                <CheckoutButton event={event as any} />
              </div>

              {/* Organizer Card */}
              <div className="bg-white/90 dark:bg-[#11121a]/90 border border-purple-200 dark:border-purple-800 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Event Organizer</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40">
                    <User className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-200">
                      {event.organizer?.firstName} {event.organizer?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Event Host</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
