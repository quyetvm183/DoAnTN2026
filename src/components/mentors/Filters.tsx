// src/components/mentors/Filters.tsx
'use client'

export default function Filters() {
    return (
        <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

                <div className="mt-5 space-y-5">
                    <div>
                        <p className="text-sm font-medium text-gray-800">Price Range</p>
                        <div className="mt-2 space-y-2 text-sm text-gray-700">
                            <label className="flex items-center gap-2"><input type="checkbox" /> $0 - $30/hour</label>
                            <label className="flex items-center gap-2"><input type="checkbox" /> $30 - $60/hour</label>
                            <label className="flex items-center gap-2"><input type="checkbox" /> $60+ /hour</label>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-800">Experience</p>
                        <div className="mt-2 space-y-2 text-sm text-gray-700">
                            <label className="flex items-center gap-2"><input type="checkbox" /> 1-3 years</label>
                            <label className="flex items-center gap-2"><input type="checkbox" /> 3-5 years</label>
                            <label className="flex items-center gap-2"><input type="checkbox" /> 5+ years</label>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-800">Availability</p>
                        <div className="mt-2 space-y-2 text-sm text-gray-700">
                            <label className="flex items-center gap-2"><input type="checkbox" /> Available Today</label>
                            <label className="flex items-center gap-2"><input type="checkbox" /> This Week</label>
                            <label className="flex items-center gap-2"><input type="checkbox" /> Flexible</label>
                        </div>
                    </div>
                </div>

                <button className="mt-6 w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700">Apply Filters</button>
            </div>
        </aside>
    )
}


