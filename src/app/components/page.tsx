'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── Minimalist SVG Icons ──
const Icons = {
    arrow: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
    ),
    plus: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 3v12M3 9h12" />
        </svg>
    ),
    heart: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 15.5s-6.5-4-6.5-8A3.5 3.5 0 0 1 9 5a3.5 3.5 0 0 1 6.5 2.5c0 4-6.5 8-6.5 8z" />
        </svg>
    ),
    bolt: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2L4 10h5l-1 6 6-8H9l1-6z" />
        </svg>
    ),
    bell: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13.5 6.5a4.5 4.5 0 1 0-9 0c0 5-2 6.5-2 6.5h13s-2-1.5-2-6.5M10.3 15a1.5 1.5 0 0 1-2.6 0" />
        </svg>
    ),
    trash: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 5h12M7 5V3h4v2M5 5v10h8V5" />
        </svg>
    ),
    star: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2l2.2 4.5 5 .7-3.6 3.5.8 5L9 13.5 4.6 15.7l.8-5L1.8 7.2l5-.7L9 2z" />
        </svg>
    ),
    sparkles: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 1v3M9 14v3M1 9h3M14 9h3M3.5 3.5l2 2M12.5 12.5l2 2M3.5 14.5l2-2M12.5 5.5l2-2" />
        </svg>
    ),
    user: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="7" r="3.5" /><path d="M3 17.5c0-3 3-5 7-5s7 2 7 5" />
        </svg>
    ),
    chart: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17V9M8 17V5M13 17V8M18 17V3" />
        </svg>
    ),
    search: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="5" /><path d="M12 12l4 4" />
        </svg>
    ),
    sun: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="9" cy="9" r="3.5" /><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.5 3.5l1.5 1.5M13 13l1.5 1.5M3.5 14.5L5 13M13 5l1.5-1.5" />
        </svg>
    ),
    moon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.5 9.8A7 7 0 0 1 8.2 2.5 7 7 0 1 0 15.5 9.8z" />
        </svg>
    ),
    home: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l6-4.5L14 6v7.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6z" /><path d="M6 14.5V8h4v6.5" />
        </svg>
    ),
    check: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7l3.5 3.5L12 3" />
        </svg>
    ),
    brain: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2a4 4 0 0 0-4 4c0 1-.5 2-1.5 2.5A3.5 3.5 0 0 0 7 15h6a3.5 3.5 0 0 0 2.5-6.5C14.5 8 14 7 14 6a4 4 0 0 0-4-4z" />
            <path d="M10 2v13M7 8h6M7.5 11h5" />
        </svg>
    ),
}

