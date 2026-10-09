import Link from 'next/link'
import { CONFIG } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="mt-auto bg-bark px-4 py-5 text-xs tracking-wide text-cream/50 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <span className="font-display text-base font-normal text-sage">
          Bits <span className="text-wheat">&</span> Finds
        </span>
        <span>{CONFIG.footer.copy}</span>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {CONFIG.footer.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-wheat transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}