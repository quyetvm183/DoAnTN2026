// src/app/api/mentor-application/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const mentorApplicationSchema = z.object({
    bio: z.string().min(50, "Bio must be at least 50 characters"),
    major: z.string().min(1, "Major is required"),
    yearOfStudy: z.number().int().min(1).max(10),
    overallGPA: z.number().min(0).max(4).optional(),
    experience: z.string().optional(),
    motivation: z.string().min(50, "Motivation must be at least 50 characters"),
    subjects: z.array(z.object({
        subjectId: z.string(),
        gpa: z.number().min(0).max(4),
        hourlyRate: z.number().positive(),
        experienceDescription: z.string().optional()
    })).min(1, "At least one subject is required")
})

// GET /api/mentor-application - Get user's mentor application
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const application = await prisma.mentorApplication.findUnique({
            where: { userId: session.user.id },
            include: {
                subjectApplications: {
                    include: {
                        subject: true
                    }
                }
            }
        })

        return NextResponse.json({ data: application })
    } catch (error) {
        console.error("Error fetching mentor application:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// POST /api/mentor-application - Submit mentor application
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
        const validatedData = mentorApplicationSchema.parse(body)

        // Check if user is a mentee
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { mentorApplication: true }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        if (user.role !== "MENTEE") {
            return NextResponse.json(
                { error: "Only mentees can apply to become mentors" },
                { status: 403 }
            )
        }

        // Check if user already has a pending or approved application
        if (user.mentorApplication) {
            if (user.mentorApplication.status === "PENDING") {
                return NextResponse.json(
                    { error: "You already have a pending mentor application" },
                    { status: 400 }
                )
            }
            if (user.mentorApplication.status === "APPROVED") {
                return NextResponse.json(
                    { error: "You are already a mentor" },
                    { status: 400 }
                )
            }
        }

        // Create mentor application
        const application = await prisma.mentorApplication.create({
            data: {
                userId: session.user.id,
                bio: validatedData.bio,
                major: validatedData.major,
                yearOfStudy: validatedData.yearOfStudy,
                overallGPA: validatedData.overallGPA,
                experience: validatedData.experience,
                motivation: validatedData.motivation,
                subjectApplications: {
                    create: validatedData.subjects.map(subject => ({
                        subjectId: subject.subjectId,
                        gpa: subject.gpa,
                        hourlyRate: subject.hourlyRate,
                        experienceDescription: subject.experienceDescription
                    }))
                }
            },
            include: {
                subjectApplications: {
                    include: {
                        subject: true
                    }
                }
            }
        })

        // Create notification for admins (you can implement this later)
        // await createAdminNotification(...)

        return NextResponse.json({
            message: "Mentor application submitted successfully",
            data: application
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error },
                { status: 400 }
            )
        }

        console.error("Error submitting mentor application:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// PUT /api/mentor-application - Update pending application
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
        const validatedData = mentorApplicationSchema.parse(body)

        // Check if user has a pending application
        const existingApplication = await prisma.mentorApplication.findUnique({
            where: { userId: session.user.id }
        })

        if (!existingApplication) {
            return NextResponse.json(
                { error: "No mentor application found" },
                { status: 404 }
            )
        }

        if (existingApplication.status !== "PENDING") {
            return NextResponse.json(
                { error: "Can only update pending applications" },
                { status: 400 }
            )
        }

        // Update application
        const updatedApplication = await prisma.mentorApplication.update({
            where: { userId: session.user.id },
            data: {
                bio: validatedData.bio,
                major: validatedData.major,
                yearOfStudy: validatedData.yearOfStudy,
                overallGPA: validatedData.overallGPA,
                experience: validatedData.experience,
                motivation: validatedData.motivation,
                subjectApplications: {
                    deleteMany: {},
                    create: validatedData.subjects.map(subject => ({
                        subjectId: subject.subjectId,
                        gpa: subject.gpa,
                        hourlyRate: subject.hourlyRate,
                        experienceDescription: subject.experienceDescription
                    }))
                }
            },
            include: {
                subjectApplications: {
                    include: {
                        subject: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: "Mentor application updated successfully",
            data: updatedApplication
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error },
                { status: 400 }
            )
        }

        console.error("Error updating mentor application:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// DELETE /api/mentor-application - Cancel pending application
export async function DELETE() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const existingApplication = await prisma.mentorApplication.findUnique({
            where: { userId: session.user.id }
        })

        if (!existingApplication) {
            return NextResponse.json(
                { error: "No mentor application found" },
                { status: 404 }
            )
        }

        if (existingApplication.status !== "PENDING") {
            return NextResponse.json(
                { error: "Can only cancel pending applications" },
                { status: 400 }
            )
        }

        await prisma.mentorApplication.delete({
            where: { userId: session.user.id }
        })

        return NextResponse.json({
            message: "Mentor application cancelled successfully"
        })
    } catch (error) {
        console.error("Error cancelling mentor application:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}