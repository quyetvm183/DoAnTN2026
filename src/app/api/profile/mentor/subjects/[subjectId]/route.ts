// src/app/api/profile/mentor/subjects/[subjectId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// DELETE /api/profile/mentor/subjects/[subjectId] - Remove a subject
export async function DELETE(
    request: NextRequest,
    { params }: { params: { subjectId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { subjectId } = params

        // Check if user has mentor role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user || (user.role !== "MENTOR" && user.role !== "BOTH")) {
            return NextResponse.json(
                { error: "User must be a mentor to remove subjects" },
                { status: 403 }
            )
        }

        // Check if the mentor subject exists
        const mentorSubject = await prisma.mentorSubject.findUnique({
            where: {
                mentorId_subjectId: {
                    mentorId: session.user.id,
                    subjectId: subjectId
                }
            }
        })

        if (!mentorSubject) {
            return NextResponse.json(
                { error: "Subject not found" },
                { status: 404 }
            )
        }

        // Delete the mentor subject
        await prisma.mentorSubject.delete({
            where: {
                mentorId_subjectId: {
                    mentorId: session.user.id,
                    subjectId: subjectId
                }
            }
        })

        return NextResponse.json({
            message: "Subject removed successfully"
        })
    } catch (error) {
        console.error("Error removing mentor subject:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// PUT /api/profile/mentor/subjects/[subjectId] - Update a subject
export async function PUT(
    request: NextRequest,
    { params }: { params: { subjectId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { subjectId } = params
        const body = await request.json()
        const { hourlyRate, experienceDescription } = body

        // Validate input
        if (!hourlyRate || hourlyRate <= 0) {
            return NextResponse.json(
                { error: "Valid hourly rate is required" },
                { status: 400 }
            )
        }

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

        // Update the mentor subject
        const updatedMentorSubject = await prisma.mentorSubject.update({
            where: {
                mentorId_subjectId: {
                    mentorId: session.user.id,
                    subjectId: subjectId
                }
            },
            data: {
                hourlyRate: parseFloat(hourlyRate),
                experienceDescription: experienceDescription || null
            },
            include: {
                subject: true
            }
        })

        return NextResponse.json({
            message: "Subject updated successfully",
            data: updatedMentorSubject
        })
    } catch (error) {
        console.error("Error updating mentor subject:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}