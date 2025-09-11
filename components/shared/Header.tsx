import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"
import { checkUser } from "@/lib/checkUser"
import ThemeToggle from "./ThemeToggle"

// import MobileNav from "./MobileNav"

const Header = async() => {
  const user = await checkUser();
  return (
    <header className="w-full border-b bg-purple-500 dark:bg-purple-900">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image 
            src="/assets/images/logo.png" width={128} height={38}
            alt="EventHub logo" 
          />
        </Link>

        <SignedIn>
          <nav className="hidden md:flex md:justify-between w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

        <div className="flex w-32 justify-end gap-3 items-center">
          <ThemeToggle />
          <SignedIn>
            <UserButton />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className="bg-purple-600 hover:bg-purple-700" size="lg">
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