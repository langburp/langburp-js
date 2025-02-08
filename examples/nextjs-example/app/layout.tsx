import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LangburpProvider } from "@langburp/react";
import { Lato } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Langburp Next.js Demo",
  description: "Langburp Next.js Connect Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!process.env.NEXT_PUBLIC_LANGBURP_PUBLIC_API_KEY) {
    throw new Error("LANGBURP_PUBLIC_API_KEY is not set");
  }

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${lato.className}`}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LangburpProvider
            publicApiKey={process.env.NEXT_PUBLIC_LANGBURP_PUBLIC_API_KEY}
            apiBaseUrl={process.env.NEXT_PUBLIC_LANGBURP_API_BASE_URL}
          >
            {children}
          </LangburpProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
