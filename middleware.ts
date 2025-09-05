// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

// Apply Clerk middleware to all matched routes
export default clerkMiddleware();

// Define which routes the middleware should run on
export const config = {
  matcher: [
    // Protect everything except these public routes
    // Root page
    "/",
    // Event pages
    "/events/:id",
    // API webhooks (Clerk & Stripe) and UploadThing
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadthing",
    // Protect all other routes except Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};
