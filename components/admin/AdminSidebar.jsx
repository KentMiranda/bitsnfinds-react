'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/lib/auth'

const NAV_ITEMS = [
  { href: '/admin/orders', label: 'Orders', icon: <><path d="M7 4.75h10a1.25 1.25 0 0 1 1.25 1.25v12A1.25 1.25 0 0 1 17 19.25H7A1.25 1.25 0 0 1 5.75 18V6A1.25 1.25 0 0 1 7 4.75Z" /><path d="M9 8.5h6M9 12h6M9 15.5h3" /></> },
  { href: '/admin/products', label: 'Products', icon: <><path d="m12 3.75 8.25 4.5v7.5L12 20.25l-8.25-4.5v-7.5L12 3.75Z" /><path d="m3.9 8.35 8.1 4.4 8.1-4.4M12 12.75v7.1M8 5.95l8.2 4.45" /></> },
  { href: '/admin/events', label: 'Events', icon: <><rect x="4" y="5.75" width="16" height="14" rx="1.5" /><path d="M8 3.75v4M16 3.75v4M4 10h16M8 13.5h2M14 13.5h2M8 16.5h2" /></> },
]

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  function handleLogout() {
    logout()
    router.push('/admin/login')
  }

  return (
    <aside className="admin-sidebar flex w-full shrink-0 items-center gap-2 bg-bark p-2 md:min-h-screen md:w-56 md:flex-col md:items-stretch md:gap-6 md:px-4 md:py-6">
      <Link href="/admin/orders" className="flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-cream transition-colors hover:bg-forest/70 md:mb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-wheat font-display text-sm font-bold text-bark">B</span>
        <span className="hidden font-display text-lg sm:inline md:text-xl">Bits <span className="text-wheat">&amp;</span> Finds</span>
      </Link>

      <nav aria-label="Admin navigation" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex-col md:items-stretch md:gap-2">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-medium transition-colors md:px-3 md:text-sm
                ${isActive
                  ? 'bg-wheat text-bark shadow-sm'
                  : 'text-cream/75 hover:bg-forest/70 hover:text-cream'}`}
            >
              <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-medium text-cream/70 transition-colors hover:bg-forest/70 hover:text-wheat md:mt-auto md:text-sm"
      >
        <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6.5A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5H12" /></svg>
        <span>Log out</span>
      </button>
    </aside>
  )
}
