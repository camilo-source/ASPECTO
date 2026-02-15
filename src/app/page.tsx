'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useSound } from '@/components/SoundProvider'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR — Iridescent glow bar at top of page
   ══════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      if (!barRef.current) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      barRef.current.style.transform = `scaleX(${progress})`
    }

    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
      <div
        ref={barRef}
        className="h-full origin-left will-change-transform"
        style={{
          background: 'linear-gradient(90deg, #34d399, #06b6d4, #8b5cf6, #ec4899)',
          transform: 'scaleX(0)',
          boxShadow: '0 0 12px rgba(52,211,153,0.5), 0 0 30px rgba(139,92,246,0.3)',
        }}
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   PARTICLE FIELD — Network of emerald/purple/cyan particles
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
    let mouseX = -1000, mouseY = -1000

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    // Track mouse for particle attraction
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    window.addEventListener('mousemove', onMouse)

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number; baseAlpha: number }
    const particles: Particle[] = []
    for (let i = 0; i < 80; i++) {
      const baseAlpha = Math.random() * 0.3 + 0.08
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 2.5 + 0.5,
        alpha: baseAlpha,
        baseAlpha,
        hue: [155, 185, 260, 330][Math.floor(Math.random() * 4)], // emerald, cyan, purple, pink
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const p of particles) {
        // Mouse attraction — particles gently gravitate toward cursor
        const dxm = mouseX - p.x
        const dym = mouseY - p.y
        const distMouse = Math.sqrt(dxm * dxm + dym * dym)
        if (distMouse < 300) {
          const force = (300 - distMouse) / 300 * 0.003
          p.vx += dxm * force
          p.vy += dym * force
          // Brighten near cursor
          p.alpha = p.baseAlpha + (1 - distMouse / 300) * 0.3
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05
        }

        // Damping
        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        // Wrap
        if (p.x < -10) p.x = window.innerWidth + 10
        if (p.x > window.innerWidth + 10) p.x = -10
        if (p.y < -10) p.y = window.innerHeight + 10
        if (p.y > window.innerHeight + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha})`
        ctx.fill()
      }
      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            const mixHue = (particles[i].hue + particles[j].hue) / 2
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `hsla(${mixHue}, 60%, 55%, ${0.06 * (1 - dist / 140)})`
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
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

/* ══════════════════════════════════════════════════════════
   MOUSE GLOW — Radial spotlight that follows cursor
   ══════════════════════════════════════════════════════════ */
function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let rafId: number
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0

    const handleMove = (e: MouseEvent) => { targetX = e.clientX; targetY = e.clientY }

    const animate = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(600px circle at ${currentX}px ${currentY}px, rgba(52,211,153,0.07), rgba(139,92,246,0.04) 40%, transparent 70%)`
      }
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMove)
    animate()

    return () => { window.removeEventListener('mousemove', handleMove); cancelAnimationFrame(rafId) }
  }, [])

  return <div ref={glowRef} className="fixed inset-0 pointer-events-none z-[2]" />
}

/* ══════════════════════════════════════════════════════════
   TYPEWRITER TEXT — Letters reveal one by one
   ══════════════════════════════════════════════════════════ */
