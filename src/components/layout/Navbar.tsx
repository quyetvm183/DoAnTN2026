// src/components/layout/Navbar.tsx
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import UserMenu from './UserMenu'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <span className="text-base font-bold">M</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">MentorPlatform</span>
            </Link>
            <div className="hidden md:block">
              <div className="relative">
                <input
                  placeholder="Tìm mentor, kỹ năng..."
                  className="w-72 rounded-lg border border-gray-200 bg-white/60 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
                >
                  Dashboard
                </Link>

                {(session.user.role === 'MENTEE' || session.user.role === 'BOTH') && (
                  <Link
                    href="/find-mentors"
                    className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
                  >
                    Find Mentors
                  </Link>
                )}

                <Link
                  href="/bookings"
                  className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
                >
                  My Bookings
                </Link>

                <UserMenu />
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}