// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import LogoutButton from "@/components/auth/LogoutButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to Dashboard
              </h1>
              {/* Different logout button styles */}
              <div className="flex gap-4">
                <LogoutButton variant="icon" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {session.user.name}</p>
                <p><span className="font-medium">Email:</span> {session.user.email}</p>
                <p><span className="font-medium">Role:</span> {session.user.role}</p>
                <p><span className="font-medium">User ID:</span> {session.user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}