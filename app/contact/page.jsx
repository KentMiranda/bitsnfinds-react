import LeafSVG    from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

export default function ContactPage() {
  const { contact } = CONFIG

  return (
    <section className="page-surface relative min-h-[60vh] overflow-hidden bg-cream px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <LeafSVG variant="single"
        className="absolute left-0 bottom-0 w-48 opacity-[0.09] pointer-events-none -scale-x-100" />

      <div className="mx-auto max-w-xl text-center">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-forest">
            {contact.eyebrow}
          </p>
          <h1 className="mb-3 font-display text-4xl font-normal leading-tight text-bark">
            {contact.title}<br />
            <em className="italic text-walnut font-light">{contact.titleEm}</em>
          </h1>
          <p className="mb-8 text-sm font-light leading-relaxed text-ink-muted">{contact.subtitle}</p>
          <ul className="flex flex-col items-center">
            {contact.links.map((link) => (
              <li key={link.label} className="w-full max-w-md">
                <a href={link.href} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-4 border-b border-mist py-4 sm:py-5
                             text-ink-muted text-lg hover:text-forest transition-colors last:border-none">
                  <span className="w-12 h-12 flex items-center justify-center text-3xl flex-shrink-0">
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