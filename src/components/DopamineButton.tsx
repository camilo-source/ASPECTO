'use client'

import { Button, styled, Text, GetProps } from 'tamagui'
// @ts-ignore
import { Monitor, ArrowRight } from '@tamagui/lucide-icons'

const BaseButton = styled(Button, {
    backgroundColor: '#020517', // Void
    borderColor: 'rgba(52, 211, 153, 0.5)', // Neon Emerald
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 12,

    // Animation
    // @ts-ignore
    animation: 'bouncy',
    hoverStyle: {
        scale: 1.05,
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        borderColor: '#34d399',
        shadowColor: '#34d399',
        shadowRadius: 20,
        shadowOpacity: 0.5,
    },
    pressStyle: {
        scale: 0.95,
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
    },
})

export const DopamineButton = (props: GetProps<typeof BaseButton>) => {
    return (
        <BaseButton {...props}>
            <Text color="#34d399" fontSize="$5" fontWeight="bold" letterSpacing={1}>
                {props.children}
            </Text>
        </BaseButton>
    )
}
