import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const poppins = Poppins({
weight:['400','500','600','700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});



export const metadata: Metadata = {
  title: "EventHub",
  description: "EventHub is a platform for event management and ticketing.",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{
      elements: {
        card: 'bg-white dark:bg-[#11121a] shadow-xl border border-purple-200 dark:border-purple-700 rounded-xl',
        formFieldInput: 'bg-white dark:bg-[#0f1018] dark:text-white',
        formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
        headerTitle: 'text-gray-900 dark:text-white',
        headerSubtitle: 'text-gray-600 dark:text-gray-300'
      }
    }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} bg-white text-foreground dark:bg-[#0b0b12]`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}