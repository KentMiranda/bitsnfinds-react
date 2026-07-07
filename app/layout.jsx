// app/layout.jsx
// ================================================================
// ROOT LAYOUT — wraps every single page on the site.
// Put things here that should appear on EVERY page:
// the <Navbar>, <Footer>, fonts, and global metadata.
// ================================================================

import './globals.css'
import Navbar  from '@/components/Navbar'
import Footer  from '@/components/Footer'
import { CONFIG } from '@/lib/config'

// This sets the browser tab title and description
export const metadata = {
  title:       CONFIG.brand.name,
  description: CONFIG.brand.tagline,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-parchment text-ink font-body antialiased">

        {/* Navbar appears on every page */}
        <Navbar />

        {/* 'children' = whatever page the user is on */}
        <main>
          {children}
        </main>

        {/* Footer appears on every page */}
        <Footer />

      </body>
    </html>
  )
}
