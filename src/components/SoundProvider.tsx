'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { playPing, playTick, playPop, playWhoosh, playKnock } from '@/hooks/useSoundEngine'

interface SoundContextType {
    isMuted: boolean
    toggleMute: () => void
    ping: () => void
    tick: () => void
    pop: () => void
    whoosh: () => void
    knock: () => void
}

const SoundContext = createContext<SoundContextType>({
    isMuted: false,
    toggleMute: () => { },
    ping: () => { },
    tick: () => { },
    pop: () => { },
    whoosh: () => { },
    knock: () => { },
})

export function useSound() {
    return useContext(SoundContext)
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
    const initialized = useRef(false)

    // Load mute state from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('sv-sound-muted')
            if (stored === 'true') setIsMuted(true)
            setPrefersReducedMotion(
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            )
            initialized.current = true
        }
    }, [])

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev
            localStorage.setItem('sv-sound-muted', String(next))
            return next
        })
    }, [])

    const shouldPlay = useCallback(() => {
        return !isMuted && !prefersReducedMotion && initialized.current
    }, [isMuted, prefersReducedMotion])

    const ping = useCallback(() => { if (shouldPlay()) playPing() }, [shouldPlay])
    const tick = useCallback(() => { if (shouldPlay()) playTick() }, [shouldPlay])
    const pop = useCallback(() => { if (shouldPlay()) playPop() }, [shouldPlay])
    const whoosh = useCallback(() => { if (shouldPlay()) playWhoosh() }, [shouldPlay])
    const knock = useCallback(() => { if (shouldPlay()) playKnock() }, [shouldPlay])

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, ping, tick, pop, whoosh, knock }}>
            {children}
        </SoundContext.Provider>
    )
}
