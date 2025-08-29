// src/app/api/profile/mentor/subjects/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const mentorSubjectSchema = z.object({
    subjectId: z.string(),
    hourlyRate: z.number().positive(),
    experienceDescription: z.string().optional()
})

const updateMentorSubjectsSchema = z.object({
    subjects: z.array(mentorSubjectSchema)
})

// GET /api/profile/mentor/subjects - Get mentor subjects
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const mentorSubjects = await prisma.mentorSubject.findMany({
            where: { mentorId: session.user.id },
            include: {
                subject: true
            }
        })

        return NextResponse.json({ data: mentorSubjects })
    } catch (error) {
        console.error("Error fetching mentor subjects:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// PUT /api/profile/mentor/subjects - Update mentor subjects
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = updateMentorSubjectsSchema.parse(body)

        // Check if user has mentor role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user || (user.role !== "MENTOR" && user.role !== "BOTH")) {
            return NextResponse.json(
                { error: "User must be a mentor to update subjects" },
                { status: 403 }
            )
        }

        // Ensure mentor profile exists
        await prisma.mentorProfile.upsert({
            where: { userId: session.user.id },
            update: {},
            create: {
                userId: session.user.id,
                bio: ""
            }
        })

        // Delete existing mentor subjects
        await prisma.mentorSubject.deleteMany({
            where: { mentorId: session.user.id }
        })

        // Create new mentor subjects
        const newMentorSubjects = await Promise.all(
            validatedData.subjects.map(subject =>
                prisma.mentorSubject.create({
                    data: {
                        mentorId: session.user.id,
                        subjectId: subject.subjectId,
                        hourlyRate: subject.hourlyRate,
                        experienceDescription: subject.experienceDescription
                    },
                    include: {
                        subject: true
                    }
                })
            )
        )

        return NextResponse.json({
            message: "Mentor subjects updated successfully",
            data: newMentorSubjects
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error },
                { status: 400 }
            )
        }

        console.error("Error updating mentor subjects:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// POST /api/profile/mentor/subjects - Add a single subject
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = mentorSubjectSchema.parse(body)

        // Check if user has mentor role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user || (user.role !== "MENTOR" && user.role !== "BOTH")) {
            return NextResponse.json(
                { error: "User must be a mentor to add subjects" },
                { status: 403 }
            )
        }

        // Ensure mentor profile exists
        await prisma.mentorProfile.upsert({
            where: { userId: session.user.id },
            update: {},
            create: {
                userId: session.user.id,
                bio: ""
            }
        })

        // Check if subject already exists for this mentor
        const existingMentorSubject = await prisma.mentorSubject.findUnique({
            where: {
                mentorId_subjectId: {
                    mentorId: session.user.id,
                    subjectId: validatedData.subjectId
                }
            }
        })

        if (existingMentorSubject) {
            return NextResponse.json(
                { error: "Subject already exists for this mentor" },
                { status: 400 }
            )
        }

        // Create new mentor subject
        const newMentorSubject = await prisma.mentorSubject.create({
            data: {
                mentorId: session.user.id,
                subjectId: validatedData.subjectId,
                hourlyRate: validatedData.hourlyRate,
                experienceDescription: validatedData.experienceDescription
            },
            include: {
                subject: true
            }
        })

        return NextResponse.json({
            message: "Subject added successfully",
            data: newMentorSubject
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error },
                { status: 400 }
            )
        }

        console.error("Error adding mentor subject:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}