'use client'

import React from 'react'

interface GlassCardProps {
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'strong'
}

export function GlassCard({ children, className = '', variant = 'default' }: GlassCardProps) {
    return (
        <div className={`${variant === 'strong' ? 'glass-strong' : 'glass'} rounded-2xl p-6 ${className}`}>
            {children}
        </div>
    )
}
