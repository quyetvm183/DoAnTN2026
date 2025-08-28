// src/components/atoms/TextArea.tsx
'use client'

import React from 'react'

type TextAreaProps = {
    id: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
    label?: string
    required?: boolean
    rows?: number
    className?: string
}

export default function TextArea({
    id,
    name,
    value,
    onChange,
    placeholder,
    label,
    required,
    rows = 4,
    className
}: TextAreaProps) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                name={name}
                required={required}
                rows={rows}
                className="w-full rounded-lg border border-gray-200 bg-white/60 px-3 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}