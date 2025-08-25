// src/components/mentors/MentorCard.tsx
'use client'

type MentorCardProps = {
    name: string
    initials: string
    title: string
    rate: string
    availability?: string
    rating?: string
    reviewCount?: number
    description: string
    tags: string[]
}

function Tag({ label }: { label: string }) {
    return <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-800">{label}</span>
}

export default function MentorCard(props: MentorCardProps) {
    const { name, initials, title, rate, availability, rating = '4.9', reviewCount = 127, description, tags } = props
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white">
                        <span className="text-lg font-bold">{initials}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                            <p className="text-lg font-semibold text-gray-900">{rate}</p>
                        </div>
                        <p className="text-sm text-gray-600">{title}</p>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                            <span className="text-yellow-500">★★★★★</span>
                            <span className="text-gray-700">{rating} ({reviewCount} reviews)</span>
                            {availability && <span className="text-emerald-600">{availability}</span>}
                        </div>
                    </div>
                </div>
            </div>
            <p className="mt-3 text-gray-700">{description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {tags.map(t => <Tag key={t} label={t} />)}
            </div>
            <div className="mt-5 flex items-center gap-3">
                <button className="flex-1 rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700">Book Session</button>
                <button className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50">Message</button>
            </div>
        </div>
    )
}


