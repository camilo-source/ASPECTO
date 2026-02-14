'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { TamaguiProvider } from '@tamagui/core'
import tamaguiConfig from '../../tamagui.config'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
        >
            <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
                {children}
            </TamaguiProvider>
        </NextThemeProvider>
    )
}
