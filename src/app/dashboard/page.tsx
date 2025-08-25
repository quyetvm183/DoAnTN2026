// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/auth/LogoutButton"
import StatsOverview from "@/components/dashboard/StatsOverview"
import MentorSuggestions from "@/components/dashboard/MentorSuggestions"
import ChatWidget from "@/components/dashboard/ChatWidget"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  console.log('Session in dashboard:', session)
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex gap-6">
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <LogoutButton variant="icon" />
          </div>

          <StatsOverview />

          <div className="mt-6">
            <MentorSuggestions />
          </div>
        </div>
      </div>
      <ChatWidget />
    </div>
  )
}