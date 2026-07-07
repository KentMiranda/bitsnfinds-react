'use client'

import { useState } from 'react'
import LeafSVG    from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const { contact } = CONFIG

  const inputClass = `w-full bg-paper border border-mist rounded-sm px-4 py-3
                      text-ink text-sm font-light placeholder:text-ink-muted
                      focus:outline-none focus:border-sage transition-colors`

  return (
    <section className="relative px-6 py-24 bg-cream overflow-hidden min-h-screen">
      <LeafSVG variant="single"
        className="absolute left-0 bottom-0 w-48 opacity-[0.09] pointer-events-none -scale-x-100" />

      <div className="grid md:grid-cols-2 gap-20 items-start max-w-3xl mx-auto">
        <div>
          <p className="text-forest text-xs font-medium tracking-[0.22em] uppercase mb-2">
            {contact.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-normal text-bark leading-snug mb-4">
            {contact.title}<br />
            <em className="italic text-walnut font-light">{contact.titleEm}</em>
          </h1>
          <p className="text-ink-muted text-sm font-light leading-relaxed mb-8">{contact.subtitle}</p>
          <ul className="flex flex-col">
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

        <div>
          {!sent ? (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
              <input type="text" placeholder="Your name" className={inputClass}/>
              <input type="email" placeholder="Your email" className={inputClass}/>
              <textarea placeholder="Your message..." rows={5} className={`${inputClass} resize-y`}/>
              <button type="submit"
                className="self-start bg-bark text-cream text-xs font-medium
                           tracking-widest uppercase px-8 py-3 rounded-sm
                           hover:bg-walnut transition-all hover:-translate-y-0.5">
                Send Message
              </button>
            </form>
          ) : (
            <div className="p-8 border border-mist rounded-md bg-paper text-center">
              <p className="font-display text-2xl text-bark mb-2">Message sent 🌿</p>
              <p className="text-ink-muted text-sm font-light">We'll get back to you shortly.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
