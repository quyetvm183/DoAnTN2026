// src/app/page.tsx
import Link from 'next/link'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Mentor-Mentee{' '}
            <span className="relative whitespace-nowrap text-indigo-600">
              <span className="relative">Platform</span>
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Connect with experienced mentors or share your knowledge as a mentor. 
            Learn, grow, and succeed together.
          </p>
          
          <div className="mt-10 flex justify-center gap-x-6">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Go to Dashboard
                </Link>
                <p className="text-sm text-gray-600 flex items-center">
                  Welcome back, {session.user.name}!
                </p>
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
                >
                  Sign In <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}