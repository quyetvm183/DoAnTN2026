// middleware.ts (ở root folder, cùng cấp với package.json)
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.nextauth.token

    // Nếu user đã login và truy cập auth pages, redirect về dashboard
    if (token && pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Kiểm tra role-based access
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    if (pathname.startsWith('/mentor')) {
      if (!token || (token.role !== 'MENTOR' && token.role !== 'BOTH' && token.role !== 'ADMIN')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Cho phép truy cập public routes
        if (
          pathname.startsWith('/auth') ||
          pathname === '/' ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon')
        ) {
          return true
        }

        // Yêu cầu phải có token cho các routes còn lại
        return !!token
      },
    },
  }
)
