// src/app/test-auth/page.tsx
"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function TestAuth() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>

  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.email}</p>
        <p>Role: {session.user?.role}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}