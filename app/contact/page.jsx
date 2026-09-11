import LeafSVG    from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

export default function ContactPage() {
  const { contact } = CONFIG

  return (
    <section className="relative px-6 py-24 bg-cream overflow-hidden min-h-screen">
      <LeafSVG variant="single"
        className="absolute left-0 bottom-0 w-48 opacity-[0.09] pointer-events-none -scale-x-100" />

      <div className="max-w-xl mx-auto text-center">
        <div>
          <p className="text-forest text-xs font-medium tracking-[0.22em] uppercase mb-2">
            {contact.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-normal text-bark leading-snug mb-4">
            {contact.title}<br />
            <em className="italic text-walnut font-light">{contact.titleEm}</em>
          </h1>
          <p className="text-ink-muted text-sm font-light leading-relaxed mb-8">{contact.subtitle}</p>
          <ul className="flex flex-col text-left">
            {contact.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-4 py-3 border-b border-mist
                             text-ink-muted text-sm hover:text-forest transition-colors last:border-none">
                  <span className="w-8 h-8 flex items-center justify-center text-base flex-shrink-0">
                    {link.icon}
                  </span>
                  <span><strong className="font-medium">{link.label}</strong>{' · '}{link.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
