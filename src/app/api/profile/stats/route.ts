// src/app/api/profile/stats/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/profile/stats - Get profile statistics
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const userId = session.user.id

        // Get basic stats
        const [
            completedBookingsCount,
            totalEarnings,
            totalReviews,
            avgRating,
            totalSessions
        ] = await Promise.all([
            // Completed bookings as mentor
            prisma.booking.count({
                where: {
                    mentorId: userId,
                    status: "COMPLETED"
                }
            }),

            // Total earnings
            prisma.walletTransaction.aggregate({
                where: {
                    userId: userId,
                    type: "EARNINGS"
                },
                _sum: {
                    amount: true
                }
            }),

            // Total reviews received
            prisma.review.count({
                where: {
                    booking: {
                        mentorId: userId
                    }
                }
            }),

            // Average rating
            prisma.review.aggregate({
                where: {
                    booking: {
                        mentorId: userId
                    }
                },
                _avg: {
                    rating: true
                }
            }),

            // Total teaching hours (sum of completed booking durations)
            prisma.booking.aggregate({
                where: {
                    mentorId: userId,
                    status: "COMPLETED"
                },
                _sum: {
                    durationHours: true
                }
            })
        ])

        // Get monthly booking stats for the last 6 months
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const monthlyBookings = await prisma.booking.groupBy({
            by: ['createdAt'],
            where: {
                mentorId: userId,
                status: "COMPLETED",
                createdAt: {
                    gte: sixMonthsAgo
                }
            },
            _count: {
                id: true
            },
            _sum: {
                durationHours: true,
                mentorEarnings: true
            }
        })

        // Format monthly data
        const monthlyStats = monthlyBookings.reduce((acc, booking) => {
            const month = booking.createdAt.toISOString().substring(0, 7) // YYYY-MM format
            if (!acc[month]) {
                acc[month] = {
                    bookings: 0,
                    hours: 0,
                    earnings: 0
                }
            }
            acc[month].bookings += booking._count.id
            acc[month].hours += booking._sum.durationHours || 0
            acc[month].earnings += booking._sum.mentorEarnings || 0
            return acc
        }, {} as Record<string, { bookings: number; hours: number; earnings: number }>)

        // Get subject performance
        const subjectStats = await prisma.booking.groupBy({
            by: ['subjectId'],
            where: {
                mentorId: userId,
                status: "COMPLETED"
            },
            _count: {
                id: true
            },
            _sum: {
                durationHours: true,
                mentorEarnings: true
            }
        })

        // Get subject names
        const subjectIds = subjectStats.map(stat => stat.subjectId)
        const subjects = await prisma.subject.findMany({
            where: {
                id: {
                    in: subjectIds
                }
            },
            select: {
                id: true,
                name: true
            }
        })

        const subjectPerformance = subjectStats.map(stat => {
            const subject = subjects.find(s => s.id === stat.subjectId)
            return {
                subjectId: stat.subjectId,
                subjectName: subject?.name || 'Unknown',
                bookings: stat._count.id,
                hours: stat._sum.durationHours || 0,
                earnings: stat._sum.mentorEarnings || 0
            }
        })

        const stats = {
            overview: {
                completedBookings: completedBookingsCount,
                totalEarnings: totalEarnings._sum.amount || 0,
                totalReviews: totalReviews,
                avgRating: avgRating._avg.rating || 0,
                totalHours: totalSessions._sum.durationHours || 0
            },
            monthly: monthlyStats,
            subjects: subjectPerformance
        }

        return NextResponse.json({ data: stats })
    } catch (error) {
        console.error("Error fetching profile stats:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}