// src/components/layout/Navbar.tsx
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import UserMenu from './UserMenu'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MentorPlatform</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
                
                {(session.user.role === 'MENTEE' || session.user.role === 'BOTH') && (
                  <Link
                    href="/find-mentors"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Find Mentors
                  </Link>
                )}
                
                <Link
                  href="/bookings"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  My Bookings
                </Link>
                
                <UserMenu />
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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