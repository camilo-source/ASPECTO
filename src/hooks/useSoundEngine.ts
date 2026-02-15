'use client'

/**
 * ═══════════════════════════════════════════════════════════
 *  CRYSTAL CLEAR SOUND ENGINE
 *  SIN VUELTAS — Dopaministic Design System
 * ═══════════════════════════════════════════════════════════
 *
 *  5 procedurally-synthesized sounds using raw Web Audio API.
 *  No external audio files. No dependencies. Pure oscillators.
 *
 *  Brand DNA:
 *  - Ping:  "Crystalline, high-pitched, short reverb"  → success/CTA
 *  - Tick:  "Almost imperceptible click"                → hover/nav
 *  - Pop:   "Light, bubbly"                             → card interaction
 *  - Whoosh: "Subtle wind, directional"                 → section enter
 *  - Knock: "Deep, soft, dry"                           → error/block
 */

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume()
    }
    return audioCtx
}

/**
 * PING — Crystalline success chime
 * Two sine waves (880Hz + 1320Hz) with quick attack, medium decay
 * Slight detuning creates a shimmering, crystal-like quality
 */
export function playPing() {
    const ctx = getCtx()
    const now = ctx.currentTime

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.008) // fast attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35) // medium tail

    // Primary tone — pure, high
    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now)
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.06) // pitch bend up

    // Harmonic shimmer — slightly detuned
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1760, now)
    osc2.frequency.exponentialRampToValueAtTime(2200, now + 0.06)
    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0.04, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc1.connect(gain).connect(ctx.destination)
    osc2.connect(gain2).connect(ctx.destination)

    osc1.start(now)
    osc1.stop(now + 0.4)
    osc2.start(now)
    osc2.stop(now + 0.3)
}

/**
 * TICK — Micro-click for hovers
 * Extremely short noise burst through tight band-pass filter
 * Simulates the click of a physical button, barely perceptible
 */
export function playTick() {
    const ctx = getCtx()
    const now = ctx.currentTime

    const bufferSize = ctx.sampleRate * 0.015 // 15ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
        // Shaped noise — exponential decay
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15))
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Tight band-pass for "click" character
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 3000
    filter.Q.value = 2.5

    const gain = ctx.createGain()
    gain.gain.value = 0.06 // very subtle

    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start(now)
}

/**
 * POP — Bubbly card interaction
 * Quick sine with fast pitch bend up, like a bubble surfacing
 */
export function playPop() {
    const ctx = getCtx()
    const now = ctx.currentTime

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04) // pitch bend up = "pop"
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1)  // settle

    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)
}

/**
 * WHOOSH — Section entrance sweep
 * Filtered noise with sweeping band-pass (low → high)
 * Creates a sense of spatial movement
 */
export function playWhoosh() {
    const ctx = getCtx()
    const now = ctx.currentTime

    const bufferSize = ctx.sampleRate * 0.25 // 250ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
        // Shaped noise with smooth envelope
        const t = i / bufferSize
        const envelope = Math.sin(t * Math.PI) // bell curve shape
        data[i] = (Math.random() * 2 - 1) * envelope
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Sweeping filter — low to high creates "whoosh" directionality
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(200, now)
    filter.frequency.exponentialRampToValueAtTime(4000, now + 0.2)
    filter.Q.value = 1.5

    const gain = ctx.createGain()
    gain.gain.value = 0.04 // subtle

    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start(now)
}

/**
 * KNOCK — Error/block feedback
 * Deep triangle wave, short and dry
 * "Like a knuckle on wood" — solid, not alarming
 */
export function playKnock() {
    const ctx = getCtx()
    const now = ctx.currentTime

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08) // very dry, short

    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.06) // pitch drops = "knock"

    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.1)
}
