// src/app/mentor/dashboard/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

type MentorStats = {
    totalEarnings: number
    totalHours: number
    totalStudents: number
    avgRating: number
    pendingBookings: number
    completedSessions: number
    thisWeekEarnings: number
    thisWeekHours: number
}

type StudentRequest = {
    id: string
    studentName: string
    subject: string
    preferredTime: string
    duration: number
    hourlyRate: number
    message: string
    createdAt: string
}

type UpcomingSession = {
    id: string
    studentName: string
    subject: string
    scheduledTime: string
    duration: number
    meetingLink?: string
    status: 'upcoming' | 'in-progress' | 'completed'
}

type RecentReview = {
    id: string
    studentName: string
    rating: number
    comment: string
    subject: string
    date: string
}

// Demo data
const mentorStats: MentorStats = {
    totalEarnings: 4250,
    totalHours: 127,
    totalStudents: 34,
    avgRating: 4.8,
    pendingBookings: 3,
    completedSessions: 89,
    thisWeekEarnings: 340,
    thisWeekHours: 12
}

const studentRequests: StudentRequest[] = [
    {
        id: '1',
        studentName: 'Alice Johnson',
        subject: 'React Development',
        preferredTime: '2024-01-25T14:00:00Z',
        duration: 2,
        hourlyRate: 45,
        message: 'Hi! I need help understanding React hooks and state management. I have some specific questions about useEffect.',
        createdAt: '2024-01-23T10:30:00Z'
    },
    {
        id: '2',
        studentName: 'Bob Smith',
        subject: 'Node.js Backend',
        preferredTime: '2024-01-26T16:00:00Z',
        duration: 1.5,
        hourlyRate: 45,
        message: 'Looking to build REST APIs with authentication. Complete beginner to backend development.',
        createdAt: '2024-01-23T15:20:00Z'
    }
]

const upcomingSessions: UpcomingSession[] = [
    {
        id: '1',
        studentName: 'Carol Davis',
        subject: 'JavaScript Fundamentals',
        scheduledTime: '2024-01-24T10:00:00Z',
        duration: 1,
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        status: 'upcoming'
    },
    {
        id: '2',
        studentName: 'David Wilson',
        subject: 'React Advanced',
        scheduledTime: '2024-01-24T15:30:00Z',
        duration: 2,
        meetingLink: 'https://zoom.us/j/123456789',
        status: 'upcoming'
    }
]

const recentReviews: RecentReview[] = [
    {
        id: '1',
        studentName: 'Emma Brown',
        rating: 5,
        comment: 'Excellent mentor! Very patient and explained everything clearly. Helped me understand Redux concepts.',
        subject: 'Redux State Management',
        date: '2024-01-22T14:30:00Z'
    },
    {
        id: '2',
        studentName: 'Frank Miller',
        rating: 4,
        comment: 'Good session on API development. Would like more examples next time.',
        subject: 'REST API Development',
        date: '2024-01-21T11:15:00Z'
    }
]

function StatCard({ title, value, subtitle, icon, color }: {
    title: string
    value: string | number
    subtitle?: string
    icon: React.ReactNode
    color: string
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

function StudentRequestCard({ request, onAction }: {
    request: StudentRequest
    onAction: (requestId: string, action: 'accept' | 'decline') => void
}) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white">
                            <span className="text-sm font-medium">{request.studentName.charAt(0)}</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">{request.studentName}</h4>
                            <p className="text-sm text-gray-600">{request.subject}</p>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Thời gian:</span>
                            <p className="font-medium">{formatDate(request.preferredTime)}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Thời lượng:</span>
                            <p className="font-medium">{request.duration}h</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Tổng tiền:</span>
                            <p className="font-medium text-green-600">${request.duration * request.hourlyRate}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Yêu cầu lúc:</span>
                            <p className="font-medium">{formatDate(request.createdAt)}</p>
                        </div>
                    </div>

                    <div className="mt-3">
                        <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => onAction(request.id, 'accept')}
                    className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                    Chấp nhận
                </button>
                <button
                    onClick={() => onAction(request.id, 'decline')}
                    className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Từ chối
                </button>
            </div>
        </div>
    )
}

