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
        <meta name="theme-color" content="#123B57" />
      </head>
      <body className="bg-parchment text-ink font-body antialiased">
        {!isAdmin && <Navbar />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}