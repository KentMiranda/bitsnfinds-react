import Link from 'next/link'
import { CONFIG } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="site-footer mt-auto bg-bark px-4 py-7 text-xs tracking-wide text-cream/65 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <span className="font-display text-lg font-normal text-cream">
          Bits <span className="text-wheat">&</span> Finds
        </span>
        <span>{CONFIG.footer.copy}</span>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {CONFIG.footer.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="rounded-sm underline-offset-4 transition-colors hover:text-wheat hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}