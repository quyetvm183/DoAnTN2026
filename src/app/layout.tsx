// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SessionProvider from "@/components/providers/SessionProvider"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mentor-Mentee Platform",
  description: "Connect mentors and mentees for learning",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-indigo-50 via-white to-purple-50`}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-8rem)]">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}