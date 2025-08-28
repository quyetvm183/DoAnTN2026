// src/components/mentors/AdvancedFilters.tsx
'use client'

import { useState, useEffect } from 'react'

export type FilterState = {
    priceRange: {
        min: number
        max: number
    }
    subjects: string[]
    availability: string[]
    rating: number
    experience: string[]
    location: string
    sortBy: string
}

type Subject = {
    id: string
    name: string
    code: string
}

type AdvancedFiltersProps = {
    filters: FilterState
    onChange: (filters: FilterState) => void
    onApply: () => void
    onReset: () => void
}

const AVAILABILITY_OPTIONS = [
    { value: 'available_today', label: 'Available Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'flexible', label: 'Flexible Schedule' },
    { value: 'weekends', label: 'Weekends Only' }
]

const EXPERIENCE_OPTIONS = [
    { value: '1-2', label: '1-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' }
]

const SORT_OPTIONS = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'popular', label: 'Most Popular' }
]

export default function AdvancedFilters({ filters, onChange, onApply, onReset }: AdvancedFiltersProps) {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCollapsed, setIsCollapsed] = useState(false)

    useEffect(() => {
        loadSubjects()
    }, [])

    const loadSubjects = async () => {
        try {
            const response = await fetch('/api/subjects')
            if (response.ok) {
                const data = await response.json()
                setSubjects(data.subjects)
            }
        } catch (error) {
            console.error('Failed to load subjects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const updateFilter = (key: keyof FilterState, value: any) => {
        onChange({ ...filters, [key]: value })
    }

    const toggleArrayFilter = (key: 'subjects' | 'availability' | 'experience', value: string) => {
        const currentArray = filters[key]
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value]
        updateFilter(key, newArray)
    }

    const hasActiveFilters = () => {
        return (
            filters.priceRange.min > 0 ||
            filters.priceRange.max < 200 ||
            filters.subjects.length > 0 ||
            filters.availability.length > 0 ||
            filters.rating > 0 ||
            filters.experience.length > 0 ||
            filters.location ||
            filters.sortBy !== 'rating'
        )
    }

    return (
        <aside className={`w-full lg:w-72 shrink-0 ${isCollapsed ? 'lg:w-16' : ''} transition-all duration-300`}>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className={`font-semibold text-gray-900 ${isCollapsed ? 'hidden' : ''}`}>
                        Filters
                    </h3>
                    {hasActiveFilters() && !isCollapsed && (
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                            Active
                        </span>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:block p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <svg
                            className={`w-4 h-4 text-gray-400 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {!isCollapsed && (
                    <div className="p-4 space-y-6">
                        {/* Sort By */}
                        <div>
                            <label className="text-sm font-medium text-gray-800 mb-2 block">Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => updateFilter('sortBy', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            >
                                {SORT_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="text-sm font-medium text-gray-800 mb-3 block">
                                Price Range: ${filters.priceRange.min} - ${filters.priceRange.max}/hour
                            </label>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={200}
                                        step={5}
                                        value={filters.priceRange.min}
                                        onChange={(e) => updateFilter('priceRange', {
                                            ...filters.priceRange,
                                            min: parseInt(e.target.value)
                                        })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={200}
                                        step={5}
                                        value={filters.priceRange.max}
                                        onChange={(e) => updateFilter('priceRange', {
                                            ...filters.priceRange,
                                            max: parseInt(e.target.value)
                                        })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="text-sm font-medium text-gray-800 mb-3 block">
                                Minimum Rating
                            </label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => updateFilter('rating', star === filters.rating ? 0 : star)}
                                        className={`text-2xl transition-colors ${star <= filters.rating ? 'text-yellow-400' : 'text-gray-200'
                                            } hover:text-yellow-400`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subjects */}
                        <div>
                            <label className="text-sm font-medium text-gray-800 mb-3 block">Subjects</label>
                            {isLoading ? (
                                <div className="space-y-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {subjects.map((subject) => (
                                        <label key={subject.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.subjects.includes(subject.id)}
                                                onChange={() => toggleArrayFilter('subjects', subject.id)}
                                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700">{subject.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Availability */}
                        <div>
                            <label className="text-sm font-medium text-gray-800 mb-3 block">Availability</label>
                            <div className="space-y-2">
                                {AVAILABILITY_OPTIONS.map((option) => (
                                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.availability.includes(option.value)}
                                            onChange={() => toggleArrayFilter('availability', option.value)}
                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="text-sm font-medium text-gray-800 mb-3 block">Experience</label>
                            <div className="space-y-2">
                                {EXPERIENCE_OPTIONS.map((option) => (
                                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.experience.includes(option.value)}
                                            onChange={() => toggleArrayFilter('experience', option.value)}
                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="text-sm font-medium text-gray-800 mb-2 block">Location</label>
                            <input
                                type="text"
                                placeholder="Enter city or region"
                                value={filters.location}
                                onChange={(e) => updateFilter('location', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <button
                                onClick={onApply}
                                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={onReset}
                                className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}

                {/* Collapsed State */}
                {isCollapsed && (
                    <div className="p-2 space-y-2">
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="w-full p-2 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                            title="Expand Filters"
                        >
                            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </button>
                        {hasActiveFilters() && (
                            <div className="w-2 h-2 bg-indigo-600 rounded-full mx-auto"></div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mt-4">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
                >
                    {isCollapsed ? 'Show Filters' : 'Hide Filters'}
                </button>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: none;
        }
      `}</style>
        </aside>
    )
}