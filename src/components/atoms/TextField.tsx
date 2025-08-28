// src/components/atoms/TextField.tsx
'use client'

import React from 'react'

type TextFieldProps = {
    id: string
    name: string
    type?: React.HTMLInputTypeAttribute
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    label?: string
    required?: boolean
    icon?: React.ReactNode
    className?: string
}

export default function TextField({
    id,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    label,
    required,
    icon,
    className
}: TextFieldProps) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    name={name}
                    type={type}
                    required={required}
                    className={`w-full rounded-lg border border-gray-200 bg-white/60 ${icon ? 'px-10' : 'px-3'} py-2.5 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}


