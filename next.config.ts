import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // some Tamagui packages may need transpiling
  transpilePackages: ['@tamagui/lucide-icons'],
  experimental: {
    turbo: {
      resolveAlias: {
        'react-native': 'react-native-web',
        'react-native-svg': '@tamagui/react-native-svg',
      },
    },
  },
}

export default nextConfig;
