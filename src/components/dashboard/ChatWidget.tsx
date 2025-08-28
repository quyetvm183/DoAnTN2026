// src/components/dashboard/ChatWidget.tsx
'use client'

import { useState } from 'react'

export default function ChatWidget() {
    const [open, setOpen] = useState(false)

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {open && (
                <div className="mb-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-pink-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Mentor chat</p>
                                <p className="text-xs text-gray-500">2 mentors online</p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100">✕</button>
                    </div>
                    <div className="h-64 space-y-3 overflow-y-auto p-4">
                        <div className="rounded-lg bg-gray-50 p-2 text-sm text-gray-700">Hi! How can we help you?</div>
                        <div className="ml-auto w-fit rounded-lg bg-indigo-600 p-2 text-sm text-white">I need help with React.</div>
                    </div>
                    <div className="flex items-center gap-2 border-t p-3">
                        <input className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" placeholder="Type a message..." />
                        <button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">Send</button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setOpen(!open)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-fuchsia-500"
                aria-label="Open chat"
            >
                💬
            </button>
        </div>
    )
}


