// src/app/api/bookings/[bookingId]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { bookingId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { bookingId } = params

        // Kiểm tra quyền truy cập booking
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                OR: [
                    { menteeId: session.user.id },
                    { mentorId: session.user.id }
                ]
            }
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Lấy messages
        const messages = await prisma.message.findMany({
            where: {
                bookingId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: {
                sentAt: 'asc'
            }
        })

        // Mark messages as read
        await prisma.message.updateMany({
            where: {
                bookingId,
                receiverId: session.user.id,
                isRead: false
            },
            data: {
                isRead: true
            }
        })

        return NextResponse.json({ messages })
    } catch (error) {
        console.error('Messages fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { bookingId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { bookingId } = params
        const { content, receiverId } = await request.json()

        if (!content?.trim()) {
            return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
        }

        // Kiểm tra quyền truy cập booking
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                OR: [
                    { menteeId: session.user.id },
                    { mentorId: session.user.id }
                ]
            }
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Tạo message mới
        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                senderId: session.user.id,
                receiverId,
                bookingId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            }
        })

        // Cập nhật booking updated time
        await prisma.booking.update({
            where: { id: bookingId },
            data: { updatedAt: new Date() }
        })

        // Tạo notification cho receiver
        await prisma.notification.create({
            data: {
                userId: receiverId,
                title: `New message from ${session.user.name}`,
                content: content.length > 50 ? content.substring(0, 50) + '...' : content,
                type: 'BOOKING',
                bookingId
            }
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error('Message send error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

