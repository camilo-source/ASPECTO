'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
    {
        label: 'Dashboard', href: '/dashboard', icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="6" height="6" rx="1" /><rect x="10" y="2" width="6" height="3" rx="1" /><rect x="10" y="7" width="6" height="9" rx="1" /><rect x="2" y="10" width="6" height="6" rx="1" />
            </svg>
        )
    },
    {
        label: 'Search', href: '/search', icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="5" /><path d="M12 12l4 4" />
            </svg>
        )
    },
    {
        label: 'Candidates', href: '/candidates', icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="6" r="3" /><path d="M3 16c0-3 2.5-5 6-5s6 2 6 5" />
            </svg>
        )
    },
    {
        label: 'Notifications', href: '/notifications', icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.5 6.5a4.5 4.5 0 1 0-9 0c0 5-2 6.5-2 6.5h13s-2-1.5-2-6.5M10.3 15a1.5 1.5 0 0 1-2.6 0" />
            </svg>
        )
    },
    {
        label: 'Settings', href: '/settings', icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="2.5" /><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.5 3.5l1.5 1.5M13 13l1.5 1.5M3.5 14.5L5 13M13 5l1.5-1.5" />
            </svg>
        )
    },
]

function NavItem({ item }: { item: typeof navItems[0] }) {
    const pathname = usePathname()
    const isActive = pathname === item.href

    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive
                    ? 'bg-neon-emerald/10 text-neon-emerald shadow-[0_0_15px_rgba(52,211,153,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            aria-current={isActive ? 'page' : undefined}
        >
            {item.icon}
            {item.label}
        </Link>
    )
}

export default function DashboardAppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-void">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 w-[260px] h-screen border-r border-white/5 bg-void flex flex-col z-40">
                <div className="px-6 py-6 mb-4">
                    <Link href="/" className="text-white font-bold text-lg tracking-[-0.03em] hover:text-neon-emerald transition-colors">
                        SIN VUELTAS
                    </Link>
                    <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Recruitment Console</p>
                </div>

                <nav className="flex-1 px-3 space-y-0.5" aria-label="Main navigation">
                    {navItems.map(item => (
                        <NavItem key={item.href} item={item} />
                    ))}
                </nav>

                {/* Bottom */}
                <div className="px-5 py-5 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl gradient-iridescent-subtle flex items-center justify-center border border-white/10">
                            <span className="text-xs font-bold text-white">C</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Camilo</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-[260px] p-8 overflow-auto">
                {children}
            </main>
        </div>
    )
}
