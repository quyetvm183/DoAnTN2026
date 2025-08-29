// src/app/api/profile/avatar/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// POST /api/profile/avatar - Upload avatar
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const data = await request.formData()
        const file: File | null = data.get('avatar') as unknown as File

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            )
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: "File must be an image" },
                { status: 400 }
            )
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File size must be less than 5MB" },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const timestamp = Date.now()
        const extension = path.extname(file.name)
        const filename = `${session.user.id}_${timestamp}${extension}`

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads/avatars')
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (error) {
            // Directory might already exist
        }

        // Save file
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)

        // Update user avatar URL
        const avatarUrl = `/uploads/avatars/${filename}`
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { avatarUrl },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true
            }
        })

        return NextResponse.json({
            message: "Avatar uploaded successfully",
            data: { avatarUrl: updatedUser.avatarUrl }
        })
    } catch (error) {
        console.error("Error uploading avatar:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// DELETE /api/profile/avatar - Remove avatar
export async function DELETE() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Update user to remove avatar URL
        await prisma.user.update({
            where: { id: session.user.id },
            data: { avatarUrl: null }
        })

        return NextResponse.json({
            message: "Avatar removed successfully"
        })
    } catch (error) {
        console.error("Error removing avatar:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}