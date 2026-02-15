'use client'

/**
 * ═══════════════════════════════════════════════════════════
 *  CRYSTAL CLEAR SOUND ENGINE v2
 *  SIN VUELTAS — Dopaministic Design System
 * ═══════════════════════════════════════════════════════════
 *
 *  v2 Improvements:
 *  - Throttled: same sound won't fire twice within cooldown
 *  - GC: oscillators disconnect after playback (prevents node leak)
 *  - Master gain node: central volume control
 *  - Compressor: prevents clipping when multiple sounds layer
 *  - Chime: new 6th sound — musical confirmation (maj 3rd interval)
 */

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let compressor: DynamicsCompressorNode | null = null

// Cooldowns to throttle rapid-fire sounds
const cooldowns: Record<string, number> = {}
const COOLDOWN_MS: Record<string, number> = {
    ping: 200,
    tick: 50,
    pop: 80,
    whoosh: 400,
    knock: 200,
    chime: 300,
}

function throttle(name: string): boolean {
    const now = performance.now()
    const last = cooldowns[name] || 0
    const cd = COOLDOWN_MS[name] || 100
    if (now - last < cd) return false
    cooldowns[name] = now
    return true
}

function getCtx(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext()
        compressor = audioCtx.createDynamicsCompressor()
        compressor.threshold.value = -24
        compressor.knee.value = 30
        compressor.ratio.value = 12
        compressor.attack.value = 0.003
        compressor.release.value = 0.25
        masterGain = audioCtx.createGain()
        masterGain.gain.value = 0.8
        masterGain.connect(compressor)
        compressor.connect(audioCtx.destination)
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()
    return audioCtx
}

function getMaster(): GainNode {
    getCtx()
    return masterGain!
}

/** Auto-cleanup: disconnect nodes after duration */
function scheduleCleanup(nodes: AudioNode[], ctx: AudioContext, duration: number) {
    setTimeout(() => {
        nodes.forEach(n => {
            try { n.disconnect() } catch { /* already disconnected */ }
        })
    }, duration * 1000 + 100)
}

/**
 * PING — Crystalline success chime
 * Dual sine (880→1320Hz + harmonic shimmer)
 */
export function playPing() {
    if (!throttle('ping')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now)
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.06)

    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1760, now)
    osc2.frequency.exponentialRampToValueAtTime(2200, now + 0.06)
    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0.04, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc1.connect(gain).connect(out)
    osc2.connect(gain2).connect(out)

    osc1.start(now); osc1.stop(now + 0.4)
    osc2.start(now); osc2.stop(now + 0.3)

    scheduleCleanup([osc1, osc2, gain, gain2], ctx, 0.4)
}

/**
 * TICK — Micro-click for hovers
 * 15ms shaped noise through tight bandpass
 */
export function playTick() {
    if (!throttle('tick')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    const bufferSize = Math.ceil(ctx.sampleRate * 0.015)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15))
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 3000
    filter.Q.value = 2.5

    const gain = ctx.createGain()
    gain.gain.value = 0.06

    source.connect(filter).connect(gain).connect(out)
    source.start(now)

    scheduleCleanup([source, filter, gain], ctx, 0.02)
}

/**
 * POP — Bubbly card interaction
 * Sine 400→800Hz pitch bend
 */
export function playPop() {
    if (!throttle('pop')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1)

    osc.connect(gain).connect(out)
    osc.start(now); osc.stop(now + 0.15)

    scheduleCleanup([osc, gain], ctx, 0.15)
}

/**
 * WHOOSH — Section entrance sweep
 * Bell-shaped noise with sweeping bandpass
 */
export function playWhoosh() {
    if (!throttle('whoosh')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    const bufferSize = Math.ceil(ctx.sampleRate * 0.25)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize
        data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(200, now)
    filter.frequency.exponentialRampToValueAtTime(4000, now + 0.2)
    filter.Q.value = 1.5

    const gain = ctx.createGain()
    gain.gain.value = 0.04

    source.connect(filter).connect(gain).connect(out)
    source.start(now)

    scheduleCleanup([source, filter, gain], ctx, 0.3)
}

/**
 * KNOCK — Error/block feedback
 * Triangle 150→80Hz, dead dry
 */
export function playKnock() {
    if (!throttle('knock')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.06)

    osc.connect(gain).connect(out)
    osc.start(now); osc.stop(now + 0.1)

    scheduleCleanup([osc, gain], ctx, 0.1)
}

/**
 * CHIME — Musical confirmation (NEW)
 * Major 3rd interval (C5 + E5) → warm, musical achievement sound
 * Used for completing milestones, toggling features
 */
export function playChime() {
    if (!throttle('chime')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    const notes = [523.25, 659.25] // C5, E5 — major 3rd
    const nodes: AudioNode[] = []

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.07) // slight arpeggio

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0, now + i * 0.07)
        gain.gain.linearRampToValueAtTime(0.07, now + i * 0.07 + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

        osc.connect(gain).connect(out)
        osc.start(now + i * 0.07)
        osc.stop(now + 0.6)

        nodes.push(osc, gain)
    })

    scheduleCleanup(nodes, ctx, 0.6)
}
