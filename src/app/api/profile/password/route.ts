// src/app/api/profile/password/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

// PUT /api/profile/password - Change password
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
        const validatedData = changePasswordSchema.parse(body)

        // Get current user with password
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(
            validatedData.currentPassword,
            user.password
        )

        if (!isCurrentPasswordValid) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)

        // Update password
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedNewPassword }
        })

        return NextResponse.json({
            message: "Password changed successfully"
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error },
                { status: 400 }
            )
        }

        console.error("Error changing password:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}