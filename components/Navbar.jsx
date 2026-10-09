'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CONFIG } from '@/lib/config'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center
                    px-4 py-3 bg-cream/95 backdrop-blur-md sm:px-6 md:px-8 md:py-4
                    border-b border-mist">
      <Link href="/" className="group col-start-1 row-start-1 flex shrink-0 items-center gap-3 font-display text-xl font-bold text-bark md:gap-4 md:text-3xl">
          <Image
            src="/images/favicon.png"
            alt="Bits & Finds logo"
            width={88}
            height={88}
            className="h-16 w-16 rounded-full border-2 border-bark/10 object-cover shadow-md transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105 md:h-[88px] md:w-[88px]"
          />
          <span>Bits <span className="text-forest">&</span> Finds</span>
      </Link>

      <ul className="col-start-2 row-start-1 hidden items-center gap-4 lg:flex xl:gap-7">
        {CONFIG.navLinks.map((link) => (
          <li key={link.href}>
            {link.cta ? (
              <Link href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className="nav-action whitespace-nowrap rounded-sm bg-bark px-3 py-2 text-[0.65rem] font-medium
                           uppercase tracking-widest text-cream xl:px-4 xl:text-xs">
                {link.label}
              </Link>
            ) : (
              <Link href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className="nav-underline whitespace-nowrap text-[0.65rem] font-medium uppercase
                           tracking-widest text-ink-muted transition-colors hover:text-forest xl:text-xs">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <button className="col-start-3 row-start-1 flex min-h-11 min-w-11 flex-col items-center justify-self-end gap-1.5
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation">
        <span className={`block h-px w-6 bg-bark transition-transform duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
        <span className={`block h-px w-6 bg-bark transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-px w-6 bg-bark transition-transform duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
      </button>

      {menuOpen && (
        <ul id="mobile-navigation" className="nav-mobile-menu absolute left-0 right-0 top-full
                       lg:hidden
                       bg-cream border-b border-mist flex flex-col gap-3 px-4 py-5 sm:px-6">
          {CONFIG.navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className="min-h-11 flex items-center text-xs font-medium tracking-widest uppercase text-ink-muted
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
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