import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Toaster } from 'sonner'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  title: 'ExpenseTracker - Track Your Finances',
  description: 'A powerful expense tracking application to manage your income and expenses efficiently.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
        <body className="font-sans antialiased min-h-screen">
          {children}
          <Toaster theme="dark" richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
