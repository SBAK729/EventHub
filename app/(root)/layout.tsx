import Footer from "@/components/shared/Footer"
import Header from "@/components/shared/Header"
import Chatbot from "@/components/shared/Chatbot"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
    </div>
    </>
  )
}