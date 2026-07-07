'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CONFIG } from '@/lib/config'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between
                    px-8 py-4 bg-cream/95 backdrop-blur-md
                    border-b border-mist">
      <Link href="/" className="font-display text-xl font-bold text-bark">
        Bits <span className="text-forest">&</span> Finds
      </Link>

      <ul className="hidden md:flex items-center gap-8">
        {CONFIG.navLinks.map((link) => (
          <li key={link.href}>
            {link.cta ? (
              <Link href={link.href}
                className="bg-bark text-cream text-xs font-medium tracking-widest
                           uppercase px-4 py-2 rounded-sm hover:bg-walnut transition-colors">
                {link.label}
              </Link>
            ) : (
              <Link href={link.href}
                className="nav-underline text-xs font-medium tracking-widest
                           uppercase text-ink-muted hover:text-forest transition-colors">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <button className="md:hidden flex flex-col gap-1.5"
        onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span className="block w-6 h-px bg-bark" />
        <span className="block w-6 h-px bg-bark" />
        <span className="block w-6 h-px bg-bark" />
      </button>

      {menuOpen && (
        <ul className="md:hidden absolute top-full left-0 right-0
                       bg-cream border-b border-mist flex flex-col gap-4 px-8 py-6">
          {CONFIG.navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}
                className="text-xs font-medium tracking-widest uppercase text-ink-muted"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
