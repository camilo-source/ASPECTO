'use client'

/**
 * ═══════════════════════════════════════════════════════════
 *  CRYSTAL CLEAR SOUND ENGINE v3
 *  SIN VUELTAS — Dopaministic Design System
 * ═══════════════════════════════════════════════════════════
 *
 *  v3 — Immersive Edition:
 *  - Shared synthetic reverb (ConvolverNode) for spatial depth
 *  - New sounds: shimmer, glassTap, resonance, ambientDrone
 *  - Upgraded: ping +3rd harmonic, whoosh stereo pan, chime full triad
 *  - Sub-perceptual ambient drone for atmosphere
 *  - All sounds auto-cleanup (GC-safe)
 */

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let compressor: DynamicsCompressorNode | null = null
let reverbNode: ConvolverNode | null = null
let reverbGain: GainNode | null = null
let dryGain: GainNode | null = null
let ambientOsc1: OscillatorNode | null = null
let ambientOsc2: OscillatorNode | null = null
let ambientGainNode: GainNode | null = null
let ambientRunning = false

// Cooldowns to throttle rapid-fire sounds
const cooldowns: Record<string, number> = {}
const COOLDOWN_MS: Record<string, number> = {
    ping: 200,
    tick: 50,
    pop: 80,
    whoosh: 400,
    knock: 200,
    chime: 300,
    shimmer: 300,
    glassTap: 100,
    resonance: 500,
}

function throttle(name: string): boolean {
    const now = performance.now()
    const last = cooldowns[name] || 0
    const cd = COOLDOWN_MS[name] || 100
    if (now - last < cd) return false
    cooldowns[name] = now
    return true
}

/** Create a synthetic impulse response for reverb */
function createReverbIR(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
    const length = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch)
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
        }
    }
    return buffer
}

function getCtx(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext()

        // Compressor → prevents clipping
        compressor = audioCtx.createDynamicsCompressor()
        compressor.threshold.value = -24
        compressor.knee.value = 30
        compressor.ratio.value = 12
        compressor.attack.value = 0.003
        compressor.release.value = 0.25

        // Master gain
        masterGain = audioCtx.createGain()
        masterGain.gain.value = 0.8

        // Dry path (70% dry)
        dryGain = audioCtx.createGain()
        dryGain.gain.value = 0.7

        // Reverb path (30% wet)
        reverbNode = audioCtx.createConvolver()
        reverbNode.buffer = createReverbIR(audioCtx, 0.4, 2.5)
        reverbGain = audioCtx.createGain()
        reverbGain.gain.value = 0.3

        // Routing: master → dry → compressor → dest
        //          master → reverb → reverbGain → compressor
        masterGain.connect(dryGain)
        dryGain.connect(compressor)
        masterGain.connect(reverbNode)
        reverbNode.connect(reverbGain)
        reverbGain.connect(compressor)
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
function scheduleCleanup(nodes: AudioNode[], duration: number) {
    setTimeout(() => {
        nodes.forEach(n => {
            try { n.disconnect() } catch { /* already disconnected */ }
        })
    }, duration * 1000 + 100)
}

/**
 * PING — Crystalline success chime (v3: +3rd harmonic G5 for major triad feel)
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

    // Root (A5)
    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now)
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.06)

    // Harmonic shimmer (A6)
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1760, now)
    osc2.frequency.exponentialRampToValueAtTime(2200, now + 0.06)
    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0.04, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    // 3rd harmonic — G5 for richness (NEW in v3)
    const osc3 = ctx.createOscillator()
    osc3.type = 'sine'
    osc3.frequency.setValueAtTime(1568, now) // G6
    const gain3 = ctx.createGain()
    gain3.gain.setValueAtTime(0.025, now)
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc1.connect(gain).connect(out)
    osc2.connect(gain2).connect(out)
    osc3.connect(gain3).connect(out)

    osc1.start(now); osc1.stop(now + 0.4)
    osc2.start(now); osc2.stop(now + 0.3)
    osc3.start(now); osc3.stop(now + 0.35)

    scheduleCleanup([osc1, osc2, osc3, gain, gain2, gain3], 0.4)
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

    scheduleCleanup([source, filter, gain], 0.02)
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

    scheduleCleanup([osc, gain], 0.15)
}

/**
 * WHOOSH — Section entrance sweep (v3: stereo pan L→R)
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

    // Stereo sweep L→R (NEW in v3)
    const panner = ctx.createStereoPanner()
    panner.pan.setValueAtTime(-0.8, now)
    panner.pan.linearRampToValueAtTime(0.8, now + 0.2)

    const gain = ctx.createGain()
    gain.gain.value = 0.04

    source.connect(filter).connect(panner).connect(gain).connect(out)
    source.start(now)

    scheduleCleanup([source, filter, panner, gain], 0.3)
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

    scheduleCleanup([osc, gain], 0.1)
}

/**
 * CHIME — Musical confirmation (v3: full major triad C5+E5+G5 with reverb tail)
 */
export function playChime() {
    if (!throttle('chime')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    const notes = [523.25, 659.25, 783.99] // C5, E5, G5 — full major triad
    const nodes: AudioNode[] = []

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.06)

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0, now + i * 0.06)
        gain.gain.linearRampToValueAtTime(0.06, now + i * 0.06 + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

        osc.connect(gain).connect(out)
        osc.start(now + i * 0.06)
        osc.stop(now + 0.8)

        nodes.push(osc, gain)
    })

    scheduleCleanup(nodes, 0.8)
}

