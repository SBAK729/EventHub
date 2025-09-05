// /app/page.tsx

import { Button } from '@/components/ui/button'
import Link from 'next/link'
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
          <input
            type="text"
            placeholder="Search for yoga, workshops, art..."
            className="px-4 py-2 rounded-l-md w-96 text-black"
          />
         <Button size="lg" asChild className="bg-purple-600 px-6 py-2 rounded-r-md text-white">
              <Link href="#events">
                Search
              </Link>
            </Button>
        </div>
      </div>
    </section>

      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-2xl font-bold mb-8">Connect in Three Easy Steps</h2>
        <div className="flex justify-center gap-12">
          <div className="w-60 space-y-3">
            <div className="text-4xl text-purple-600">🔍</div>
            <h3 className="font-semibold">Find an Event</h3>
            <p className="text-sm text-gray-600">
              Use our smart search to find events that match your interests.
            </p>
          </div>
          <div className="w-60 space-y-3">
            <div className="text-4xl text-purple-600">✅</div>
            <h3 className="font-semibold">RSVP in a Tap</h3>
            <p className="text-sm text-gray-600">
              Confirm your spot and add events to your calendar.
            </p>
          </div>
          <div className="w-60 space-y-3">
            <div className="text-4xl text-purple-600">➕</div>
            <h3 className="font-semibold">Create Your Own</h3>
            <p className="text-sm text-gray-600">
              Organizers can Post and Manage events for free.
            </p>
          </div>
        </div>
      </section>
    </>
    
  );
}
