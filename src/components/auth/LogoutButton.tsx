// src/components/auth/LogoutButton.tsx
'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface LogoutButtonProps {
  className?: string
  variant?: 'button' | 'link' | 'icon'
  showConfirm?: boolean
}

export default function LogoutButton({ 
  className = '', 
  variant = 'button',
  showConfirm = true 
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (showConfirm && !confirm('Are you sure you want to sign out?')) {
      return
    }

    setLoading(true)
    
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      console.error('Logout error:', error)
      setLoading(false)
    }
  }
  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`p-2 text-gray-600 hover:text-indigo-600 disabled:opacity-50 ${className}`}
        title="Sign Out"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 ${className}`}
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}