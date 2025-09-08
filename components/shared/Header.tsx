import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
// Add an icon import for the theme toggle shown in the screenshot
import { Sun } from "lucide-react"; 

const Header = () => {
  return (
    // 1. Set the background color for the entire header
    <header className="w-full bg-[#6a5acd]">
      {/* 2. Replace 'wrapper' with full-width flex container and padding */}
      <div className="flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO (remains on the left) */}
        <Link href="/" className="w-36">
          <Image 
            src="/assets/images/logo.png" width={128} height={38}
            alt="EventHub logo" 
          />
        </Link>

        {/* This <SignedIn> block for NavItems is not in the screenshot,
            but keeping it as requested. It's hidden on small screens. */}
        <SignedIn>
          <nav className="hidden md:flex md:justify-between w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

        {/* RIGHT-SIDE ACTIONS CONTAINER */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <div className="md:hidden"> {/* MobileNav only for small screens */}
              <MobileNav />
            </div>
          </SignedIn>

          <SignedOut>
            {/* Desktop buttons (visible on screens medium and up) */}
            <div className="hidden items-center gap-4 md:flex">
                <button aria-label="Toggle theme" className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Sun className="h-6 w-6" />
                </button>
                <Button asChild className="rounded-md border border-white/50 bg-white/10 text-white hover:bg-white/20" size="sm">
                  <Link href="/sign-in">
                    Log in
                  </Link>
                </Button>
                <Button asChild className="rounded-md bg-[#483d8b] text-white hover:bg-[#3e3475]" size="sm">
                  <Link href="/sign-up">
                    Sign up
                  </Link>
                </Button>
            </div>
            
            {/* Mobile Nav (visible on small screens) */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header;