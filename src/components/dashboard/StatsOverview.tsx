// src/components/dashboard/StatsOverview.tsx
'use client'

type StatCardProps = {
    title: string
    value: string
    trend?: string
}

function StatCard({ title, value, trend }: StatCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                {trend && <span className="text-xs text-emerald-600">{trend}</span>}
            </div>
            <div className="mt-4 h-16 w-full rounded-md bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50" />
        </div>
    )
}

export default function StatsOverview() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Active Mentors" value="42" trend="+5%" />
            <StatCard title="Hours this week" value="18.5h" trend="+2.1h" />
            <StatCard title="Total paid" value="$1,240" trend="+12%" />
            <StatCard title="Sessions booked" value="8" trend="+2" />
        </div>
    )
}


