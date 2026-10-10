'use client'

import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
        <meta name="theme-color" content="#103B5C" />
      </head>
      <body className="flex min-h-screen flex-col bg-parchment font-body text-ink antialiased">
        <div className="brand-watermark" aria-hidden="true">
          <img src="/images/favicon.png" alt="" />
        </div>
        {!isAdmin && <Navbar />}
        <main id="main-content" tabIndex={-1} className="flex w-full flex-1 flex-col">
          {children}
        </main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}