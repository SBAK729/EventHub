import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"
import { checkUser } from "@/lib/checkUser"
import ThemeToggle from "./ThemeToggle"

const Header = async () => {
  const user = await checkUser();

  return (
    <header className="w-full border-b bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-900 dark:to-pink-800">
      <div className="wrapper flex items-center justify-between">
        {/* Logo - stays left */}
        <Link href="/" className="w-36">
          <Image
            src="/assets/images/logo.png"
            width={128}
            height={38}
            alt="EventHub logo"
          />
        </Link>

        {/* Center Nav Items (Desktop only) */}
        <SignedIn>
          <nav className="hidden md:flex flex-1 justify-center">
            <NavItems />
          </nav>
        </SignedIn>

        {/* Right Side Actions */}
        <div className="flex shrink-0 justify-end gap-3 items-center">
          {/* Dark/Light Toggle */}
          <ThemeToggle />

          {/* User Menu when logged in */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  rootBox: "flex items-center",
                  userButtonAvatarBox:
                    "ring-2 ring-white/70 dark:ring-purple-300 rounded-full",
                  userButtonPopoverCard:
                    "rounded-2xl shadow-xl border border-purple-200/30 dark:border-purple-700/40 " +
                    "bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-900 dark:to-pink-800 text-white",
                  userButtonPopoverHeader:
                    "px-4 py-3 border-b border-white/20 dark:border-white/10",
                  userPreviewMainIdentifier:
                    "text-white font-semibold",
                  userPreviewSecondaryIdentifier:
                    "text-pink-100 dark:text-pink-200 text-sm",
                  userButtonPopoverActions:
                    "divide-y divide-white/20 dark:divide-white/10",
                  userButtonPopoverActionButton:
                    "flex items-center gap-2 px-4 py-2 text-left hover:bg-white/10 transition-colors text-white",
                  userButtonPopoverActionButtonIcon:
                    "text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-300",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />

            {/* Mobile Menu */}
            <MobileNav />
          </SignedIn>

          {/* Login button when logged out */}
          <SignedOut>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md"
              size="lg"
            >
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