export default function ComponentsPage() {
    const [activeTab, setActiveTab] = useState('buttons')
    const [clickFeedback, setClickFeedback] = useState<string | null>(null)
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    const showFeedback = (msg: string) => {
        setClickFeedback(msg)
        setTimeout(() => setClickFeedback(null), 2000)
    }

    const tabs = [
        { id: 'buttons', label: 'Buttons', icon: Icons.bolt },
        { id: 'cards', label: 'Cards', icon: Icons.chart },
        { id: 'inputs', label: 'Inputs', icon: Icons.search },
        { id: 'badges', label: 'Badges', icon: Icons.star },
        { id: 'animations', label: 'Motion', icon: Icons.sparkles },
        { id: 'layout', label: 'System', icon: Icons.brain },
    ]

    return (
        <div className="min-h-screen transition-colors duration-500" style={{ background: 'var(--bg-primary)' }}>
            {/* ═══ Ambient Background ═══ */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] animate-[breathe_8s_ease-in-out_infinite]"
                    style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.15), transparent 70%)' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-25 blur-[100px] animate-[breathe_10s_ease-in-out_infinite_2s]"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)' }} />
                <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full opacity-15 blur-[80px] animate-[breathe_12s_ease-in-out_infinite_4s]"
                    style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
                {/* ═══ Top Bar ═══ */}
                <div className="flex items-center justify-between mb-10">
                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-70" style={{ color: 'var(--text-tertiary)' }}>
                        {Icons.home}
                        <span className="text-sm font-medium">Home</span>
                    </Link>
                    <button
                        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                        className="glass rounded-2xl w-11 h-11 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? Icons.sun : Icons.moon}
                    </button>
                </div>

                {/* ═══ Header ═══ */}
                <div className="mb-12 animate-[fadeUp_0.5s_ease-out]">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.05em] mb-3" style={{ color: 'var(--text-primary)' }}>
                        Component{' '}
                        <span className="bg-clip-text text-transparent gradient-iridescent">Lab</span>
                    </h1>
                    <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                        Dopaministic design system v2. Liquid glass, neon halos, iridescent AI accents,
                        and micro-interactions that make every pixel alive.
                    </p>
                </div>

                {/* ═══ Feedback Toast ═══ */}
                {clickFeedback && (
                    <div className="fixed top-6 right-6 z-50 glass-strong rounded-2xl px-6 py-3 animate-[slideDown_0.3s_cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{ color: '#34d399', boxShadow: 'var(--shadow-glow-emerald)' }}>
                        {clickFeedback}
                    </div>
                )}

                {/* ═══ Tab Navigation ═══ */}
                <div className="glass rounded-[20px] p-1.5 inline-flex gap-1 mb-12 animate-[fadeUp_0.5s_ease-out_0.1s_both]">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-sm font-medium transition-all duration-300 cursor-pointer
                ${activeTab === tab.id
                                    ? 'bg-neon-emerald text-[#020517] shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                                    : 'hover:bg-[var(--bg-surface-hover)]'
                                }`}
                            style={{ color: activeTab === tab.id ? '#020517' : 'var(--text-secondary)' }}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* ═══ BUTTONS TAB ═══ */}
                {activeTab === 'buttons' && (
                    <div className="space-y-16 animate-[fadeUp_0.4s_ease-out]">

                        {/* Primary */}
                        <Section title="Primary Buttons" desc="Hero actions. Neon halo radiates confidence.">
                            <div className="flex flex-wrap gap-5">
                                {/* Emerald Primary with neon halo */}
                                <button
                                    onClick={() => showFeedback('✅ Primary action triggered')}
                                    className="group relative px-8 py-3.5 bg-neon-emerald text-[#020517] font-bold rounded-full cursor-pointer
                    shadow-[0_0_20px_rgba(52,211,153,0.4),0_0_60px_rgba(52,211,153,0.15)]
                    hover:shadow-[0_0_30px_rgba(52,211,153,0.6),0_0_80px_rgba(52,211,153,0.25)]
                    hover:scale-105 active:scale-[0.97] transition-all duration-200"
                                >
                                    <span className="relative z-10 flex items-center gap-2">Primary Action {Icons.arrow}</span>
                                    <div className="absolute inset-0 bg-neon-emerald rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                                </button>

                                {/* Gradient with glow */}
                                <button
                                    onClick={() => showFeedback('🚀 Launched!')}
                                    className="group relative px-8 py-3.5 bg-gradient-to-r from-neon-emerald to-emerald-300 text-[#020517] font-bold rounded-full cursor-pointer
                    shadow-[0_0_20px_rgba(52,211,153,0.35),0_0_50px_rgba(52,211,153,0.12)]
                    hover:shadow-[0_0_30px_rgba(52,211,153,0.5),0_0_70px_rgba(52,211,153,0.2)]
                    hover:scale-105 active:scale-[0.97] transition-all duration-200"
                                >
                                    <span className="relative z-10 flex items-center gap-2">Launch {Icons.arrow}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-neon-emerald to-emerald-300 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                </button>

                                {/* Large CTA */}
                                <button
                                    onClick={() => showFeedback('🎯 CTA clicked!')}
                                    className="group relative px-10 py-4.5 bg-neon-emerald text-[#020517] font-bold text-lg rounded-full cursor-pointer
                    shadow-[0_0_25px_rgba(52,211,153,0.4),0_0_70px_rgba(52,211,153,0.15)]
                    hover:shadow-[0_0_35px_rgba(52,211,153,0.6),0_0_90px_rgba(52,211,153,0.25)]
                    hover:scale-105 active:scale-[0.97] transition-all duration-200"
                                >
                                    <span className="relative z-10 flex items-center gap-2">Get Started {Icons.arrow}</span>
                                    <div className="absolute inset-0 bg-neon-emerald rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                </button>
                            </div>
                        </Section>

                        {/* AI / Iridescent Buttons */}
                        <Section title="AI Iridescent" desc="Tornasol gradient that signals AI intelligence.">
                            <div className="flex flex-wrap gap-5">
                                {/* Iridescent Filled */}
                                <button
                                    onClick={() => showFeedback('🤖 AI activated')}
                                    className="group relative px-8 py-3.5 text-white font-bold rounded-full cursor-pointer overflow-hidden
                    shadow-[0_0_20px_rgba(139,92,246,0.3),0_0_60px_rgba(52,211,153,0.1)]
                    hover:shadow-[0_0_30px_rgba(139,92,246,0.5),0_0_80px_rgba(52,211,153,0.2)]
                    hover:scale-105 active:scale-[0.97] transition-all duration-200"
                                >
                                    <div className="absolute inset-0 gradient-iridescent opacity-90" />
                                    <span className="relative z-10 flex items-center gap-2">{Icons.sparkles} AI Generate</span>
                                </button>

                                {/* Iridescent Ghost */}
                                <button
                                    onClick={() => showFeedback('✨ AI processing...')}
                                    className="group relative px-8 py-3.5 font-bold rounded-full cursor-pointer
                    hover:scale-105 active:scale-[0.97] transition-all duration-200
                    hover:shadow-[0_0_25px_rgba(139,92,246,0.25),0_0_50px_rgba(52,211,153,0.1)]"
                                    style={{
                                        background: 'linear-gradient(var(--bg-primary), var(--bg-primary)) padding-box, linear-gradient(135deg, #34d399, #06b6d4, #8b5cf6, #ec4899) border-box',
                                        border: '2px solid transparent',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">{Icons.sparkles} AI Analyze</span>
                                </button>

                                {/* Iridescent Subtle */}
                                <button
                                    onClick={() => showFeedback('🧠 Deep analysis started')}
                                    className="group relative px-8 py-3.5 font-semibold rounded-full cursor-pointer
                    gradient-iridescent-subtle
                    hover:shadow-[0_0_25px_rgba(139,92,246,0.2),0_0_50px_rgba(52,211,153,0.1)]
                    hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    <span className="flex items-center gap-2">{Icons.sparkles} Deep Research</span>
                                </button>
                            </div>
                        </Section>

                        {/* Ghost & Outline */}
                        <Section title="Ghost & Outline" desc="Secondary actions with neon edge glow.">
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => showFeedback('Ghost emerald')}
                                    className="px-7 py-3 border border-neon-emerald/40 text-neon-emerald rounded-full cursor-pointer
                    hover:bg-neon-emerald/10 hover:shadow-[0_0_20px_rgba(52,211,153,0.2),0_0_40px_rgba(52,211,153,0.08)]
                    hover:border-neon-emerald/60 hover:scale-[1.03]
                    active:scale-[0.97] transition-all duration-200"
                                    style={{ background: 'rgba(52,211,153,0.05)' }}
                                >
                                    Ghost Emerald
                                </button>

                                <button
                                    onClick={() => showFeedback('Outline clicked')}
                                    className="px-7 py-3 rounded-full cursor-pointer
                    hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                                    style={{ border: '1px solid var(--border-strong)', color: 'var(--text-primary)', background: 'transparent' }}
                                >
                                    Outline
                                </button>

                                <button
                                    onClick={() => showFeedback('Purple AI ghost')}
                                    className="px-7 py-3 border border-cosmic-purple/40 text-cosmic-purple rounded-full cursor-pointer
                    hover:bg-cosmic-purple/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.2),0_0_40px_rgba(139,92,246,0.08)]
                    hover:border-cosmic-purple/60 hover:scale-[1.03]
                    active:scale-[0.97] transition-all duration-200"
                                    style={{ background: 'rgba(139,92,246,0.05)' }}
                                >
                                    {Icons.sparkles}&nbsp;AI Ghost
                                </button>

                                <button
                                    onClick={() => showFeedback('Minimal')}
                                    className="px-7 py-3 rounded-full cursor-pointer
                    hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                                    style={{ color: 'var(--text-tertiary)', background: 'transparent' }}
                                >
                                    Minimal
                                </button>
                            </div>
                        </Section>

                        {/* Icon Buttons */}
                        <Section title="Icon Actions" desc="Compact. Expressive. Neon halo per action.">
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: Icons.plus, color: '#34d399', label: 'Add', rgb: '52,211,153' },
                                    { icon: Icons.heart, color: '#f43f5e', label: 'Like', rgb: '244,63,94' },
                                    { icon: Icons.bolt, color: '#fbbf24', label: 'Boost', rgb: '251,191,36' },
                                    { icon: Icons.bell, color: '#8b5cf6', label: 'Notify', rgb: '139,92,246' },
                                    { icon: Icons.star, color: '#06b6d4', label: 'Save', rgb: '6,182,212' },
                                    { icon: Icons.trash, color: '#ef4444', label: 'Delete', rgb: '239,68,68' },
                                ].map(({ icon, color, label, rgb }) => (
                                    <button
                                        key={label}
                                        onClick={() => showFeedback(`${label}!`)}
                                        className="glass w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer
                      hover:scale-110 active:scale-90 transition-all duration-200"
                                        style={{
                                            color,
                                            ['--hover-shadow' as string]: `0 0 20px rgba(${rgb},0.25)`,
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px rgba(${rgb},0.3), 0 0 40px rgba(${rgb},0.1)`)}
                                        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                        aria-label={label}
                                        title={label}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </Section>

                        {/* Pill Toggle */}
                        <Section title="Pill Toggle" desc="Segmented control with glass background.">
                            <PillToggle />
                        </Section>

                        {/* States */}
                        <Section title="States" desc="Loading, disabled, success.">
                            <div className="flex flex-wrap gap-4">
                                <button className="px-7 py-3 bg-neon-emerald/15 text-neon-emerald/50 rounded-full cursor-not-allowed flex items-center gap-3 border border-neon-emerald/20">
                                    <span className="w-4 h-4 border-2 border-neon-emerald/30 border-t-neon-emerald rounded-full animate-spin" />
                                    Processing...
                                </button>
                                <button className="px-7 py-3 rounded-full cursor-not-allowed" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                                    Disabled
                                </button>
                                <button className="px-7 py-3 bg-neon-emerald/10 text-neon-emerald rounded-full border border-neon-emerald/30 cursor-default flex items-center gap-2">
                                    {Icons.check} Success
                                </button>
                            </div>
                        </Section>
                    </div>
                )}

                {/* ═══ CARDS TAB ═══ */}
                {activeTab === 'cards' && (
                    <div className="space-y-16 animate-[fadeUp_0.4s_ease-out]">
                        <Section title="Holo Stat Cards" desc="Liquid glass with layered depth and neon accents.">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <GlassStatCard
                                    label="Active Searches" value="24" change="+12%" positive
                                    icon={Icons.search} accentRgb="52,211,153"
                                />
                                <GlassStatCard
                                    label="AI Match Score" value="98%" change="Excellent" positive
                                    icon={Icons.sparkles} accentRgb="139,92,246" accent="purple"
                                />
                                <GlassStatCard
                                    label="Candidates" value="1,847" change="+284 this week" positive
                                    icon={Icons.user} accentRgb="6,182,212" accent="cyan"
                                />
                            </div>
                        </Section>

                        <Section title="Candidate Card" desc="Data-rich profile with glass layers.">
                            <div className="max-w-lg">
                                <div className="glass rounded-3xl p-6 hover:shadow-[0_0_40px_rgba(52,211,153,0.08)] transition-all duration-500 group">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-14 h-14 rounded-2xl gradient-iridescent-subtle flex items-center justify-center" style={{ border: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                                            {Icons.user}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>María González</h3>
                                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Senior Frontend Developer</p>
                                        </div>
                                        <div className="px-3 py-1.5 bg-neon-emerald/10 text-neon-emerald text-xs font-bold rounded-full border border-neon-emerald/30 font-[family-name:var(--font-geist-mono)]">
                                            95%
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap mb-5">
                                        {['React', 'TypeScript', 'Next.js'].map(t => (
                                            <span key={t} className="glass px-3 py-1 text-xs rounded-full" style={{ color: 'var(--text-secondary)' }}>{t}</span>
                                        ))}
                                        <span className="px-3 py-1 text-xs bg-cosmic-purple/10 text-cosmic-purple rounded-full border border-cosmic-purple/20 flex items-center gap-1">{Icons.sparkles} AI</span>
                                    </div>
                                    <div className="pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Applied 2 days ago</span>
                                        <button className="text-neon-emerald text-sm font-medium hover:underline cursor-pointer flex items-center gap-1">
                                            View Profile {Icons.arrow}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Glass Panel" desc="Full-width container with frosted depth.">
                            <div className="glass-strong rounded-3xl p-8" style={{ boxShadow: 'var(--shadow-ambient)' }}>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Pipeline</h3>
                                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Drag candidates between stages</p>
                                    </div>
                                    <button className="px-4 py-2 bg-neon-emerald/10 text-neon-emerald text-sm rounded-xl border border-neon-emerald/30 hover:bg-neon-emerald/20 transition-all cursor-pointer flex items-center gap-1.5">
                                        {Icons.plus} Add Stage
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { name: 'Applied', count: 12, color: '#94a3b8' },
                                        { name: 'Screening', count: 5, color: '#fbbf24' },
                                        { name: 'Interview', count: 3, color: '#8b5cf6' },
                                        { name: 'Offer', count: 1, color: '#34d399' },
                                    ].map(stage => (
                                        <div key={stage.name} className="glass rounded-2xl p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                                                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{stage.name}</span>
                                                <span className="ml-auto text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{stage.count}</span>
                                            </div>
                                            {[1, 2].map(n => (
                                                <div key={n} className="mb-2 rounded-xl p-3 transition-all cursor-grab hover:scale-[1.02]"
                                                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                                                    <div className="w-full h-2 rounded-full mb-2" style={{ background: 'var(--bg-surface-hover)' }} />
                                                    <div className="w-2/3 h-2 rounded-full" style={{ background: 'var(--bg-surface)' }} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>
                    </div>
                )}

                {/* ═══ INPUTS TAB ═══ */}
                {activeTab === 'inputs' && (
                    <div className="space-y-16 animate-[fadeUp_0.4s_ease-out]">
                        <Section title="Text Inputs" desc="Glass inputs with focused glow.">
                            <div className="max-w-md space-y-5">
                                <div>
                                    <label className="text-sm mb-2 block font-medium" style={{ color: 'var(--text-secondary)' }}>Search Query</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>{Icons.search}</div>
                                        <input
                                            type="text"
                                            placeholder="Frontend developer with React experience..."
                                            className="w-full pl-11 pr-5 py-3.5 glass rounded-2xl transition-all duration-300
                        focus:outline-none focus:shadow-[0_0_20px_rgba(52,211,153,0.15)] focus:border-neon-emerald/50"
                                            style={{ color: 'var(--text-primary)' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm mb-2 block font-medium" style={{ color: 'var(--text-secondary)' }}>AI Prompt</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>{Icons.sparkles}</div>
                                        <input
                                            type="text"
                                            placeholder="Describe the ideal candidate..."
                                            className="w-full pl-11 pr-5 py-3.5 glass rounded-2xl transition-all duration-300
                        focus:outline-none focus:shadow-[0_0_20px_rgba(139,92,246,0.15)] focus:border-cosmic-purple/50"
                                            style={{ color: 'var(--text-primary)', borderColor: 'rgba(139,92,246,0.15)' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm mb-2 block font-medium" style={{ color: 'var(--text-secondary)' }}>Notes</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Add interview notes..."
                                        className="w-full px-5 py-3.5 glass rounded-2xl transition-all duration-300 resize-none
                      focus:outline-none focus:shadow-[0_0_20px_rgba(52,211,153,0.15)] focus:border-neon-emerald/50"
                                        style={{ color: 'var(--text-primary)' }}
                                    />
                                </div>
                            </div>
                        </Section>

                        <Section title="Toggle & Switch" desc="Satisfying binary states.">
                            <div className="flex flex-wrap gap-6">
                                <ToggleSwitch label="AI Matching" defaultOn />
                                <ToggleSwitch label="Auto-reply" />
                                <ToggleSwitch label="Notifications" defaultOn />
                            </div>
                        </Section>

                        <Section title="Slider" desc="Range selection with emerald track.">
                            <div className="max-w-md">
                                <label className="text-sm mb-3 block font-medium" style={{ color: 'var(--text-secondary)' }}>Match Threshold</label>
                                <input
                                    type="range" min="0" max="100" defaultValue="75" title="Match threshold"
                                    className="w-full h-2 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-neon-emerald [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(52,211,153,0.5)]
                    [&::-webkit-slider-thumb]:cursor-pointer"
                                    style={{ background: 'var(--bg-surface)' }}
                                />
                            </div>
                        </Section>
                    </div>
                )}

                {/* ═══ BADGES TAB ═══ */}
                {activeTab === 'badges' && (
                    <div className="space-y-16 animate-[fadeUp_0.4s_ease-out]">
                        <Section title="Status Badges" desc="Semantic color-coded states.">
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { label: 'Active', bg: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'rgba(52,211,153,0.3)' },
                                    { label: 'Pending', bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
                                    { label: 'Rejected', bg: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: 'rgba(244,63,94,0.3)' },
                                    { label: 'AI Review', bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
                                    { label: 'New', bg: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: 'rgba(6,182,212,0.3)' },
                                ].map(b => (
                                    <span key={b.label} className="px-4 py-1.5 text-xs font-bold rounded-full"
                                        style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                                        {b.label}
                                    </span>
                                ))}
                                <span className="px-4 py-1.5 text-xs font-bold rounded-full glass" style={{ color: 'var(--text-tertiary)' }}>
                                    Archived
                                </span>
                            </div>
                        </Section>

                        <Section title="Score Pills" desc="Confidence levels with glass containers.">
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { score: 98, label: 'Excellent', color: '#34d399', rgb: '52,211,153' },
                                    { score: 72, label: 'Good', color: '#fbbf24', rgb: '251,191,36' },
                                    { score: 35, label: 'Low', color: '#f43f5e', rgb: '244,63,94' },
                                ].map(p => (
                                    <div key={p.label} className="glass flex items-center gap-3 px-4 py-2.5 rounded-2xl">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-[family-name:var(--font-geist-mono)]"
                                            style={{ background: `rgba(${p.rgb},0.15)`, color: p.color }}>
                                            {p.score}
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Notification Indicators" desc="Attention with glass + glow.">
                            <div className="flex flex-wrap gap-6">
                                {[
                                    { icon: Icons.bell, count: '3', glow: 'rgba(244,63,94,0.5)', dot: '#f43f5e' },
                                    { icon: Icons.heart, glow: 'rgba(52,211,153,0.5)', dot: '#34d399' },
                                    { icon: Icons.chart, glow: 'rgba(139,92,246,0.5)', dot: '#8b5cf6', pulse: true },
                                ].map((n, i) => (
                                    <div key={i} className="relative">
                                        <div className="glass w-12 h-12 rounded-2xl flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
                                            {n.icon}
                                        </div>
                                        {n.count ? (
                                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                                                style={{ background: n.dot, boxShadow: `0 0 8px ${n.glow}` }}>
                                                {n.count}
                                            </div>
                                        ) : (
                                            <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ${n.pulse ? 'animate-pulse' : ''}`}
                                                style={{ background: n.dot, boxShadow: `0 0 8px ${n.glow}` }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </div>
                )}

                {/* ═══ ANIMATIONS TAB ═══ */}
                {activeTab === 'animations' && (
                    <div className="space-y-16 animate-[fadeUp_0.4s_ease-out]">
                        <Section title="Glow Pulse" desc="Living heartbeat of the interface.">
                            <div className="flex flex-wrap gap-6">
                                <div className="w-32 h-32 glass rounded-3xl flex items-center justify-center text-neon-emerald font-bold
                  animate-[glowPulse_2s_ease-in-out_infinite]">{Icons.bolt}</div>
                                <div className="w-32 h-32 glass rounded-3xl flex items-center justify-center text-cosmic-purple font-bold
                  animate-[purplePulse_2s_ease-in-out_infinite]">{Icons.sparkles}</div>
                                <div className="w-32 h-32 gradient-iridescent-subtle rounded-3xl flex items-center justify-center font-bold
                  animate-[dualPulse_3s_ease-in-out_infinite]" style={{ color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}>
                                    {Icons.brain}
                                </div>
                            </div>
                        </Section>

                        <Section title="Hover Microinteractions" desc="'If it doesn't move, it's dead.'">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: Icons.chart, label: 'Scale', cls: 'hover:scale-110' },
                                    { icon: Icons.arrow, label: 'Float', cls: 'hover:-translate-y-2' },
                                    { icon: Icons.star, label: 'Tilt', cls: 'hover:rotate-3' },
                                    { icon: Icons.bolt, label: 'Glow', cls: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]' },
                                ].map(m => (
                                    <div key={m.label} className={`glass rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${m.cls}`}>
                                        <div className="mb-2 flex justify-center" style={{ color: 'var(--text-secondary)' }}>{m.icon}</div>
                                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Loading States" desc="Branded spinners and skeletons.">
                            <div className="flex flex-wrap gap-8 items-center">
                                <div className="w-10 h-10 border-2 border-neon-emerald/20 border-t-neon-emerald rounded-full animate-spin" />
                                <div className="flex gap-1.5">
                                    {[0, 150, 300].map(d => (
                                        <div key={d} className="w-2.5 h-2.5 bg-cosmic-purple rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                    ))}
                                </div>
                                <div className="relative w-10 h-10">
                                    <div className="absolute inset-0 border-2 border-neon-emerald rounded-full animate-ping opacity-25" />
                                    <div className="absolute inset-2 bg-neon-emerald/20 rounded-full border border-neon-emerald/50" />
                                </div>
                                <div className="w-48 space-y-2">
                                    <div className="h-3 rounded-full animate-pulse" style={{ background: 'var(--bg-surface-hover)' }} />
                                    <div className="h-3 rounded-full animate-pulse w-3/4" style={{ background: 'var(--bg-surface)' }} />
                                </div>
                            </div>
                        </Section>

                        <Section title="Progress" desc="Visual momentum with glow.">
                            <div className="max-w-md space-y-5">
                                <ProgressBar label="Profile Completion" value={78} color="#34d399" rgb="52,211,153" />
                                <ProgressBar label="AI Analysis" value={45} color="#8b5cf6" rgb="139,92,246" />
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Iridescent</span>
                                        <span className="text-sm font-mono" style={{ color: 'var(--text-tertiary)' }}>92%</span>
                                    </div>
                                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                                        <div className="h-full w-[92%] gradient-iridescent rounded-full" style={{ boxShadow: '0 0 12px rgba(139,92,246,0.4)' }} />
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </div>
                )}

                {/* ═══ SYSTEM TAB ═══ */}
                {activeTab === 'layout' && (
                    <div className="space-y-16 animate-[fadeUp_0.4s_ease-out]">
                        <Section title="Typography" desc="Geist Sans — premium, geometric, clean.">
                            <div className="space-y-3">
                                {[
                                    { size: 'text-6xl', weight: 'font-bold', track: 'tracking-[-0.04em]', label: 'Display' },
                                    { size: 'text-4xl', weight: 'font-bold', track: 'tracking-[-0.03em]', label: 'Heading 1' },
                                    { size: 'text-2xl', weight: 'font-semibold', track: 'tracking-[-0.02em]', label: 'Heading 2' },
                                    { size: 'text-xl', weight: 'font-medium', track: '', label: 'Heading 3' },
                                ].map(t => (
                                    <p key={t.label} className={`${t.size} ${t.weight} ${t.track}`} style={{ color: 'var(--text-primary)' }}>{t.label}</p>
                                ))}
                                <p className="text-base" style={{ color: 'var(--text-secondary)' }}>Body — standard content, crisp and readable against any background.</p>
                                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Caption — secondary information, labels, timestamps.</p>
                                <p className="text-xs font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text-muted)' }}>MONO: $124,500 — 98.7% — 2026-02-14</p>
                            </div>
                        </Section>

                        <Section title="Color System" desc="Adaptive palette — works in dark and light.">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { color: '#020517', name: 'Deep Void', sub: '--bg-primary (dark)' },
                                    { color: '#f8fafc', name: 'Snow', sub: '--bg-primary (light)' },
                                    { color: '#34d399', name: 'Neon Emerald', sub: 'Primary accent', glow: true },
                                    { color: '#10b981', name: 'Emerald Base', sub: 'Emerald-500' },
                                    { color: '#8b5cf6', name: 'Cosmic Purple', sub: 'AI accent', glow: true },
                                    { color: '#06b6d4', name: 'Cyan', sub: 'Iridescent mid', glow: true },
                                    { color: '#ec4899', name: 'Pink', sub: 'Iridescent end', glow: true },
                                    { color: '#94a3b8', name: 'Mist Grey', sub: 'Secondary text' },
                                ].map(s => (
                                    <div key={s.name} className="flex flex-col gap-2">
                                        <div className="w-full h-20 rounded-2xl" style={{
                                            backgroundColor: s.color,
                                            border: '1px solid var(--border-medium)',
                                            boxShadow: s.glow ? `0 0 24px ${s.color}30` : undefined
                                        }} />
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</p>
                                        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Iridescent Gradient" desc="The AI signature across the system.">
                            <div className="space-y-4">
                                <div className="h-16 rounded-2xl gradient-iridescent" style={{ border: '1px solid var(--border-subtle)' }} />
                                <div className="h-16 rounded-2xl gradient-iridescent-subtle" style={{ border: '1px solid var(--border-subtle)' }} />
                                <div className="h-16 rounded-2xl glass gradient-iridescent-subtle flex items-center justify-center gap-2 font-bold" style={{ color: 'var(--text-primary)' }}>
                                    {Icons.sparkles} Glass + Iridescent
                                </div>
                            </div>
                        </Section>

                        <Section title="Glass Levels" desc="Layered frosted glass depth.">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="glass rounded-2xl p-6 text-center">
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Glass</p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>5% opacity</p>
                                </div>
                                <div className="glass-strong rounded-2xl p-6 text-center">
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Glass Strong</p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>10% opacity</p>
                                </div>
                                <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)' }}>
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Elevated</p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Solid surface</p>
                                </div>
                            </div>
                        </Section>
                    </div>
                )}
            </div>
        </div>
    )
}

// ═══ SUB-COMPONENTS ═══

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
            </div>
            {children}
        </div>
    )
}

function GlassStatCard({ label, value, change, positive, icon, accentRgb, accent }: {
    label: string; value: string; change: string; positive: boolean; icon: React.ReactNode; accentRgb: string; accent?: string
}) {
    const color = accent === 'purple' ? '#8b5cf6' : accent === 'cyan' ? '#06b6d4' : '#34d399'
    return (
        <div className="group glass rounded-3xl p-6 cursor-pointer transition-all duration-300
      hover:scale-[1.02] hover:shadow-lg"
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 30px rgba(${accentRgb},0.12), 0 8px 32px rgba(0,0,0,0.2)`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `rgba(${accentRgb},0.1)`, color }}>
                    {icon}
                </div>
            </div>
            <p className="text-4xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-sm mt-2" style={{ color }}>{positive ? '↑' : '↓'} {change}</p>
        </div>
    )
}

function PillToggle() {
    const [active, setActive] = useState('all')
    const options = ['All', 'Active', 'Archived', 'Favorites']
    return (
        <div className="glass inline-flex rounded-full p-1 gap-0.5">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => setActive(opt.toLowerCase())}
                    className={`px-5 py-2 text-sm rounded-full transition-all duration-300 cursor-pointer font-medium
            ${active === opt.toLowerCase()
                            ? 'bg-neon-emerald text-[#020517] shadow-[0_0_15px_rgba(52,211,153,0.25)]'
                            : ''
                        }`}
                    style={{ color: active === opt.toLowerCase() ? '#020517' : 'var(--text-tertiary)' }}
                >
                    {opt}
                </button>
            ))}
        </div>
    )
}

function ToggleSwitch({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
    const [on, setOn] = useState(defaultOn)
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setOn(!on)}
                className={`relative w-12 h-7 rounded-full transition-all duration-300 cursor-pointer
          ${on
                        ? 'bg-neon-emerald/25 border border-neon-emerald/50 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                        : 'border'
                    }`}
                style={on ? {} : { background: 'var(--bg-surface)', borderColor: 'var(--border-medium)' }}
                aria-label={`Toggle ${label}`}
            >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300
          ${on
                        ? 'left-[22px] bg-neon-emerald shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                        : 'left-0.5'
                    }`}
                    style={on ? {} : { background: 'var(--text-tertiary)' }}
                />
            </button>
            <span className="text-sm font-medium" style={{ color: on ? '#34d399' : 'var(--text-secondary)' }}>{label}</span>
        </div>
    )
}

function ProgressBar({ label, value, color, rgb }: { label: string; value: number; color: string; rgb: string }) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span className="text-sm font-mono" style={{ color }}>{value}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${value}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                        boxShadow: `0 0 12px rgba(${rgb},0.4)`,
                    }} />
            </div>
        </div>
    )
}
