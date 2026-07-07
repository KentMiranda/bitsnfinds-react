import Link from 'next/link'
import { CONFIG } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="bg-bark text-cream/50 px-8 py-6
                       flex flex-wrap items-center justify-between gap-4
                       text-xs tracking-wide">
      <span className="font-display text-base text-cream font-normal">
        Bits <span className="text-wheat">&</span> Finds
      </span>
      <span>{CONFIG.footer.copy}</span>
      <ul className="flex gap-6">
        {CONFIG.footer.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-wheat transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  )
}