/**
 * SHIMMER — Iridescent sparkle for scroll reveals (NEW in v3)
 * Multiple detuned high-frequency sines creating glass-catching-light effect
 */
export function playShimmer() {
    if (!throttle('shimmer')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    const frequencies = [2637, 2793, 3136, 3520] // E7, F7, G7, A7
    const nodes: AudioNode[] = []

    frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq + (Math.random() * 20 - 10), now) // slight random detune

        const gain = ctx.createGain()
        const offset = i * 0.03
        gain.gain.setValueAtTime(0, now + offset)
        gain.gain.linearRampToValueAtTime(0.015, now + offset + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

        osc.connect(gain).connect(out)
        osc.start(now + offset)
        osc.stop(now + 0.5)

        nodes.push(osc, gain)
    })

    scheduleCleanup(nodes, 0.5)
}

/**
 * GLASS TAP — Short resonant tap like tapping thick glass (NEW in v3)
 * High sine with filtered noise body + resonant decay
 */
export function playGlassTap() {
    if (!throttle('glassTap')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    // Resonant sine body
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(2400, now)
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.08)

    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.08, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    // Noise transient (impact)
    const bufSize = Math.ceil(ctx.sampleRate * 0.008)
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
        d[i] = (Math.random() * 2 - 1) * (1 - i / bufSize)
    }
    const noiseSrc = ctx.createBufferSource()
    noiseSrc.buffer = buf

    const hpf = ctx.createBiquadFilter()
    hpf.type = 'highpass'
    hpf.frequency.value = 5000

    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.04

    osc.connect(oscGain).connect(out)
    noiseSrc.connect(hpf).connect(noiseGain).connect(out)

    osc.start(now); osc.stop(now + 0.15)
    noiseSrc.start(now)

    scheduleCleanup([osc, oscGain, noiseSrc, hpf, noiseGain], 0.15)
}

/**
 * RESONANCE — Deep warm hum for CTA hover (NEW in v3)
 * Low sine (220Hz) with slow vibrato, like a crystal bowl
 */
export function playResonance() {
    if (!throttle('resonance')) return
    const ctx = getCtx()
    const out = getMaster()
    const now = ctx.currentTime

    // Main tone (A3)
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, now)

    // Vibrato LFO
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 5 // 5Hz vibrato
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 3 // ±3Hz modulation
    lfo.connect(lfoGain).connect(osc.frequency)

    // Harmonic (octave above, quiet)
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(440, now)
    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0.02, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.06, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain).connect(out)
    osc2.connect(gain2).connect(out)

    lfo.start(now); osc.start(now); osc2.start(now)
    lfo.stop(now + 0.7); osc.stop(now + 0.7); osc2.stop(now + 0.6)

    scheduleCleanup([osc, osc2, lfo, lfoGain, gain, gain2], 0.7)
}

/**
 * AMBIENT DRONE — Sub-perceptual atmosphere (NEW in v3)
 * Ultra-quiet 40Hz + 80Hz filtered sines that create a subliminal "presence"
 * Called once, runs continuously until stopped
 */
export function startAmbientDrone() {
    if (ambientRunning) return
    const ctx = getCtx()
    ambientRunning = true

    ambientGainNode = ctx.createGain()
    ambientGainNode.gain.setValueAtTime(0, ctx.currentTime)
    ambientGainNode.gain.linearRampToValueAtTime(0.012, ctx.currentTime + 2) // fade in over 2s

    // Sub bass (40Hz)
    ambientOsc1 = ctx.createOscillator()
    ambientOsc1.type = 'sine'
    ambientOsc1.frequency.value = 40

    // Low harmonic (80Hz)
    ambientOsc2 = ctx.createOscillator()
    ambientOsc2.type = 'sine'
    ambientOsc2.frequency.value = 80
    const harmGain = ctx.createGain()
    harmGain.gain.value = 0.5

    // Gentle filter to soften
    const lpf = ctx.createBiquadFilter()
    lpf.type = 'lowpass'
    lpf.frequency.value = 120
    lpf.Q.value = 0.7

    ambientOsc1.connect(ambientGainNode)
    ambientOsc2.connect(harmGain).connect(ambientGainNode)
    ambientGainNode.connect(lpf).connect(masterGain!)

    ambientOsc1.start()
    ambientOsc2.start()
}

export function stopAmbientDrone() {
    if (!ambientRunning || !audioCtx) return
    const now = audioCtx.currentTime
    if (ambientGainNode) {
        ambientGainNode.gain.linearRampToValueAtTime(0, now + 1)
    }
    setTimeout(() => {
        try { ambientOsc1?.stop(); ambientOsc1?.disconnect() } catch { /* ok */ }
        try { ambientOsc2?.stop(); ambientOsc2?.disconnect() } catch { /* ok */ }
        try { ambientGainNode?.disconnect() } catch { /* ok */ }
        ambientRunning = false
        ambientOsc1 = null
        ambientOsc2 = null
        ambientGainNode = null
    }, 1200)
}
