'use client';

import { headerLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useUser } from '@clerk/nextjs'

const NavItems = () => {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const clerkId = user?.id;
  const allowAdmin = (
    (process.env.NEXT_PUBLIC_ADMIN_EMAIL && email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) ||
    (process.env.NEXT_PUBLIC_ADMIN_USER_ID && clerkId === process.env.NEXT_PUBLIC_ADMIN_USER_ID)
  );

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks
        .filter((link) => link.route !== '/admin' || (isSignedIn && allowAdmin))
        .map((link) => {
          const isActive = pathname === link.route;
          
          return (
            <li
              key={link.route}
              className={`${
                isActive ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
              } flex-center p-medium-16 whitespace-nowrap transition-colors`}
            >
              <Link href={link.route} className="hover:underline">{link.label}</Link>
            </li>
          )
        })}
    </ul>
  )
}

export default NavItems