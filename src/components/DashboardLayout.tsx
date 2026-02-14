'use client'

import { YStack, XStack } from 'tamagui'
import { Sidebar } from './Sidebar'

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <XStack height="100vh" backgroundColor="#020517">
            <Sidebar />
            <YStack flex={1} marginLeft={280} padding="$8" overflow="scroll">
                {children}
            </YStack>
        </XStack>
    )
}
