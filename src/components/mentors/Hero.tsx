// src/components/mentors/Hero.tsx
'use client'

import { useState } from 'react'

const categories = ['All', 'Development', 'Design', 'Business', 'Data Science']

export default function Hero({ onSearch }: { onSearch: (q: string) => void }) {
    const [query, setQuery] = useState('')

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Mentor</h1>
            <p className="mt-1 text-gray-600">Connect with experienced professionals who can guide your learning journey</p>

            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                <div className="relative">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
                        placeholder="Search by skills, name, or expertise..."
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pl-10 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                    />
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                    {categories.map(c => (
                        <button key={c} className="rounded-full bg-white px-4 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-50 border border-gray-200">
                            {c}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}


