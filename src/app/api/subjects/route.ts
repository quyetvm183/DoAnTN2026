// src/app/api/subjects/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/subjects - Get all active subjects
export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json({ data: subjects })
    } catch (error) {
        console.error("Error fetching subjects:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}