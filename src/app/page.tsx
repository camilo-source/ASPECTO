'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-void relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-emerald/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cosmic-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="flex flex-col gap-8 items-center text-center relative z-10">
        <h1 className="text-6xl md:text-7xl font-bold tracking-[-0.05em] text-white">
          SIN VUELTAS <span className="text-neon-emerald">SCENE</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl">
          High-fidelity UI playground. Liquid glass, deep void, and dopamine-driven interactions.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Link
            href="/components"
            className="group relative px-10 py-4 bg-neon-emerald text-void font-bold text-lg rounded-full
              shadow-[0_0_25px_rgba(52,211,153,0.4)]
              hover:shadow-[0_0_50px_rgba(52,211,153,0.6)] hover:scale-105
              active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span className="relative z-10">Explore Components →</span>
            <div className="absolute inset-0 bg-neon-emerald rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
          </Link>

          <Link
            href="/dashboard"
            className="px-10 py-4 border border-white/20 text-white bg-white/5 rounded-full text-lg
              hover:bg-white/10 hover:border-white/30
              active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-xl"
          >
            Dashboard Demo
          </Link>
        </div>
      </main>
    </div>
  )
}
