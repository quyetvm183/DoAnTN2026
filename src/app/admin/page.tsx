// src/app/admin/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

type AdminStats = {
  totalUsers: number
  totalMentors: number
  totalMentees: number
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  pendingApprovals: number
  completedSessions: number
}

type User = {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
  totalSessions?: number
  rating?: number
  isApproved?: boolean
}

type Booking = {
  id: string
  mentorName: string
  menteeName: string
  subject: string
  status: string
  amount: number
  createdAt: string
}

// Demo data
const adminStats: AdminStats = {
  totalUsers: 1247,
  totalMentors: 156,
  totalMentees: 1091,
  totalBookings: 2834,
  totalRevenue: 127450,
  activeUsers: 342,
  pendingApprovals: 12,
  completedSessions: 1892
}

const demoUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    email: 'sarah@example.com',
    role: 'MENTOR',
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:30:00Z',
    totalSessions: 45,
    rating: 4.8,
    isApproved: true
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'MENTEE',
    status: 'ACTIVE',
    createdAt: '2024-01-20T14:15:00Z',
    totalSessions: 12
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    role: 'MENTOR',
    status: 'PENDING',
    createdAt: '2024-01-22T09:45:00Z',
    isApproved: false
  }
]

const demoBookings: Booking[] = [
  {
    id: '1',
    mentorName: 'Sarah Martinez',
    menteeName: 'John Doe',
    subject: 'React Development',
    status: 'COMPLETED',
    amount: 90,
    createdAt: '2024-01-20T14:00:00Z'
  },
  {
    id: '2',
    mentorName: 'Emily Rodriguez',
    menteeName: 'Alice Smith',
    subject: 'UI/UX Design',
    status: 'PENDING',
    amount: 120,
    createdAt: '2024-01-22T10:30:00Z'
  }
]

function StatCard({ title, value, change, icon, color }: {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} từ tháng trước
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function UsersTable({ users, onAction }: {
  users: User[]
  onAction: (userId: string, action: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Quản lý người dùng</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white">
                      <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'MENTOR' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'MENTEE' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {user.status}
                  </span>
                  {user.role === 'MENTOR' && user.isApproved === false && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Chưa duyệt
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.totalSessions && (
                    <div>
                      <div>{user.totalSessions} sessions</div>
                      {user.rating && <div>⭐ {user.rating}</div>}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {user.role === 'MENTOR' && user.isApproved === false && (
                      <button
                        onClick={() => onAction(user.id, 'approve')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Duyệt
                      </button>
                    )}
                    <button
                      onClick={() => onAction(user.id, 'view')}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => onAction(user.id, user.status === 'ACTIVE' ? 'suspend' : 'activate')}
                      className={user.status === 'ACTIVE' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                    >
                      {user.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BookingsTable({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Bookings gần đây</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mentor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mentee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Môn học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.mentorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.menteeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ${booking.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'analytics'>('overview')

  // Check admin role
  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Truy cập bị từ chối</h2>
          <p className="text-gray-600">Bạn cần quyền Admin để truy cập trang này</p>
        </div>
      </div>
    )
  }

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action ${action} for user ${userId}`)
    // Implement user actions here
  }

  const tabs = [
    { key: 'overview', label: 'Tổng quan', icon: '📊' },
    { key: 'users', label: 'Người dùng', icon: '👥' },
    { key: 'bookings', label: 'Bookings', icon: '📅' },
    { key: 'analytics', label: 'Phân tích', icon: '📈' }
  ] as const

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Quản lý hệ thống mentor-mentee platform</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 border-b-2 py-2 text-sm font-medium ${activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Tổng người dùng"
              value={adminStats.totalUsers.toLocaleString()}
              change="+12%"
              icon={
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
              color="bg-blue-500"
            />
            <StatCard
              title="Mentors"
              value={adminStats.totalMentors}
              change="+8%"
              icon={
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              color="bg-green-500"
            />
            <StatCard
              title="Tổng doanh thu"
              value={`$${adminStats.totalRevenue.toLocaleString()}`}
              change="+23%"
              icon={
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
              color="bg-yellow-500"
            />
            <StatCard
              title="Chờ duyệt"
              value={adminStats.pendingApprovals}
              icon={
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-red-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UsersTable users={demoUsers.slice(0, 3)} onAction={handleUserAction} />
            <BookingsTable bookings={demoBookings} />
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quản lý người dùng</h2>
              <p className="text-gray-600">Duyệt mentors và quản lý tài khoản người dùng</p>
            </div>
            <div className="flex gap-3">
              <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                <option>Tất cả vai trò</option>
                <option>Mentors</option>
                <option>Mentees</option>
              </select>
              <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                <option>Tất cả trạng thái</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>
          <UsersTable users={demoUsers} onAction={handleUserAction} />
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quản lý Bookings</h2>
              <p className="text-gray-600">Theo dõi và quản lý các phiên học</p>
            </div>
            <div className="flex gap-3">
              <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                <option>Tất cả trạng thái</option>
                <option>Pending</option>
                <option>Accepted</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <input
                type="date"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
          <BookingsTable bookings={demoBookings} />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Phân tích & Báo cáo</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tháng</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                [Biểu đồ doanh thu sẽ được tích hợp]
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Người dùng hoạt động</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                [Biểu đồ người dùng hoạt động sẽ được tích hợp]
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}