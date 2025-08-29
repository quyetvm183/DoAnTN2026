// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schemas
export const updateBasicInfoSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  schoolName: z.string().optional(),
  studentId: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["ADMIN", "MENTOR", "MENTEE", "BOTH"])
})

export const updateMentorProfileSchema = z.object({
  bio: z.string().optional(),
  major: z.string().optional(),
  yearOfStudy: z.number().int().min(1).max(10).optional(),
  hourlyRate: z.number().positive().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional()
})

// GET /api/profile - Get user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        mentorProfile: {
          include: {
            subjects: {
              include: {
                subject: true
              }
            }
          }
        },
        wallet: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Transform mentor subjects to include skills and availability
    const mentorData = user.mentorProfile ? {
      ...user.mentorProfile,
      skills: user.mentorProfile.subjects.map(ms => ms.subject.name),
      subjects: user.mentorProfile.subjects,
      // For now, availability is stored as a simple array in the frontend
      // In a real app, you might want to add an availability table
      availability: ["Monday", "Wednesday", "Friday"] // Demo data
    } : null

    const profileData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      schoolName: user.schoolName,
      studentId: user.studentId,
      role: user.role,
      status: user.status,
      bio: user.mentorProfile?.bio || "",
      mentor: mentorData,
      wallet: user.wallet,
      createdAt: user.createdAt
    }

    return NextResponse.json({ data: profileData })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update basic profile info
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
    const validatedData = updateBasicInfoSchema.parse(body)

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        schoolName: validatedData.schoolName,
        studentId: validatedData.studentId,
        role: validatedData.role
      },
      include: {
        mentorProfile: true
      }
    })

    // If bio is provided and user has mentor role, update mentor profile bio
    if (validatedData.bio && (validatedData.role === "MENTOR" || validatedData.role === "BOTH")) {
      await prisma.mentorProfile.upsert({
        where: { userId: session.user.id },
        update: { bio: validatedData.bio },
        create: {
          userId: session.user.id,
          bio: validatedData.bio
        }
      })
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      data: updatedUser
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

