'use client'

import { YStack, styled } from 'tamagui'

export const GlassCard = styled(YStack, {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // 5% white opacity
    borderColor: 'rgba(255, 255, 255, 0.1)', // 10% white opacity
    borderWidth: 1,
    borderRadius: 24,
    padding: 32,
    shadowColor: 'black',
    shadowRadius: 40,
    shadowOpacity: 0.5,

    // Animation
    // @ts-ignore
    animation: 'lazy',
    enterStyle: {
        opacity: 0,
        y: 10,
        scale: 0.9,
    },
    exitStyle: {
        opacity: 0,
        y: -10,
        scale: 0.9,
    },

    hoverStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        scale: 1.01,
    }
})
