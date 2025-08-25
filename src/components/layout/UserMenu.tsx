// src/components/layout/UserMenu.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!session) return null

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {session.user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
          <p className="text-xs text-gray-500">{session.user.role}</p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
            <p className="text-xs text-gray-500">{session.user.email}</p>
          </div>
          
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            View Profile
          </Link>
          
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          
          {(session.user.role === 'MENTOR' || session.user.role === 'BOTH') && (
            <Link
              href="/mentor/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Mentor Dashboard
            </Link>
          )}
          
          {session.user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          
          <hr className="my-1" />
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}