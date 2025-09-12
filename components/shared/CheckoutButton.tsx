"use client"

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { useState } from 'react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'

const CheckoutButton = ({ event }: { event: IEvent }) => {
  const { user } = useUser();
  const userId = user?.id as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>
      ) : (
        <>
          {/* Show purple button for signed out users */}
          <SignedOut>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="/sign-in">
                Get Tickets
              </Link>
            </Button>
          </SignedOut>

          {/* Show checkout for signed in users */}
          <SignedIn>
            <div className="relative">
              <Checkout event={event} userId={userId} />
            </div>
          </SignedIn>
        </>
      )}
    </div>
  )
}

export default CheckoutButton
