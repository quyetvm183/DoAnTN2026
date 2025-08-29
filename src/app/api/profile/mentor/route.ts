// src/app/api/profile/mentor/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { updateMentorProfileSchema } from "../route"
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
        const validatedData = updateMentorProfileSchema.parse(body)

        // Check if user has mentor role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user || (user.role !== "MENTOR" && user.role !== "BOTH")) {
            return NextResponse.json(
                { error: "User must be a mentor to update mentor profile" },
                { status: 403 }
            )
        }

        // Update or create mentor profile
        const mentorProfile = await prisma.mentorProfile.upsert({
            where: { userId: session.user.id },
            update: {
                bio: validatedData.bio,
                major: validatedData.major,
                yearOfStudy: validatedData.yearOfStudy,
            },
            create: {
                userId: session.user.id,
                bio: validatedData.bio || "",
                major: validatedData.major,
                yearOfStudy: validatedData.yearOfStudy,
            }
        })

        return NextResponse.json({
            message: "Mentor profile updated successfully",
            data: mentorProfile
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error },
                { status: 400 }
            )
        }

        console.error("Error updating mentor profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}