function TypewriterText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !revealed) {
        setRevealed(true)
        observer.disconnect()
      }
    }, { threshold: 0.5 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [revealed])

  return (
    <span ref={ref} className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 0.05s ease ${delay + i * 0.03}s, transform 0.1s ease ${delay + i * 0.03}s`,
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}

/* ══════════════════════════════════════════════════════════
   MAGNETIC BUTTON — Pulls toward cursor when near
   ══════════════════════════════════════════════════════════ */
function MagneticButton({ children, href, className = '', onClickSound }: {
  children: React.ReactNode; href: string; className?: string; onClickSound?: () => void
}) {
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * 0.15
    const deltaY = (e.clientY - centerY) * 0.15
    el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.04)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
  }, [])

  const handleMouseDown = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'scale(0.95)'
    onClickSound?.()
  }, [onClickSound])

  const handleMouseUp = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
  }, [])

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      style={{ transitionTimingFunction: 'var(--ease-spring)', transition: 'transform 0.4s var(--ease-spring), box-shadow 0.3s ease' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </Link>
  )
}

/* ══════════════════════════════════════════════════════════
   ANIMATED NUMBER — Scroll-triggered count-up
   ══════════════════════════════════════════════════════════ */
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const duration = 1400
        const startTime = performance.now()
        const tick = (now: number) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)
          setDisplay(Math.round(eased * value))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
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
   FEATURE CARD — Hover lift + accent glow + sound
   ══════════════════════════════════════════════════════════ */
function FeatureCard({ icon, title, desc, accentColor, accentRgb, index }: {
  icon: React.ReactNode; title: string; desc: string
  accentColor: string; accentRgb: string; index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { pop } = useSound()
  const hasPopped = useRef(false)

  return (
    <div
      ref={cardRef}
      className="sv-feature-card glass rounded-3xl p-7 group cursor-default transition-all duration-500 opacity-0 translate-y-8"
      style={{ transitionTimingFunction: 'var(--ease-spring)' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.boxShadow = `0 0 50px rgba(${accentRgb}, 0.15), 0 8px 32px rgba(0,0,0,0.3)`
        el.style.borderColor = `rgba(${accentRgb}, 0.3)`
        el.style.transform = 'scale(1.03) translateY(-6px)'
        if (!hasPopped.current) { pop(); hasPopped.current = true }
        else { pop() }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.boxShadow = ''
        el.style.borderColor = ''
        el.style.transform = ''
        hasPopped.current = false
      }}
    >
      {/* RGB Glitch on card — subtle chromatic aberration on hover */}
      <div className="relative">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500
            group-hover:shadow-[0_0_25px_var(--glow)]"
          style={{
            backgroundColor: `rgba(${accentRgb}, 0.1)`,
            color: accentColor,
            // @ts-ignore
            '--glow': `rgba(${accentRgb}, 0.4)`,
          } as React.CSSProperties}
        >
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SOUND TOGGLE BUTTON
   ══════════════════════════════════════════════════════════ */
function SoundToggle() {
  const { isMuted, toggleMute, tick: playTick } = useSound()

  return (
    <button
      onClick={() => { toggleMute(); if (isMuted) playTick() }}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
        hover:bg-white/5 text-[var(--text-tertiary)] hover:text-white"
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      title={isMuted ? 'Turn on sounds' : 'Turn off sounds'}
    >
      {isMuted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  )
}

/* ══════════════════════════════════════════════════════════
   ICONS
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
   HOME PAGE — THE IMMERSIVE EXPERIENCE
   ══════════════════════════════════════════════════════════ */
export default function Home() {
  const { ping, tick, whoosh } = useSound()
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const footerLineRef = useRef<HTMLDivElement>(null)
  const whooshedSections = useRef<Set<string>>(new Set())

  // ── GSAP Scroll Animations ──
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // If reduced motion, just make everything visible
      document.querySelectorAll('.sv-feature-card').forEach(el => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      })
      return
    }

    const triggers: ScrollTrigger[] = []

    // Stats section — staggered counter reveal
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll('.sv-stat-item')
      triggers.push(
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo(statItems,
              { opacity: 0, y: 30, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.7)' }
            )
            if (!whooshedSections.current.has('stats')) {
              whoosh()
              whooshedSections.current.add('stats')
            }
          },
        })
      )
    }

    // Feature cards — cascade from left with stagger
    if (featuresRef.current) {
      const cards = featuresRef.current.querySelectorAll('.sv-feature-card')
      triggers.push(
        ScrollTrigger.create({
          trigger: featuresRef.current,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.fromTo(cards,
              { opacity: 0, y: 40, x: -20, rotateY: 5 },
              {
                opacity: 1, y: 0, x: 0, rotateY: 0,
                duration: 0.8, stagger: 0.1, ease: 'power3.out',
              }
            )
            if (!whooshedSections.current.has('features')) {
              whoosh()
              whooshedSections.current.add('features')
            }
          },
        })
      )
    }

    // CTA card — scale entrance with glow intensification
    if (ctaRef.current) {
      triggers.push(
        ScrollTrigger.create({
          trigger: ctaRef.current,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            gsap.fromTo(ctaRef.current,
              { opacity: 0, scale: 0.92, y: 30 },
              { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }
            )
            if (!whooshedSections.current.has('cta')) {
              whoosh()
              whooshedSections.current.add('cta')
            }
          },
        })
      )
    }

    // Footer gradient line — draw from left to right
    if (footerLineRef.current) {
      gsap.set(footerLineRef.current, { scaleX: 0, transformOrigin: 'left center' })
      triggers.push(
        ScrollTrigger.create({
          trigger: footerLineRef.current,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(footerLineRef.current, { scaleX: 1, duration: 1.2, ease: 'power2.out' })
          },
        })
      )
    }

    // Parallax on ambient glows
    triggers.push(
      ScrollTrigger.create({
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const orbs = document.querySelectorAll('.sv-ambient-orb')
          orbs.forEach((orb, i) => {
            const speed = 0.3 + i * 0.1
              ; (orb as HTMLElement).style.transform = `translateY(${self.progress * -200 * speed}px)`
          })
        },
      })
    )

    return () => { triggers.forEach(t => t.kill()) }
  }, [whoosh])

  return (
    <div className="relative min-h-screen bg-void overflow-hidden font-[family-name:var(--font-geist-sans)] film-grain">
      <ScrollProgress />
      <ParticleField />
      <MouseGlow />

      {/* ═══ Ambient Glows (parallax) ═══ */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="sv-ambient-orb absolute top-[-10%] left-[20%] w-[700px] h-[700px] bg-neon-emerald/[0.04] rounded-full blur-[160px] animate-[breathe_10s_ease-in-out_infinite]" />
        <div className="sv-ambient-orb absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-cosmic-purple/[0.06] rounded-full blur-[140px] animate-[breathe_12s_ease-in-out_infinite_3s]" />
        <div className="sv-ambient-orb absolute top-[50%] left-[60%] w-[400px] h-[400px] bg-cosmic-pink/[0.03] rounded-full blur-[120px] animate-[breathe_14s_ease-in-out_infinite_6s]" />
      </div>

      {/* ═══ Floating Nav with Sound Toggle ═══ */}
      <nav className="fixed top-5 left-5 right-5 z-50 animate-[slideDown_0.5s_ease-out]">
        <div className="glass-strong max-w-6xl mx-auto rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-white font-bold text-lg tracking-[-0.03em] hover:text-neon-emerald transition-colors duration-300"
            onMouseEnter={tick}
          >
            SIN VUELTAS
          </Link>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <Link
              href="/components"
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/5 text-[var(--text-secondary)]"
              onMouseEnter={tick}
            >
              Components
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium bg-neon-emerald/10 text-neon-emerald rounded-xl border border-neon-emerald/20
                hover:bg-neon-emerald/20 hover:border-neon-emerald/40 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]
                transition-all duration-300"
              onMouseEnter={tick}
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ Hero Section ═══ */}
      <section ref={heroRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-28 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium mb-8
            animate-[fadeUp_0.5s_ease-out_0.1s_both] gradient-border-animated glass text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-neon-emerald animate-[pulse-ring_2s_ease-in-out_infinite]" />
            Dopaministic Design System v2
          </div>

          {/* Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-[-0.06em] text-white mb-6 leading-[0.9]
            animate-[fadeUp_0.6s_ease-out_0.2s_both]">
            SIN VUELTAS
            <br />
            <span className="text-iridescent">SCENE</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-[fadeUp_0.6s_ease-out_0.35s_both] text-[var(--text-secondary)]">
            Liquid glass. Deep void. Iridescent intelligence.
            <br className="hidden md:block" />
            A <span className="text-neon-emerald font-medium">dopamine-driven</span> design system for interfaces that{' '}
            <em className="text-cosmic-purple">feel</em> alive.
          </p>

          {/* CTA Buttons — Magnetic */}
          <div className="flex gap-4 items-center justify-center flex-col sm:flex-row animate-[fadeUp_0.6s_ease-out_0.5s_both]">
            <MagneticButton
              href="/components"
              onClickSound={ping}
              className="group relative px-10 py-4 bg-neon-emerald text-void font-bold text-lg rounded-full cursor-pointer
                shadow-[0_0_30px_rgba(52,211,153,0.4),0_0_80px_rgba(52,211,153,0.15)]
                hover:shadow-[0_0_50px_rgba(52,211,153,0.6),0_0_100px_rgba(52,211,153,0.25)]"
            >
              <span className="relative z-10 flex items-center gap-2">Explore Components {Icons.arrow}</span>
              <div className="absolute inset-0 bg-neon-emerald rounded-full opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500" />
            </MagneticButton>

            <MagneticButton
              href="/dashboard"
              onClickSound={ping}
              className="px-10 py-4 border border-white/15 text-white bg-white/5 rounded-full text-lg font-medium
                hover:bg-white/10 hover:border-white/25 backdrop-blur-xl cursor-pointer"
            >
              Dashboard Demo
            </MagneticButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-[float_3s_ease-in-out_infinite]">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2
            shadow-[0_0_15px_rgba(52,211,153,0.15)]">
            <div className="w-1 h-2.5 rounded-full bg-neon-emerald/60 animate-[fadeUp_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══ Stats Bar ═══ */}
      <section ref={statsRef} className="relative z-10 py-16 border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 35, suffix: '+', label: 'Agent Skills', color: '#34d399' },
              { value: 50, suffix: '+', label: 'Design Styles', color: '#06b6d4' },
              { value: 97, suffix: '', label: 'Color Palettes', color: '#8b5cf6' },
              { value: 9, suffix: '', label: 'Tech Stacks', color: '#ec4899' },
            ].map((stat) => (
              <div key={stat.label} className="sv-stat-item opacity-0">
                <p className="text-4xl md:text-5xl font-bold text-white mb-1"
                  style={{ textShadow: `0 0 30px ${stat.color}40, 0 0 60px ${stat.color}15` }}>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm font-medium text-[var(--text-tertiary)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Features Grid ═══ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] text-white mb-4">
              <TypewriterText text="Built for " delay={0} />
              <TypewriterText text="premium" className="text-iridescent" delay={0.3} />
              <TypewriterText text=" interfaces" delay={0.6} />
            </h2>
            <p className="text-lg max-w-xl mx-auto text-[var(--text-secondary)] animate-[fadeUp_0.6s_ease-out_1.1s_both]">
              Every pixel engineered for dopamine. Every interaction designed to delight.
            </p>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard icon={Icons.sparkles} title="AI-Powered Design"
              desc="Iridescent gradients and cosmic purple accents signal AI intelligence throughout the system."
              accentColor="#8b5cf6" accentRgb="139,92,246" index={0} />
            <FeatureCard icon={Icons.layers} title="Liquid Glass"
              desc="Multi-layered frosted glass surfaces with adaptive blur and adaptive opacity for depth."
              accentColor="#06b6d4" accentRgb="6,182,212" index={1} />
            <FeatureCard icon={Icons.zap} title="Micro-Interactions"
              desc="Neon halo hovers, spring animations, and glow pulses that make every action feel rewarding."
              accentColor="#34d399" accentRgb="52,211,153" index={2} />
            <FeatureCard icon={Icons.palette} title="Adaptive Theming"
              desc="Dark and light modes with carefully tuned contrast ratios and semantic color variables."
              accentColor="#ec4899" accentRgb="236,72,153" index={3} />
            <FeatureCard icon={Icons.shield} title="Accessible by Default"
              desc="WCAG-compliant contrast, focus rings, aria-labels, and prefers-reduced-motion support."
              accentColor="#34d399" accentRgb="52,211,153" index={4} />
            <FeatureCard icon={Icons.globe} title="Production-Ready"
              desc="Next.js 16 App Router, React 19, Tailwind v4 — ready to deploy to Vercel."
              accentColor="#8b5cf6" accentRgb="139,92,246" index={5} />
          </div>
        </div>
      </section>

      {/* ═══ CTA Section ═══ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div ref={ctaRef} className="glass-strong rounded-[32px] p-12 md:p-16 relative overflow-hidden gradient-border-animated opacity-0">
            <div className="absolute inset-0 gradient-iridescent-subtle opacity-20 pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.03em] mb-4 relative z-10">
              Ready to explore the <span className="text-iridescent">void</span>?
            </h2>
            <p className="text-base mb-8 relative z-10 text-[var(--text-secondary)]">
              Dive into the component lab and experience every element of the design system.
            </p>
            <div className="flex gap-3 justify-center flex-col sm:flex-row relative z-10">
              <MagneticButton
                href="/components"
                onClickSound={ping}
                className="group relative px-8 py-3.5 bg-neon-emerald text-void font-bold rounded-full cursor-pointer
                  shadow-[0_0_25px_rgba(52,211,153,0.3)]
                  hover:shadow-[0_0_40px_rgba(52,211,153,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2">Component Lab {Icons.arrow}</span>
              </MagneticButton>
              <MagneticButton
                href="/dashboard"
                onClickSound={ping}
                className="px-8 py-3.5 border border-white/15 text-white rounded-full font-medium
                  hover:bg-white/10 hover:border-white/25 cursor-pointer"
              >
                Dashboard
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="relative z-10 py-8 px-6">
        <div
          ref={footerLineRef}
          className="max-w-6xl mx-auto mb-8 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.3), rgba(139,92,246,0.3), transparent)' }}
        />
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-[var(--text-muted)]">
            © 2026 SIN VUELTAS. Dopaministic Design.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[var(--text-muted)]">Powered by</span>
            <span className="text-xs text-neon-emerald font-medium">Next.js + Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
