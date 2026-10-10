'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CONFIG } from '@/lib/config'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const navRef = useRef(null)
  const menuButtonRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const navigationLinks = CONFIG.navLinks.filter((link) => !link.cta)
  const primaryAction = CONFIG.navLinks.find((link) => link.cta)

  function isCurrentPage(href) {
    const route = href.split('#')[0] || '/'
    return href !== '/#services' && (
      pathname === route || (route === '/products' && pathname.startsWith('/products/'))
    )
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return

      if (menuOpen) {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    function handlePointerDown(event) {
      if (!navRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [menuOpen])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav ref={navRef} aria-label="Primary navigation" className="site-nav sticky top-0 z-50 grid items-center">
        <Link href="/" className="nav-brand group flex min-w-0 items-center gap-2.5 font-display text-lg font-bold md:gap-3">
          <Image
            src="/images/favicon.png"
            alt="Bits & Finds logo"
            width={88}
            height={88}
            className="nav-brand-logo h-12 w-12 shrink-0 rounded-full border-2 object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.03] md:h-14 md:w-14"
          />
          <span className="nav-brand-name whitespace-nowrap text-base sm:text-lg">
            Bits <span>&amp;</span> Finds
          </span>
        </Link>

        <div className="nav-desktop">
          <ul className="nav-links">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrentPage(link.href) ? 'page' : undefined}
                  className="nav-link"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {primaryAction && (
            <Link
              href={primaryAction.href}
              aria-current={isCurrentPage(primaryAction.href) ? 'page' : undefined}
              className="nav-action"
            >
              {primaryAction.label}
              <span aria-hidden="true" className="nav-action-arrow">→</span>
            </Link>
          )}
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="nav-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span className="nav-toggle-icon" aria-hidden="true">
            <span className={`nav-toggle-line ${menuOpen ? 'is-open' : ''}`} />
            <span className={`nav-toggle-line ${menuOpen ? 'is-hidden' : ''}`} />
            <span className={`nav-toggle-line ${menuOpen ? 'is-open' : ''}`} />
          </span>
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>

        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          className={`nav-mobile-menu ${menuOpen ? 'is-open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <ul className="nav-mobile-links">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrentPage(link.href) ? 'page' : undefined}
                  className="nav-mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {primaryAction && (
              <li>
                <Link
                  href={primaryAction.href}
                  aria-current={isCurrentPage(primaryAction.href) ? 'page' : undefined}
                  className="nav-mobile-cta"
                  onClick={() => setMenuOpen(false)}
                >
                  {primaryAction.label}
                  <span aria-hidden="true" className="nav-action-arrow">→</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  )
}
