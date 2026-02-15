'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import {
    playPing, playTick, playPop, playWhoosh, playKnock, playChime,
    playShimmer, playGlassTap, playResonance, startAmbientDrone, stopAmbientDrone
} from '@/hooks/useSoundEngine'

interface SoundContextType {
    isMuted: boolean
    toggleMute: () => void
    ping: () => void
    tick: () => void
    pop: () => void
    whoosh: () => void
    knock: () => void
    chime: () => void
    shimmer: () => void
    glassTap: () => void
    resonance: () => void
    startAmbient: () => void
    stopAmbient: () => void
}

const SoundContext = createContext<SoundContextType>({
    isMuted: false,
    toggleMute: () => { },
    ping: () => { },
    tick: () => { },
    pop: () => { },
    whoosh: () => { },
    knock: () => { },
    chime: () => { },
    shimmer: () => { },
    glassTap: () => { },
    resonance: () => { },
    startAmbient: () => { },
    stopAmbient: () => { },
})

export function useSound() {
    return useContext(SoundContext)
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false)
    const prefersReducedMotion = useRef(false)
    const initialized = useRef(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('sv-sound-muted')
            if (stored === 'true') setIsMuted(true)
            prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            initialized.current = true
        }
    }, [])

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev
            localStorage.setItem('sv-sound-muted', String(next))
            if (next) stopAmbientDrone()
            return next
        })
    }, [])

    // Use ref for muted state to avoid stale closures in callbacks
    const mutedRef = useRef(isMuted)
    mutedRef.current = isMuted

    const safePlay = useCallback((fn: () => void) => {
        if (!mutedRef.current && !prefersReducedMotion.current && initialized.current) fn()
    }, [])

    const ping = useCallback(() => safePlay(playPing), [safePlay])
    const tick = useCallback(() => safePlay(playTick), [safePlay])
    const pop = useCallback(() => safePlay(playPop), [safePlay])
    const whoosh = useCallback(() => safePlay(playWhoosh), [safePlay])
    const knock = useCallback(() => safePlay(playKnock), [safePlay])
    const chime = useCallback(() => safePlay(playChime), [safePlay])
    const shimmer = useCallback(() => safePlay(playShimmer), [safePlay])
    const glassTap = useCallback(() => safePlay(playGlassTap), [safePlay])
    const resonance = useCallback(() => safePlay(playResonance), [safePlay])
    const startAmbient = useCallback(() => safePlay(startAmbientDrone), [safePlay])
    const stopAmbient = useCallback(() => stopAmbientDrone(), [])

    return (
        <SoundContext.Provider value={{
            isMuted, toggleMute,
            ping, tick, pop, whoosh, knock, chime,
            shimmer, glassTap, resonance, startAmbient, stopAmbient
        }}>
            {children}
        </SoundContext.Provider>
    )
}
