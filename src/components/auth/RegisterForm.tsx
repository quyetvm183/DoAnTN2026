// src/components/auth/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TextField from '@/components/atoms/TextField'
import PasswordField from '@/components/atoms/PasswordField'
import RoleSegmentedControl from '@/components/atoms/RoleSegmentedControl'
import Alert from '@/components/atoms/Alert'
import PrimaryButton from '@/components/atoms/PrimaryButton'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'MENTEE',
    phone: '',
    schoolName: '',
    studentId: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone || null,
          schoolName: formData.schoolName || null,
          studentId: formData.studentId || null
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Registration successful, redirect to login
        router.push('/auth/login?message=Registration successful! Please sign in.')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/20 to-fuchsia-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-400/20 to-emerald-400/20 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
              <path d="M12 14c3.866 0 7-3.134 7-7S15.866 0 12 0 5 3.134 5 7s3.134 7 7 7Zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z" />
            </svg>
          </div>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-sm sm:p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">Join the mentor platform and start your journey.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <Alert message={error} variant="error" />}

            <div className="space-y-5">
              <TextField
                id="name"
                name="name"
                label="Full name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                icon={(
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75c-2.67 0-5.216-.584-7.5-1.632Z" />
                  </svg>
                )}
              />

              <TextField
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                icon={(
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5l-9.75 6.75L2.25 7.5m19.5 0v9A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0L12 14.25 2.25 7.5" />
                  </svg>
                )}
              />

              <RoleSegmentedControl
                value={formData.role}
                onChange={(val) => setFormData({ ...formData, role: val })}
              />

              <TextField
                id="phone"
                name="phone"
                type="tel"
                label="Phone (optional)"
                placeholder="(+84) 0123 456 789"
                value={formData.phone}
                onChange={handleChange}
                icon={(
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H4.5a.375.375 0 0 0-.375.375v2.25c0 3.106 2.519 5.625 5.625 5.625h2.25a.375.375 0 0 0 .375-.375v-1.5c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H15c-6.213 0-11.25-5.037-11.25-11.25v-1.5Z" />
                  </svg>
                )}
              />

              <TextField
                id="schoolName"
                name="schoolName"
                label="School name (optional)"
                placeholder="Your school"
                value={formData.schoolName}
                onChange={handleChange}
                icon={(
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8.66 5-3.16 1.824V14L12 17l-5.5-3v-4.176L3.34 8 12 3Z" />
                  </svg>
                )}
              />

              <TextField
                id="studentId"
                name="studentId"
                label="Student ID (optional)"
                placeholder="e.g. 20201234"
                value={formData.studentId}
                onChange={handleChange}
                icon={(
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25A2.25 2.25 0 0 1 6 3h12a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V5.25ZM7.5 8.25h9m-9 3h9m-9 3h6" />
                  </svg>
                )}
              />

              <PasswordField
                id="password"
                name="password"
                label="Password"
                required
                value={formData.password}
                onChange={handleChange}
                showStrength
              />

              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <PrimaryButton type="submit" disabled={loading} loading={loading}>
                Create account
              </PrimaryButton>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}