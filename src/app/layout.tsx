import type { Metadata } from 'next'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './globals.css'
import { Providers } from './providers'
import { NavBar } from '@/components/navBar/nav-bar'

export const metadata: Metadata = {
  title: 'Summator',
  description: 'Simple, organised news summaries',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
    >
      <body>
        <Providers>
          <NavBar />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
      </body>
    </html>
  )
}

