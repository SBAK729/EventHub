import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"
// import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="w-full border-b bg-purple-500">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image 
            src="/assets/images/logo.png" width={285} height={52}
            alt="EventHub logo" 
          />
        </Link>

        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />

          </nav>
          </SignedIn>

        {/* <SignedIn>
          
            <UserButton afterSignOutUrl="/" />
          
        </SignedIn> */}

        <div className="flex w-32 justify-end gap-3">
          <SignedIn> {/* Option 1: keep Clerk’s dropdown menu */}
            <UserButton />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className="bg-purple-500" size="lg">
              <Link href="/sign-in">
                Login
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header