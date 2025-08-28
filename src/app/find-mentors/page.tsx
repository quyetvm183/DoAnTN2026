// src/app/find-mentors/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AdvancedFilters, { FilterState } from '@/components/mentors/AdvancedFilters'
import MentorCard from '@/components/mentors/MentorCard'
import Hero from '@/components/mentors/Hero'
import Navbar from '@/components/layout/Navbar'
import ChatWidget from '@/components/dashboard/ChatWidget'
import ChatWindow from '@/components/chat/ChatWindow'

type Mentor = {
    id: string
    name: string
    bio: string
    major: string
    avgRating: number
    totalSessions: number
    subjects: Array<{
        subject: {
            id: string
            name: string
        }
        hourlyRate: number
    }>
    user: {
        avatarUrl?: string
    }
}

const DEFAULT_FILTERS: FilterState = {
    priceRange: { min: 0, max: 200 },
    subjects: [],
    availability: [],
    rating: 0,
    experience: [],
    location: '',
    sortBy: 'rating'
}

export default function FindMentorsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [mentors, setMentors] = useState<Mentor[]>([])
    const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedChat, setSelectedChat] = useState<{
        bookingId: string
        otherUser: {
            id: string
            name: string
            avatarUrl?: string
        }
    } | null>(null)

    const MENTORS_PER_PAGE = 12

    useEffect(() => {
        // Initialize from URL params
        const query = searchParams.get('q') || ''
        const subject = searchParams.get('subject') || ''
        const page = parseInt(searchParams.get('page') || '1')

        setSearchQuery(query)
        setCurrentPage(page)

        if (subject) {
            setFilters(prev => ({
                ...prev,
                subjects: [subject]
            }))
        }

        loadMentors()
    }, [searchParams])

    useEffect(() => {
        applyFilters()
    }, [mentors, filters, searchQuery])

    const loadMentors = async () => {
        try {
            const response = await fetch('/api/mentors')
            if (response.ok) {
                const data = await response.json()
                setMentors(data.mentors)
            }
        } catch (error) {
            console.error('Failed to load mentors:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...mentors]

        // Text search
        if (searchQuery) {
            filtered = filtered.filter(mentor =>
                mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mentor.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mentor.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mentor.subjects.some(s =>
                    s.subject.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
        }

        // Price range
        filtered = filtered.filter(mentor => {
            const rates = mentor.subjects.map(s => s.hourlyRate)
            const minRate = Math.min(...rates)
            const maxRate = Math.max(...rates)
            return minRate >= filters.priceRange.min && maxRate <= filters.priceRange.max
        })

        // Subjects
        if (filters.subjects.length > 0) {
            filtered = filtered.filter(mentor =>
                mentor.subjects.some(s => filters.subjects.includes(s.subject.id))
            )
        }

        // Rating
        if (filters.rating > 0) {
            filtered = filtered.filter(mentor => mentor.avgRating >= filters.rating)
        }

        // Sort
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'rating':
                    return b.avgRating - a.avgRating
                case 'price_low':
                    const aMinRate = Math.min(...a.subjects.map(s => s.hourlyRate))
                    const bMinRate = Math.min(...b.subjects.map(s => s.hourlyRate))
                    return aMinRate - bMinRate
                case 'price_high':
                    const aMaxRate = Math.max(...a.subjects.map(s => s.hourlyRate))
                    const bMaxRate = Math.max(...b.subjects.map(s => s.hourlyRate))
                    return bMaxRate - aMaxRate
                case 'experience':
                    return b.totalSessions - a.totalSessions
                case 'popular':
                    return b.totalSessions - a.totalSessions
                default:
                    return 0
            }
        })

        setFilteredMentors(filtered)
        setTotalPages(Math.ceil(filtered.length / MENTORS_PER_PAGE))
        if (currentPage > Math.ceil(filtered.length / MENTORS_PER_PAGE)) {
            setCurrentPage(1)
        }
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
        // Update URL
        const params = new URLSearchParams(searchParams)
        if (query) {
            params.set('q', query)
        } else {
            params.delete('q')
        }
        params.set('page', '1')
        router.push(`/find-mentors?${params.toString()}`)
    }

    const handleApplyFilters = () => {
        setCurrentPage(1)
        // Update URL with filter params
        const params = new URLSearchParams(searchParams)
        if (filters.subjects.length > 0) {
            params.set('subjects', filters.subjects.join(','))
        } else {
            params.delete('subjects')
        }
        params.set('page', '1')
        router.push(`/find-mentors?${params.toString()}`)
    }

    const handleResetFilters = () => {
        setFilters(DEFAULT_FILTERS)
        setSearchQuery('')
        setCurrentPage(1)
        router.push('/find-mentors')
    }

    const getCurrentPageMentors = () => {
        const startIndex = (currentPage - 1) * MENTORS_PER_PAGE
        const endIndex = startIndex + MENTORS_PER_PAGE
        return filteredMentors.slice(startIndex, endIndex)
    }

    const getDisplayRate = (mentor: Mentor) => {
        const rates = mentor.subjects.map(s => s.hourlyRate)
        const minRate = Math.min(...rates)
        const maxRate = Math.max(...rates)
        return minRate === maxRate ? `${minRate}/hour` : `${minRate}-${maxRate}/hour`
    }

    const getSubjectTags = (mentor: Mentor) => {
        return mentor.subjects.slice(0, 3).map(s => s.subject.name)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* Hero Section */}
                    <Hero onSearch={handleSearch} />

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Filters */}
                        <AdvancedFilters
                            filters={filters}
                            onChange={setFilters}
                            onApply={handleApplyFilters}
                            onReset={handleResetFilters}
                        />

                        {/* Results */}
                        <div className="flex-1">
                            {/* Results Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {filteredMentors.length} mentors found
                                    </h2>
                                    {searchQuery && (
                                        <p className="text-sm text-gray-600">
                                            Results for "{searchQuery}"
                                        </p>
                                    )}
                                </div>

                                {/* View Toggle */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 animate-pulse">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                                                <div className="flex-1">
                                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded" />
                                                <div className="h-4 bg-gray-200 rounded w-5/6" />
                                                <div className="flex gap-2">
                                                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                                                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {!isLoading && filteredMentors.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentors found</h3>
                                    <p className="text-gray-600 mb-4">
                                        Try adjusting your search criteria or filters to find more mentors.
                                    </p>
                                    <button
                                        onClick={handleResetFilters}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}

                            {/* Mentor Grid */}
                            {!isLoading && filteredMentors.length > 0 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {getCurrentPageMentors().map((mentor) => (
                                            <MentorCard
                                                key={mentor.id}
                                                name={mentor.name}
                                                initials={mentor.name.charAt(0).toUpperCase()}
                                                title={mentor.major || 'Professional Mentor'}
                                                rate={getDisplayRate(mentor)}
                                                rating={mentor.avgRating.toString()}
                                                reviewCount={mentor.totalSessions}
                                                description={mentor.bio || 'Experienced mentor ready to help you grow'}
                                                tags={getSubjectTags(mentor)}
                                                availability="Available this week"
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-8">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>

                                            {[...Array(totalPages)].map((_, i) => {
                                                const page = i + 1
                                                if (
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`px-4 py-2 text-sm rounded-lg ${currentPage === page
                                                                    ? 'bg-indigo-600 text-white'
                                                                    : 'border border-gray-200 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                } else if (
                                                    page === currentPage - 2 ||
                                                    page === currentPage + 2
                                                ) {
                                                    return <span key={page} className="px-2 text-gray-400">...</span>
                                                }
                                                return null
                                            })}

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Chat Widget */}
            <ChatWidget />

            {/* Chat Window */}
            {selectedChat && (
                <ChatWindow
                    bookingId={selectedChat.bookingId}
                    otherUser={selectedChat.otherUser}
                    isOpen={!!selectedChat}
                    onClose={() => setSelectedChat(null)}
                />
            )}
        </div>
    )
}