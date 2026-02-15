'use client'

import Link from 'next/link'

const Icons = {
    chart: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17V9M8 17V5M13 17V8M18 17V3" />
        </svg>
    ),
    users: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="6" r="3" /><circle cx="15" cy="7" r="2.5" /><path d="M1 17c0-3 2.5-5 6-5s6 2 6 5" /><path d="M14 12c2.5 0 5 1.5 5 4" />
        </svg>
    ),
    sparkles: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 1v3M10 16v3M1 10h3M16 10h3M4 4l2 2M14 14l2 2M4 16l2-2M14 6l2-2" />
        </svg>
    ),
    search: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" />
        </svg>
    ),
    calendar: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="16" height="14" rx="2" /><path d="M6 2v4M14 2v4M2 9h16" />
        </svg>
    ),
    arrow: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7h10M8 3l4 4-4 4" />
        </svg>
    ),
    arrowUp: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9V3M3 5l3-3 3 3" />
        </svg>
    ),
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, change, accentRgb, accentColor }: {
    icon: React.ReactNode; label: string; value: string; change: string; accentRgb: string; accentColor: string
}) {
    return (
        <div className="glass rounded-3xl p-6 group cursor-default transition-all duration-500
      hover:scale-[1.02] hover:border-white/10"
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 30px rgba(${accentRgb},0.1), 0 8px 32px rgba(0,0,0,0.2)`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `rgba(${accentRgb},0.1)`, color: accentColor }}>
                    {icon}
                </div>
            </div>
            <p className="text-4xl font-bold font-[family-name:var(--font-geist-mono)] text-white tracking-tight">{value}</p>
            <div className="flex items-center gap-1.5 mt-2">
                {Icons.arrowUp}
                <span className="text-sm font-medium" style={{ color: accentColor }}>{change}</span>
            </div>
        </div>
    )
}

/* ── Activity Item ── */
function ActivityItem({ title, desc, time, dot }: { title: string; desc: string; time: string; dot: string }) {
    return (
        <div className="flex gap-4 py-4 border-b border-white/5 last:border-0 group">
            <div className="mt-1 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dot, boxShadow: `0 0 8px ${dot}50` }} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
            </div>
            <span className="text-xs shrink-0 pt-0.5 font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text-muted)' }}>{time}</span>
        </div>
    )
}

/* ── Mini Pipeline ── */
function Pipeline() {
    const stages = [
        { name: 'Applied', count: 12, pct: 100, color: '#94a3b8' },
        { name: 'Screening', count: 5, pct: 42, color: '#fbbf24' },
        { name: 'Interview', count: 3, pct: 25, color: '#8b5cf6' },
        { name: 'Offer', count: 1, pct: 8, color: '#34d399' },
    ]
    return (
        <div className="space-y-3.5">
            {stages.map(s => (
                <div key={s.name}>
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                            <span className="text-sm font-medium text-white">{s.name}</span>
                        </div>
                        <span className="text-xs font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text-tertiary)' }}>{s.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${s.pct}%`, background: s.color, boxShadow: `0 0 8px ${s.color}40` }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-[fadeUp_0.4s_ease-out]">
            {/* ── Header ── */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.03em]">Dashboard</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Welcome to the Void. Your recruitment command center.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/components"
                        className="px-4 py-2.5 text-sm font-medium glass rounded-xl transition-all
              hover:bg-white/10 cursor-pointer flex items-center gap-1.5"
                        style={{ color: 'var(--text-secondary)' }}>
                        {Icons.sparkles} Component Lab
                    </Link>
                    <button className="px-5 py-2.5 bg-neon-emerald text-void text-sm font-bold rounded-xl cursor-pointer
            shadow-[0_0_20px_rgba(52,211,153,0.3)]
            hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] hover:scale-105
            active:scale-[0.97] transition-all duration-200 flex items-center gap-1.5">
                        New Search {Icons.arrow}
                    </button>
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={Icons.search} label="Active Searches" value="24" change="+12% this week" accentRgb="52,211,153" accentColor="#34d399" />
                <StatCard icon={Icons.users} label="Candidates" value="1,847" change="+284 new" accentRgb="6,182,212" accentColor="#06b6d4" />
                <StatCard icon={Icons.sparkles} label="AI Match Score" value="98%" change="Excellent" accentRgb="139,92,246" accentColor="#8b5cf6" />
                <StatCard icon={Icons.calendar} label="Interviews" value="8" change="3 today" accentRgb="236,72,153" accentColor="#ec4899" />
            </div>

            {/* ── Two Column ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Pipeline */}
                <div className="lg:col-span-3 glass-strong rounded-3xl p-7" style={{ boxShadow: 'var(--shadow-ambient)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Hiring Pipeline</h2>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Candidate flow overview</p>
                        </div>
                        <button className="px-3 py-1.5 bg-neon-emerald/10 text-neon-emerald text-xs font-bold rounded-xl
              border border-neon-emerald/20 hover:bg-neon-emerald/20 transition-all cursor-pointer flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 3v8M3 7h8" /></svg>
                            Add Stage
                        </button>
                    </div>
                    <Pipeline />

                    {/* Mini bar chart visualization */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-xs font-medium mb-4" style={{ color: 'var(--text-tertiary)' }}>Weekly applications</p>
                        <div className="flex items-end gap-2 h-20">
                            {[35, 55, 40, 65, 80, 60, 75].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-100 opacity-70"
                                    style={{
                                        height: `${h}%`,
                                        background: i === 4
                                            ? 'linear-gradient(to top, #34d399, #06b6d4)'
                                            : 'var(--bg-surface-hover)',
                                        boxShadow: i === 4 ? '0 0 12px rgba(52,211,153,0.3)' : 'none',
                                    }} />
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                <span key={d} className="flex-1 text-center text-[10px] font-[family-name:var(--font-geist-mono)]"
                                    style={{ color: 'var(--text-muted)' }}>{d}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-2 glass-strong rounded-3xl p-7" style={{ boxShadow: 'var(--shadow-ambient)' }}>
                    <h2 className="text-xl font-bold text-white tracking-tight mb-1">Recent Activity</h2>
                    <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Latest updates from your pipeline</p>

                    <ActivityItem
                        title="María González moved to Interview"
                        desc="Senior Frontend Developer — AI Score 95%"
                        time="2m ago"
                        dot="#8b5cf6"
                    />
                    <ActivityItem
                        title="New AI match found"
                        desc="3 candidates matched for React Engineer role"
                        time="15m ago"
                        dot="#34d399"
                    />
                    <ActivityItem
                        title="Interview scheduled"
                        desc="Carlos Ruiz — Tomorrow at 10:00 AM"
                        time="1h ago"
                        dot="#06b6d4"
                    />
                    <ActivityItem
                        title="Search completed"
                        desc="UX Designer — 47 candidates found"
                        time="3h ago"
                        dot="#fbbf24"
                    />
                    <ActivityItem
                        title="Offer sent to Ana Martín"
                        desc="Full Stack Developer — Awaiting response"
                        time="5h ago"
                        dot="#ec4899"
                    />
                </div>
            </div>

            {/* ── Top Candidates ── */}
            <div className="glass-strong rounded-3xl p-7" style={{ boxShadow: 'var(--shadow-ambient)' }}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Top AI Matches</h2>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Best candidates across all active searches</p>
                    </div>
                    <button className="text-sm text-neon-emerald font-medium hover:underline cursor-pointer flex items-center gap-1">
                        View all {Icons.arrow}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { name: 'María González', role: 'Senior Frontend', score: 95, skills: ['React', 'TypeScript', 'Next.js'], accent: '#34d399' },
                        { name: 'Carlos Ruiz', role: 'Full Stack Engineer', score: 91, skills: ['Node.js', 'React', 'PostgreSQL'], accent: '#8b5cf6' },
                        { name: 'Lucía Fernández', role: 'UX Designer', score: 88, skills: ['Figma', 'Research', 'Prototyping'], accent: '#06b6d4' },
                    ].map(c => (
                        <div key={c.name} className="glass rounded-2xl p-5 group cursor-pointer transition-all duration-300
              hover:border-white/10 hover:scale-[1.01]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-11 h-11 rounded-xl gradient-iridescent-subtle flex items-center justify-center border border-white/10">
                                    <span className="text-sm font-bold text-white">{c.name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{c.name}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{c.role}</p>
                                </div>
                                <div className="px-2.5 py-1 rounded-lg text-xs font-bold font-[family-name:var(--font-geist-mono)]"
                                    style={{ background: `${c.accent}15`, color: c.accent, border: `1px solid ${c.accent}30` }}>
                                    {c.score}%
                                </div>
                            </div>
                            <div className="flex gap-1.5 flex-wrap">
                                {c.skills.map(s => (
                                    <span key={s} className="glass px-2.5 py-1 text-[11px] rounded-lg" style={{ color: 'var(--text-secondary)' }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
