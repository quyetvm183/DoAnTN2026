// src/app/find-mentors/page.tsx
'use client'
import Hero from '@/components/mentors/Hero'
import Filters from '@/components/mentors/Filters'
import MentorCard from '@/components/mentors/MentorCard'

const DEMO = [
    {
        initials: 'SM',
        name: 'Sarah Martinez',
        title: 'Senior Full-Stack Developer',
        rate: '$45/hr',
        availability: 'Available Today',
        description: 'Experienced developer with 8+ years in React, Node.js, and cloud technologies. I love helping others build amazing web applications.',
        tags: ['JavaScript', 'React', 'Node.js', 'AWS']
    },
    {
        initials: 'ER',
        name: 'Emily Rodriguez',
        title: 'Product Design Lead',
        rate: '$60/hr',
        availability: 'Tomorrow',
        description: 'Design leader with expertise in user research, prototyping, and design systems. I help designers create impactful user experiences.',
        tags: ['Figma', 'User Research', 'Prototyping', 'Design Systems']
    }
]

export default function FindMentorsPage() {
    const handleSearch = (q: string) => {
        // TODO: hook to query params later
        console.log('search:', q)
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Hero onSearch={handleSearch} />

            <div className="mt-6 flex gap-6">
                <Filters />
                <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm text-gray-600">Showing {DEMO.length} mentors</p>
                        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                            <option>Sort by: Recommended</option>
                            <option>Sort by: Price</option>
                            <option>Sort by: Rating</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {DEMO.map(m => (
                            <MentorCard key={m.name} {...m} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


