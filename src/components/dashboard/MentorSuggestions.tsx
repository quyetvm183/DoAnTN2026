// src/components/dashboard/MentorSuggestions.tsx
'use client'

type Mentor = {
    initials: string
    name: string
    title: string
    tags: string[]
    rate: string
    exp: string
}

const demoMentors: Mentor[] = [
    { initials: 'MJ', name: 'Michael Johnson', title: 'Senior Full-Stack Developer', tags: ['Node.js', 'MongoDB', 'AWS'], rate: '$45/hour', exp: '5+ years experience' },
    { initials: 'ER', name: 'Emily Rodriguez', title: 'Product Design Lead', tags: ['Figma', 'Prototyping', 'User Research'], rate: '$60/hour', exp: '7+ years experience' },
]

function Tag({ label }: { label: string }) {
    return <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{label}</span>
}

function MentorCard({ mentor }: { mentor: Mentor }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white">
                    <span className="text-sm font-semibold">{mentor.initials}</span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{mentor.name}</p>
                    <p className="text-sm text-gray-500">{mentor.title}</p>
                </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {mentor.tags.map(t => <Tag key={t} label={t} />)}
            </div>
            <div className="mt-3 text-sm text-gray-600">{mentor.exp} • {mentor.rate}</div>
            <button className="mt-4 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200">Connect</button>
        </div>
    )
}

export default function MentorSuggestions() {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Discover New Mentors</h3>
                <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">Browse All</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {demoMentors.map(m => <MentorCard key={m.name} mentor={m} />)}
            </div>
        </section>
    )
}