function UpcomingSessionCard({ session }: { session: UpcomingSession }) {
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const isToday = new Date(session.scheduledTime).toDateString() === new Date().toDateString()
    const timeLeft = Math.ceil((new Date(session.scheduledTime).getTime() - new Date().getTime()) / (1000 * 60))

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                        <span className="text-sm font-medium">{session.studentName.charAt(0)}</span>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">{session.studentName}</h4>
                        <p className="text-sm text-gray-600">{session.subject}</p>
                    </div>
                </div>
                {isToday && timeLeft > 0 && timeLeft <= 30 && (
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                        {timeLeft}p nữa
                    </span>
                )}
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
                <div>
                    <span className="text-gray-500">Thời gian: </span>
                    <span className="font-medium">{formatTime(session.scheduledTime)}</span>
                </div>
                <div>
                    <span className="text-gray-500">Thời lượng: </span>
                    <span className="font-medium">{session.duration}h</span>
                </div>
            </div>
            <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    Nhắn tin
                </button>
            </div>
        </div>
    )
}

function ReviewCard({ review }: { review: RecentReview }) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                    <span className="text-sm font-medium">{review.studentName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{review.studentName}</h4>
                        <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{review.subject}</p>
                    <p className="text-sm text-gray-700 mt-2 italic">"{review.comment}"</p>
                </div>
            </div>
        </div>
    )
}

export default function MentorDashboard() {
    const { data: session } = useSession()

    // Check mentor role
    if (!session || (session.user.role !== 'MENTOR' && session.user.role !== 'BOTH' && session.user.role !== 'ADMIN')) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                        <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Truy cập bị từ chối</h2>
                    <p className="text-gray-600">Bạn cần là Mentor để truy cập trang này</p>
                </div>
            </div>
        )
    }

    const handleRequestAction = (requestId: string, action: 'accept' | 'decline') => {
        console.log(`${action} request ${requestId}`)
        // Implement request handling logic
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Mentor Dashboard</h1>
                <p className="text-gray-600">Quản lý phiên dạy và tương tác với học viên</p>
            </div>

            {/* Stats Overview */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Tổng thu nhập"
                    value={`${mentorStats.totalEarnings.toLocaleString()}`}
                    subtitle={`+${mentorStats.thisWeekEarnings} tuần này`}
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    }
                    color="bg-green-500"
                />
                <StatCard
                    title="Tổng giờ dạy"
                    value={`${mentorStats.totalHours}h`}
                    subtitle={`+${mentorStats.thisWeekHours}h tuần này`}
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    color="bg-blue-500"
                />
                <StatCard
                    title="Học viên"
                    value={mentorStats.totalStudents}
                    subtitle="Đã dạy"
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                    color="bg-indigo-500"
                />
                <StatCard
                    title="Đánh giá TB"
                    value={`${mentorStats.avgRating}/5`}
                    subtitle={`${mentorStats.completedSessions} sessions`}
                    icon={
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    }
                    color="bg-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Student Requests */}
                <div className="lg:col-span-1">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Yêu cầu học ({studentRequests.length})</h2>
                        {mentorStats.pendingBookings > 0 && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                {mentorStats.pendingBookings} mới
                            </span>
                        )}
                    </div>
                    <div className="space-y-4">
                        {studentRequests.map((request) => (
                            <StudentRequestCard
                                key={request.id}
                                request={request}
                                onAction={handleRequestAction}
                            />
                        ))}
                    </div>
                </div>

                {/* Upcoming Sessions & Reviews */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Upcoming Sessions */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Phiên sắp tới</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {upcomingSessions.map((session) => (
                                <UpcomingSessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    </div>

                    {/* Recent Reviews */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá gần đây</h2>
                        <div className="space-y-4">
                            {recentReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Tạo lịch trống
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Cập nhật hồ sơ
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Xem thống kê
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Hỗ trợ
                    </button>
                </div>
            </div>
        </div>
    )
}