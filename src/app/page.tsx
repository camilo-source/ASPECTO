'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

/* ══════════════════════════════════════════════════════════
   PARTICLE FIELD — Animated network of emerald/purple particles
   ══════════════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let animationId: number
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number }[] = []
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.35 + 0.08,
        hue: Math.random() > 0.6 ? 260 : Math.random() > 0.3 ? 155 : 185, // purple, emerald, or cyan
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = window.innerWidth
        if (p.x > window.innerWidth) p.x = 0
        if (p.y < 0) p.y = window.innerHeight
        if (p.y > window.innerHeight) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha})`
        ctx.fill()
      }
      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            const mixHue = (particles[i].hue + particles[j].hue) / 2
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `hsla(${mixHue}, 60%, 55%, ${0.05 * (1 - dist / 130)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animationId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

/* ══════════════════════════════════════════════════════════
   MOUSE GLOW — Radial spotlight that follows the cursor
   ══════════════════════════════════════════════════════════ */
function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let rafId: number
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const animate = () => {
      // Smooth follow with easing
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(600px circle at ${currentX}px ${currentY}px, rgba(52,211,153,0.06), rgba(139,92,246,0.03) 40%, transparent 70%)`
      }
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <div ref={glowRef} className="fixed inset-0 pointer-events-none z-[2] transition-none" />
}

/* ══════════════════════════════════════════════════════════
   ANIMATED NUMBER — IntersectionObserver count-up
   ══════════════════════════════════════════════════════════ */
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1400
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // "Apple curve" spring easing
            const eased = 1 - Math.pow(1 - progress, 4)
            setDisplay(Math.round(eased * value))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="font-[family-name:var(--font-geist-mono)] tabular-nums">
      {display.toLocaleString()}{suffix}
    </span>
  )
}

/* ══════════════════════════════════════════════════════════
   FEATURE CARD — Per-card accent color with glow on hover
   ══════════════════════════════════════════════════════════ */
function FeatureCard({ icon, title, desc, delay, accentColor, accentRgb }: {
  icon: React.ReactNode
  title: string
  desc: string
  delay: string
  accentColor: string
  accentRgb: string
}) {
  return (
    <div
      className="glass rounded-3xl p-7 group cursor-default
        transition-all duration-500 animate-[fadeUp_0.6s_ease-out_both]"
      style={{
        animationDelay: delay,
        transitionTimingFunction: 'var(--ease-spring)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.boxShadow = `0 0 40px rgba(${accentRgb}, 0.12), 0 8px 32px rgba(0,0,0,0.3)`
        el.style.borderColor = `rgba(${accentRgb}, 0.25)`
        el.style.transform = 'scale(1.03) translateY(-4px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.boxShadow = ''
        el.style.borderColor = ''
        el.style.transform = ''
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500"
        style={{
          backgroundColor: `rgba(${accentRgb}, 0.1)`,
          color: accentColor,
        }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ICONS — SVG inline icons
   ══════════════════════════════════════════════════════════ */
const Icons = {
  sparkles: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 1v4M11 17v4M1 11h4M17 11h4M4 4l2.8 2.8M15.2 15.2l2.8 2.8M4 18l2.8-2.8M15.2 6.8L18 4" />
    </svg>
  ),
  layers: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 1L1 6l10 5 10-5-10-5z" /><path d="M1 16l10 5 10-5" /><path d="M1 11l10 5 10-5" />
    </svg>
  ),
  zap: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 1L4 12h5l-1 9 9-11h-5l1-9z" />
    </svg>
  ),
  palette: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="10" /><circle cx="8" cy="8" r="1.5" fill="currentColor" /><circle cx="14" cy="8" r="1.5" fill="currentColor" /><circle cx="8" cy="14" r="1.5" fill="currentColor" />
    </svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2L3 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6L11 2z" />
    </svg>
  ),
  globe: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="10" /><path d="M1 11h20" /><path d="M11 1a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 11 1z" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  ),
}

/* ══════════════════════════════════════════════════════════
   STAT ITEM — Number with accent color glow
   ══════════════════════════════════════════════════════════ */
function StatItem({ value, suffix, label, accentColor, delay }: {
  value: number; suffix: string; label: string; accentColor: string; delay: string
}) {
  return (
    <div className="animate-[fadeUp_0.6s_ease-out_both]" style={{ animationDelay: delay }}>
      <p className="text-4xl md:text-5xl font-bold text-white mb-1"
        style={{ textShadow: `0 0 30px ${accentColor}40, 0 0 60px ${accentColor}15` }}>
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="relative min-h-screen bg-void overflow-hidden font-[family-name:var(--font-geist-sans)] film-grain">
      <ParticleField />
      <MouseGlow />

      {/* ═══ Ambient Glows ═══ */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] bg-neon-emerald/[0.04] rounded-full blur-[160px] animate-[breathe_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-cosmic-purple/[0.06] rounded-full blur-[140px] animate-[breathe_12s_ease-in-out_infinite_3s]" />
        <div className="absolute top-[50%] left-[60%] w-[400px] h-[400px] bg-cosmic-pink/[0.03] rounded-full blur-[120px] animate-[breathe_14s_ease-in-out_infinite_6s]" />
      </div>

      {/* ═══ Floating Nav ═══ */}
      <nav className="fixed top-5 left-5 right-5 z-50 animate-[slideDown_0.5s_ease-out]">
        <div className="glass-strong max-w-6xl mx-auto rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg tracking-[-0.03em] hover:text-neon-emerald transition-colors duration-300">
            SIN VUELTAS
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/components"
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}>
              Components
            </Link>
            <Link href="/dashboard"
              className="px-4 py-2 text-sm font-medium bg-neon-emerald/10 text-neon-emerald rounded-xl border border-neon-emerald/20
                hover:bg-neon-emerald/20 hover:border-neon-emerald/40 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]
                transition-all duration-300">
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ Hero Section ═══ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-28 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge — animated gradient border */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium mb-8
            animate-[fadeUp_0.5s_ease-out_0.1s_both] gradient-border-animated glass"
            style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2 h-2 rounded-full bg-neon-emerald animate-[pulse-ring_2s_ease-in-out_infinite]" />
            Dopaministic Design System v2
          </div>

          {/* Title — fixed iridescent text */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-[-0.06em] text-white mb-6 leading-[0.9]
            animate-[fadeUp_0.6s_ease-out_0.2s_both]">
            SIN VUELTAS
            <br />
            <span className="text-iridescent">SCENE</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-[fadeUp_0.6s_ease-out_0.35s_both]"
            style={{ color: 'var(--text-secondary)' }}>
            Liquid glass. Deep void. Iridescent intelligence.
            <br className="hidden md:block" />
            A <span className="text-neon-emerald font-medium">dopamine-driven</span> design system for interfaces that <em className="text-cosmic-purple">feel</em> alive.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 items-center justify-center flex-col sm:flex-row animate-[fadeUp_0.6s_ease-out_0.5s_both]">
            <Link href="/components"
              className="group relative px-10 py-4 bg-neon-emerald text-void font-bold text-lg rounded-full cursor-pointer
                shadow-[0_0_30px_rgba(52,211,153,0.4),0_0_80px_rgba(52,211,153,0.15)]
                hover:shadow-[0_0_50px_rgba(52,211,153,0.6),0_0_100px_rgba(52,211,153,0.25)]
                active:scale-[0.97] transition-all duration-300"
              style={{ transitionTimingFunction: 'var(--ease-spring)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = '' }}>
              <span className="relative z-10 flex items-center gap-2">Explore Components {Icons.arrow}</span>
              <div className="absolute inset-0 bg-neon-emerald rounded-full opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500" />
            </Link>

            <Link href="/dashboard"
              className="px-10 py-4 border border-white/15 text-white bg-white/5 rounded-full text-lg font-medium
                hover:bg-white/10 hover:border-white/25 backdrop-blur-xl
                active:scale-[0.97] transition-all duration-300 cursor-pointer"
              style={{ transitionTimingFunction: 'var(--ease-spring)' }}>
              Dashboard Demo
            </Link>
          </div>
        </div>

        {/* Scroll indicator with glow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-[float_3s_ease-in-out_infinite]">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2
            shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            <div className="w-1 h-2.5 rounded-full bg-neon-emerald/60 animate-[fadeUp_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══ Stats Bar — with per-stat glow ═══ */}
      <section className="relative z-10 py-16 border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value={35} suffix="+" label="Agent Skills" accentColor="#34d399" delay="0.8s" />
            <StatItem value={50} suffix="+" label="Design Styles" accentColor="#06b6d4" delay="0.9s" />
            <StatItem value={97} suffix="" label="Color Palettes" accentColor="#8b5cf6" delay="1.0s" />
            <StatItem value={9} suffix="" label="Tech Stacks" accentColor="#ec4899" delay="1.1s" />
          </div>
        </div>
      </section>

      {/* ═══ Features Grid — per-card accents ═══ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] text-white mb-4 animate-[fadeUp_0.6s_ease-out_1s_both]">
              Built for <span className="text-iridescent">premium</span> interfaces
            </h2>
            <p className="text-lg max-w-xl mx-auto animate-[fadeUp_0.6s_ease-out_1.1s_both]"
              style={{ color: 'var(--text-secondary)' }}>
              Every pixel engineered for dopamine. Every interaction designed to delight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={Icons.sparkles} delay="1.2s"
              title="AI-Powered Design"
              desc="Iridescent gradients and cosmic purple accents signal AI intelligence throughout the system."
              accentColor="#8b5cf6" accentRgb="139,92,246"
            />
            <FeatureCard
              icon={Icons.layers} delay="1.3s"
              title="Liquid Glass"
              desc="Multi-layered frosted glass surfaces with adaptive blur and adaptive opacity for depth."
              accentColor="#06b6d4" accentRgb="6,182,212"
            />
            <FeatureCard
              icon={Icons.zap} delay="1.4s"
              title="Micro-Interactions"
              desc="Neon halo hovers, spring animations, and glow pulses that make every action feel rewarding."
              accentColor="#34d399" accentRgb="52,211,153"
            />
            <FeatureCard
              icon={Icons.palette} delay="1.5s"
              title="Adaptive Theming"
              desc="Dark and light modes with carefully tuned contrast ratios and semantic color variables."
              accentColor="#ec4899" accentRgb="236,72,153"
            />
            <FeatureCard
              icon={Icons.shield} delay="1.6s"
              title="Accessible by Default"
              desc="WCAG-compliant contrast, focus rings, aria-labels, and prefers-reduced-motion support."
              accentColor="#34d399" accentRgb="52,211,153"
            />
            <FeatureCard
              icon={Icons.globe} delay="1.7s"
              title="Production-Ready"
              desc="Next.js 16 App Router, React 19, Tailwind v4 — ready to deploy to Vercel."
              accentColor="#8b5cf6" accentRgb="139,92,246"
            />
          </div>
        </div>
      </section>

      {/* ═══ CTA Section — animated gradient border ═══ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-strong rounded-[32px] p-12 md:p-16 relative overflow-hidden gradient-border-animated">
            {/* Background iridescent wash */}
            <div className="absolute inset-0 gradient-iridescent-subtle opacity-20 pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.03em] mb-4 relative z-10">
              Ready to explore the <span className="text-iridescent">void</span>?
            </h2>
            <p className="text-base mb-8 relative z-10" style={{ color: 'var(--text-secondary)' }}>
              Dive into the component lab and experience every element of the design system.
            </p>
            <div className="flex gap-3 justify-center flex-col sm:flex-row relative z-10">
              <Link href="/components"
                className="group relative px-8 py-3.5 bg-neon-emerald text-void font-bold rounded-full cursor-pointer
                  shadow-[0_0_25px_rgba(52,211,153,0.3)]
                  hover:shadow-[0_0_40px_rgba(52,211,153,0.5)]
                  active:scale-[0.97] transition-all duration-300"
                style={{ transitionTimingFunction: 'var(--ease-spring)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = '' }}>
                <span className="relative z-10 flex items-center gap-2">Component Lab {Icons.arrow}</span>
              </Link>
              <Link href="/dashboard"
                className="px-8 py-3.5 border border-white/15 text-white rounded-full font-medium
                  hover:bg-white/10 hover:border-white/25
                  active:scale-[0.97] transition-all duration-300 cursor-pointer"
                style={{ transitionTimingFunction: 'var(--ease-spring)' }}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="relative z-10 py-8 px-6">
        {/* Gradient separator line */}
        <div className="max-w-6xl mx-auto mb-8 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.2), rgba(139,92,246,0.2), transparent)' }} />
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 SIN VUELTAS. Dopaministic Design.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Powered by</span>
            <span className="text-xs text-neon-emerald font-medium">Next.js + Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
