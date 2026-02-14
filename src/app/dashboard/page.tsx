'use client'

import { YStack, XStack, Text, Separator } from 'tamagui'
import { GlassCard } from '@/components/GlassCard'
import { DopamineButton } from '@/components/DopamineButton'

export default function DashboardPage() {
    return (
        <YStack gap="$6">
            <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                    <Text color="white" fontSize="$8" fontWeight="bold">Dashboard</Text>
                    <Text color="$gray10" fontSize="$4">Welcome to the Void.</Text>
                </YStack>
                <DopamineButton>System Action</DopamineButton>
            </XStack>

            <Separator borderColor="rgba(255,255,255,0.1)" />

            <XStack gap="$4" flexWrap="wrap">
                <GlassCard width={300} height={200}>
                    <Text color="white" fontSize="$5" fontWeight="bold">Active Candidates</Text>
                    <Text color="$neonEmerald" fontSize="$9" fontWeight="bold" marginTop="$2">24</Text>
                </GlassCard>

                <GlassCard width={300} height={200}>
                    <Text color="white" fontSize="$5" fontWeight="bold">Interviews</Text>
                    <Text color="$cosmicPurple" fontSize="$9" fontWeight="bold" marginTop="$2">8</Text>
                </GlassCard>

                <GlassCard width={300} height={200}>
                    <Text color="white" fontSize="$5" fontWeight="bold">Performance</Text>
                    <Text color="white" fontSize="$9" fontWeight="bold" marginTop="$2">98%</Text>
                </GlassCard>
            </XStack>
        </YStack>
    )
}
