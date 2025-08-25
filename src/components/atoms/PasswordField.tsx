// src/components/atoms/PasswordField.tsx
'use client'

import React from 'react'

type PasswordFieldProps = {
    id: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    label?: string
    required?: boolean
    showStrength?: boolean
}

export default function PasswordField({
    id,
    name,
    value,
    onChange,
    placeholder = '••••••••',
    label = 'Password',
    required,
    showStrength
}: PasswordFieldProps) {
    const passwordLength = value.length
    const strengthLabel = passwordLength >= 12 ? 'Strong' : passwordLength >= 8 ? 'Medium' : passwordLength > 0 ? 'Weak' : ''
    const strengthColor = passwordLength >= 12 ? 'bg-emerald-500' : passwordLength >= 8 ? 'bg-amber-500' : 'bg-rose-500'

    return (
        <div>
            {label && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.875 4.875 0 1 0-9.75 0V10.5m-.375 0h10.5a2.625 2.625 0 0 1 2.625 2.625v5.25A2.625 2.625 0 0 1 16.875 21h-9.75A2.625 2.625 0 0 1 4.5 18.375v-5.25A2.625 2.625 0 0 1 7.125 10.5Z" />
                    </svg>
                </div>
                <input
                    id={id}
                    name={name}
                    type="password"
                    required={required}
                    className="w-full rounded-lg border border-gray-200 bg-white/60 px-10 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
            {showStrength && strengthLabel && (
                <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className={`h-full ${strengthColor}`} style={{ width: `${Math.min(passwordLength * 10, 100)}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{strengthLabel}</span>
                </div>
            )}
        </div>
    )
}


