import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIN VUELTAS SCENE — Dopaministic Design System",
  description:
    "Liquid glass, deep void, and dopamine-driven design system. Premium UI components, iridescent AI accents, and micro-interactions for Next.js applications.",
  keywords: [
    "design system",
    "UI components",
    "glassmorphism",
    "dopamine design",
    "Next.js",
    "React",
    "Tailwind CSS",
  ],
  openGraph: {
    title: "SIN VUELTAS SCENE",
    description: "Dopaministic Design System — Liquid glass. Deep void. Iridescent intelligence.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIN VUELTAS SCENE",
    description: "Dopaministic Design System — Liquid glass. Deep void. Iridescent intelligence.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
