import { Inter, Lexend, Zen_Tokyo_Zoo } from 'next/font/google'
import { Providers } from './providers'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s - TaxPal',
    default: 'KDX Database',
  },
  description:
    'KANAMORI SYSTEM Inc.のデータベースです。',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ja"
      className={clsx(
        'h-full scroll-smooth dark:bg-slate-800 antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <body className="flex h-full flex-col dark:bg-slate-800 dark:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
