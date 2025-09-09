// /components/shared/BottomNavBar.tsx

"use client" // This component needs to be a client component to use hooks

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarDays, Plus, Search, User } from 'lucide-react';

const BottomNavBar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/events', label: 'My Events', icon: CalendarDays },
    { href: '/events/create', label: 'Create', icon: Plus },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    // This nav is fixed to the bottom and only appears on screens smaller than md
    <nav className="fixed bottom-0 w-full bg-white border-t z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          // Special styling for the "Create" button
          if (link.label === 'Create') {
            return (
              <Link href={link.href} key={link.label} className="flex flex-col items-center justify-center -mt-4">
                <div className="flex items-center justify-center bg-[#4E3C7B] rounded-full p-3 text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`mt-1 text-xs font-medium ${isActive ? 'text-[#4E3C7B]' : 'text-gray-600'}`}>
                  {link.label}
                </span>
              </Link>
            );
          }

          // Regular styling for other links
          return (
            <Link href={link.href} key={link.label} className="flex flex-col items-center gap-1 text-xs font-medium">
              <Icon className={`h-6 w-6 ${isActive ? 'text-[#6a5acd]' : 'text-gray-600'}`} />
              <span className={isActive ? 'text-[#6a5acd]' : 'text-gray-600'}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;