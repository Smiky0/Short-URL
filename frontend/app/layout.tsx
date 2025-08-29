import type { Metadata } from "next";
import { Delius_Swash_Caps, Geist_Mono } from "next/font/google";

import "./globals.css";

const deliusSans = Delius_Swash_Caps({
    variable: "--font-delius-sans",
    preload: true,
    weight: "400",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Make your URL short!",
    description: "Glow-up for those long, annoying, meaningless URLs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${deliusSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
