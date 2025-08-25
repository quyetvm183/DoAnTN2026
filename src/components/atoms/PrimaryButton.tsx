// src/components/atoms/PrimaryButton.tsx
'use client'

import React from 'react'

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean
}

export default function PrimaryButton({ loading, children, className, ...props }: PrimaryButtonProps) {
    return (
        <button
            {...props}
            className={`group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 to-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60 ${className ?? ''}`}
        >
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 transition group-hover:opacity-100" />
            {loading && (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
            )}
            {loading ? 'Processing...' : children}
        </button>
    )
}


