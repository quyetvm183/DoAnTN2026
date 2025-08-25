// src/components/atoms/RoleSegmentedControl.tsx
'use client'

import React from 'react'

type Option = { label: string; value: string }

type RoleSegmentedControlProps = {
    value: string
    onChange: (value: string) => void
    options?: Option[]
    label?: string
}

const DEFAULT_OPTIONS: Option[] = [
    { label: 'Mentee', value: 'MENTEE' },
    { label: 'Mentor', value: 'MENTOR' },
    { label: 'Both', value: 'BOTH' }
]

export default function RoleSegmentedControl({
    value,
    onChange,
    options = DEFAULT_OPTIONS,
    label = 'Your role'
}: RoleSegmentedControlProps) {
    return (
        <div>
            <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-100 p-1">
                {options.map(option => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`${value === option.value ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'} rounded-md px-3 py-2 text-sm transition`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}


