// src/app/api/subjects/route.ts
'use server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json({ subjects })
    } catch (error) {
        console.error('Subjects fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}