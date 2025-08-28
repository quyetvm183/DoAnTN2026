// src/app/bookings/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
type PaymentStatus = 'PAID' | 'REFUNDED'

type Booking = {
    id: string
    mentorName: string
    menteeName: string
    subjectName: string
    durationHours: number
    hourlyRate: number
    totalAmount: number
    preferredTime: string
    actualStartTime?: string
    actualEndTime?: string
    learningGoals?: string
    sessionNotes?: string
    status: BookingStatus
    paymentStatus: PaymentStatus
    createdAt: string
    isMentor: boolean
}

// Demo data
const demoBookings: Booking[] = [
    {
        id: '1',
        mentorName: 'Sarah Martinez',
        menteeName: 'John Doe',
        subjectName: 'React Development',
        durationHours: 2,
        hourlyRate: 45,
        totalAmount: 90,
        preferredTime: '2024-01-20T14:00:00Z',
        learningGoals: 'Learn React hooks and state management',
        status: 'ACCEPTED',
        paymentStatus: 'PAID',
        createdAt: '2024-01-18T10:30:00Z',
        isMentor: false
    },
    {
        id: '2',
        mentorName: 'Emily Rodriguez',
        menteeName: 'Alice Smith',
        subjectName: 'UI/UX Design',
        durationHours: 1.5,
        hourlyRate: 60,
        totalAmount: 90,
        preferredTime: '2024-01-22T16:00:00Z',
        actualStartTime: '2024-01-22T16:05:00Z',
        actualEndTime: '2024-01-22T17:35:00Z',
        learningGoals: 'Design system principles and Figma best practices',
        sessionNotes: 'Covered design tokens, component library setup, and prototyping workflow.',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        createdAt: '2024-01-19T15:20:00Z',
        isMentor: true
    },
    {
        id: '3',
        mentorName: 'Michael Johnson',
        menteeName: 'Bob Wilson',
        subjectName: 'Node.js Backend',
        durationHours: 3,
        hourlyRate: 50,
        totalAmount: 150,
        preferredTime: '2024-01-25T10:00:00Z',
        learningGoals: 'Build REST API with authentication and database integration',
        status: 'PENDING',
        paymentStatus: 'PAID',
        createdAt: '2024-01-20T09:15:00Z',
        isMentor: false
    }
]

const statusColors = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    COMPLETED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-gray-50 text-gray-700 border-gray-200'
}

function StatusBadge({ status }: { status: BookingStatus }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    )
}

function BookingCard({ booking }: { booking: Booking }) {
    const [showDetails, setShowDetails] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount * 23000) // Convert USD to VND for display
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white">
                            <span className="text-sm font-semibold">
                                {booking.isMentor ? booking.menteeName.charAt(0) : booking.mentorName.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {booking.isMentor ? `Session với ${booking.menteeName}` : `Session với ${booking.mentorName}`}
                            </h3>
                            <p className="text-sm text-gray-600">{booking.subjectName}</p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Thời gian:</span>
                            <p className="font-medium">{formatDate(booking.preferredTime)}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Thời lượng:</span>
                            <p className="font-medium">{booking.durationHours}h</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Giá:</span>
                            <p className="font-medium">{formatCurrency(booking.hourlyRate)}/giờ</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Tổng:</span>
                            <p className="font-medium text-indigo-600">{formatCurrency(booking.totalAmount)}</p>
                        </div>
                    </div>

                    {booking.learningGoals && (
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Mục tiêu học tập:</span>
                            <p className="text-sm text-gray-700 mt-1">{booking.learningGoals}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={booking.status} />
                    <span className="text-xs text-gray-500">
                        {formatDate(booking.createdAt)}
                    </span>
                </div>
            </div>

            {showDetails && (
                <div className="mt-6 border-t pt-4">
                    {booking.actualStartTime && booking.actualEndTime && (
                        <div className="mb-4">
                            <span className="text-sm font-medium text-gray-700">Thời gian thực tế:</span>
                            <p className="text-sm text-gray-600">
                                {formatDate(booking.actualStartTime)} - {new Date(booking.actualEndTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    )}

                    {booking.sessionNotes && (
                        <div className="mb-4">
                            <span className="text-sm font-medium text-gray-700">Ghi chú buổi học:</span>
                            <p className="text-sm text-gray-600 mt-1">{booking.sessionNotes}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                    {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                </button>

                <div className="flex gap-2">
                    {booking.status === 'PENDING' && (
                        <>
                            {booking.isMentor ? (
                                <>
                                    <button className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700">
                                        Chấp nhận
                                    </button>
                                    <button className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700">
                                        Từ chối
                                    </button>
                                </>
                            ) : (
                                <button className="rounded-lg bg-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700">
                                    Hủy booking
                                </button>
                            )}
                        </>
                    )}

                    {booking.status === 'ACCEPTED' && (
                        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">
                            Tham gia session
                        </button>
                    )}

                    {booking.status === 'COMPLETED' && !booking.sessionNotes && booking.isMentor && (
                        <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                            Thêm ghi chú
                        </button>
                    )}

                    <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Nhắn tin
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function BookingsPage() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all')

    if (!session) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">Vui lòng đăng nhập để xem bookings</p>
            </div>
        )
    }

    const filteredBookings = demoBookings.filter(booking => {
        if (activeTab === 'all') return true
        if (activeTab === 'pending') return booking.status === 'PENDING'
        if (activeTab === 'completed') return booking.status === 'COMPLETED'
        return true
    })

    const tabs = [
        { key: 'all', label: 'Tất cả', count: demoBookings.length },
        { key: 'pending', label: 'Chờ xử lý', count: demoBookings.filter(b => b.status === 'PENDING').length },
        { key: 'completed', label: 'Hoàn thành', count: demoBookings.filter(b => b.status === 'COMPLETED').length }
    ] as const

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
                <p className="text-gray-600">Quản lý các buổi học của bạn</p>
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
                                {tab.label}
                                <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs ${activeTab === tab.key
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))
                ) : (
                    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6m-6 4h6m2-10V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2v-3" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Không có booking nào</h3>
                        <p className="text-gray-500">
                            {activeTab === 'all'
                                ? 'Bạn chưa có booking nào. Hãy tìm mentor và đặt lịch học!'
                                : `Không có booking ${activeTab === 'pending' ? 'chờ xử lý' : 'hoàn thành'} nào.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}