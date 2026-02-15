'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { SoundProvider } from '@/components/SoundProvider'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemeProvider
            attribute="data-theme"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            <SoundProvider>
                {children}
            </SoundProvider>
        </NextThemeProvider>
    )
}
