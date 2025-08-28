// src/components/atoms/Alert.tsx
'use client'

import React from 'react'

type AlertProps = {
    message: string
    variant?: 'error' | 'info' | 'success'
    className?: string
}

export default function Alert({ message, variant = 'error', className }: AlertProps) {
    const styles = {
        error: 'border-rose-200 bg-rose-50 text-rose-700',
        info: 'border-sky-200 bg-sky-50 text-sky-700',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-700'
    }[variant]

    const Icon = () => {
        if (variant === 'success') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mt-0.5 h-5 w-5 flex-none">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3.53 7.22a.75.75 0 1 0-1.06-1.06L11 11.88l-1.47-1.47a.75.75 0 1 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4-4Z" clipRule="evenodd" />
                </svg>
            )
        }
        if (variant === 'info') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mt-0.5 h-5 w-5 flex-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852L11.78 15M12 9.75h.008v.008H12V9.75Zm9.75 2.25a9.75 9.75 0 1 1-19.5 0 9.75 9.75 0 0 1 19.5 0Z" />
                </svg>
            )
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mt-0.5 h-5 w-5 flex-none">
                <path fillRule="evenodd" d="M10.29 3.86c.86-1.5 2.96-1.5 3.82 0l8.3 14.5c.86 1.5-.21 3.38-1.91 3.38H3.9c-1.7 0-2.77-1.88-1.9-3.38l8.3-14.5ZM13 17a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1-9a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Z" clipRule="evenodd" />
            </svg>
        )
    }

    return (
        <div className={`flex items-start gap-2 rounded-lg border px-4 py-3 ${styles} ${className ?? ''}`}>
            <Icon />
            <span className="text-sm">{message}</span>
        </div>
    )
}


