import { createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v3'
import { createAnimations } from '@tamagui/animations-css'

const animations = createAnimations({
    bouncy: 'ease-in 200ms',
    lazy: 'ease-in 500ms',
    quick: 'ease-in 100ms',
})

const tamaguiConfig = createTamagui({
    ...config,
    animations,
    defaultProps: {
        Button: {
            animation: 'bouncy',
        },
    },
})

export default tamaguiConfig

export type AppConfig = typeof tamaguiConfig

declare module '@tamagui/core' {
    interface TamaguiCustomConfig extends AppConfig { }
}
