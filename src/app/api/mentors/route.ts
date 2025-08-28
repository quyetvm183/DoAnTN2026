// src/app/api/mentors/route.ts
'use server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const subjects = searchParams.get('subjects')?.split(',').filter(Boolean)
        const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
        const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
        const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined
        const availability = searchParams.get('availability')?.split(',').filter(Boolean)
        const sortBy = searchParams.get('sortBy') || 'rating'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')

        const where: any = {
            user: {
                status: 'ACTIVE'
            },
            isApproved: true
        }

        // Search filter
        if (search) {
            where.OR = [
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { bio: { contains: search, mode: 'insensitive' } },
                { major: { contains: search, mode: 'insensitive' } },
                {
                    subjects: {
                        some: {
                            subject: {
                                name: { contains: search, mode: 'insensitive' }
                            }
                        }
                    }
                }
            ]
        }

        // Subject filter
        if (subjects && subjects.length > 0) {
            where.subjects = {
                some: {
                    subjectId: { in: subjects }
                }
            }
        }

        // Price filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.subjects = {
                ...where.subjects,
                some: {
                    ...where.subjects?.some,
                    hourlyRate: {
                        ...(minPrice !== undefined && { gte: minPrice }),
                        ...(maxPrice !== undefined && { lte: maxPrice })
                    }
                }
            }
        }

        // Rating filter
        if (minRating !== undefined) {
            where.avgRating = { gte: minRating }
        }

        const mentors = await prisma.mentorProfile.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                },
                subjects: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true
                            }
                        }
                    },
                    orderBy: {
                        hourlyRate: 'asc'
                    }
                }
            },
            orderBy: (() => {
                switch (sortBy) {
                    case 'experience':
                        return { totalSessions: 'desc' }
                    case 'popular':
                        return { totalSessions: 'desc' }
                    case 'rating':
                    default:
                        return { avgRating: 'desc' }
                }
            })(),
            skip: (page - 1) * limit,
            take: limit
        })

        const total = await prisma.mentorProfile.count({ where })

        return NextResponse.json({
            mentors,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Mentors fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}