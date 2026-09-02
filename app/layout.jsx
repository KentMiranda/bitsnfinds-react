'use client'

import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isAdmin  = pathname?.startsWith('/admin')

  return (
    <html lang="en">
      <body className="bg-parchment text-ink font-body antialiased">
        {!isAdmin && <Navbar />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}