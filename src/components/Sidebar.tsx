'use client'

import { Text, YStack, XStack, styled } from 'tamagui'
// @ts-ignore
import { Home, Search, Users, Settings, Bell } from '@tamagui/lucide-icons'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const SidebarContainer = styled(YStack, {
    width: 280,
    backgroundColor: '#020517',
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
    borderRightWidth: 1,
    padding: '$4',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 100,
})

const NavItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <XStack
                padding="$4"
                borderRadius="$4"
                alignItems="center"
                gap="$3"
                backgroundColor={isActive ? 'rgba(52, 211, 153, 0.1)' : 'transparent'}
                hoverStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
                pressStyle={{
                    scale: 0.98,
                }}
                // @ts-ignore
                animation="bouncy"
            >
                <Icon size={20} color={isActive ? '#34d399' : '#94a3b8'} />
                <Text
                    color={isActive ? '#34d399' : '#94a3b8'}
                    fontWeight={isActive ? '600' : '400'}
                    fontSize="$4"
                >
                    {label}
                </Text>
            </XStack>
        </Link>
    )
}

export const Sidebar = () => {
    return (
        <SidebarContainer>
            <YStack padding="$4" marginBottom="$8">
                <Text color="white" fontSize="$6" fontWeight="bold" letterSpacing={-1}>
                    SIN VUELTAS
                </Text>
            </YStack>

            <YStack gap="$2">
                <NavItem icon={Home} label="Dashboard" href="/dashboard" />
                <NavItem icon={Search} label="Search" href="/search" />
                <NavItem icon={Users} label="Candidates" href="/candidates" />
                <NavItem icon={Bell} label="Notifications" href="/notifications" />
                <NavItem icon={Settings} label="Settings" href="/settings" />
            </YStack>
        </SidebarContainer>
    )
}
