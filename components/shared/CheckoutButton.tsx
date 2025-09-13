"use client"

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { useState } from 'react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'

const CheckoutButton = ({ event, variant = 'default' }: { event: IEvent; variant?: 'default' | 'card' }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const userId = user?.id as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  const [isLoading, setIsLoading] = useState(false);


  const isCardVariant = variant === 'card';
  
  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className={isCardVariant ? "" : "flex items-center gap-3"}>
        <Button
          disabled
          size={isCardVariant ? "sm" : "lg"}
          className={isCardVariant 
            ? "bg-gray-400 text-white text-sm px-3 py-1.5 rounded-md" 
            : "rounded-full bg-gray-400 text-white"
          }
        >
          Loading...
        </Button>
      </div>
    );
  }
  
  return (
    <div className={isCardVariant ? "" : "flex items-center gap-3"}>
      {hasEventFinished ? (
        <p className={isCardVariant ? "text-red-400 text-sm" : "p-2 text-red-400"}>Sorry, tickets are no longer available.</p>
      ) : (
        <>
          {/* Show purple button for signed out users */}
          <SignedOut>
            <Button
              asChild
              size={isCardVariant ? "sm" : "lg"}
              className={isCardVariant 
                ? "bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1.5 rounded-md" 
                : "rounded-full bg-purple-600 hover:bg-purple-700 text-white"
              }
            >
              <Link href="/sign-in">
                {event.isFree ? 'RSVP' : 'Get Tickets'}
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
