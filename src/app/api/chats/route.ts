// src/app/api/chats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Lấy danh sách chat từ bookings có messages
        const bookings = await prisma.booking.findMany({
            where: {
                OR: [
                    { menteeId: session.user.id },
                    { mentorId: session.user.id }
                ],
                status: {
                    in: ['ACCEPTED', 'COMPLETED']
                }
            },
            include: {
                mentee: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                },
                mentor: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                },
                messages: {
                    orderBy: {
                        sentAt: 'desc'
                    },
                    take: 1,
                    select: {
                        content: true,
                        sentAt: true,
                        isRead: true
                    }
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                receiverId: session.user.id,
                                isRead: false
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        const chats = bookings
            .filter(booking => booking.messages.length > 0)
            .map(booking => {
                const otherUser = booking.menteeId === session.user.id
                    ? booking.mentor
                    : booking.mentee

                return {
                    bookingId: booking.id,
                    otherUser,
                    lastMessage: booking.messages[0],
                    unreadCount: booking._count.messages
                }
            })

        return NextResponse.json({ chats })
    } catch (error) {
        console.error('Chat list error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

