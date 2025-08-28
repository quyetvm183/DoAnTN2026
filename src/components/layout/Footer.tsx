// src/components/layout/Footer.tsx
'use client'

import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t border-gray-200/80 bg-white/70 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <span className="text-sm font-bold">M</span>
                        </div>
                        <span>© {new Date().getFullYear()} MentorPlatform</span>
                    </div>

                    <nav className="flex items-center gap-4 text-sm text-gray-600">
                        <Link href="/about" className="hover:text-indigo-600">About</Link>
                        <Link href="/terms" className="hover:text-indigo-600">Terms</Link>
                        <Link href="/privacy" className="hover:text-indigo-600">Privacy</Link>
                        <Link href="/contact" className="hover:text-indigo-600">Contact</Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}


