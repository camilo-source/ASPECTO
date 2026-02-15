import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // some Tamagui packages may need transpiling
  transpilePackages: ['@tamagui/lucide-icons'],
}

export default nextConfig;
