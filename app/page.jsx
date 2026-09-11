 'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import LeafSVG from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

export default function HomePage() {
  const { hero, about } = CONFIG
  const [events, setEvents] = useState([])
  const [eventIndex, setEventIndex] = useState(0)

  useEffect(() => {
    fetch(`${CONFIG.apiBaseUrl}/api/events/`)
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
  }, [])

  useEffect(() => {
    if (events.length < 2) return undefined
    const timer = window.setInterval(() => {
      setEventIndex((current) => (current + 1) % events.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [events.length])

  const event = events[eventIndex]
  const formatDate = (value) => value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        month: 'long', day: 'numeric', year: 'numeric'
      })
    : ''

  return (
    <>
      <section className="relative min-h-[92vh] flex items-center justify-center
                          text-center px-6 py-24 bg-cream overflow-hidden">
        <LeafSVG variant="branch"
          className="absolute top-0 left-0 w-[min(280px,35vw)] opacity-[0.13] pointer-events-none" />
        <LeafSVG variant="branch"
          className="absolute bottom-0 right-0 w-[min(240px,30vw)] opacity-[0.11] pointer-events-none rotate-180" />

        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <LeafSVG variant="sprig" className="w-4 h-4 opacity-60" />
            <span className="text-forest text-xs font-medium tracking-[0.25em] uppercase">
              {hero.eyebrow}
            </span>
            <LeafSVG variant="sprig" className="w-4 h-4 opacity-60 scale-x-[-1]" />
          </div>

          <div className="min-h-[250px] max-w-5xl mx-auto mb-8">
            {event ? (
              <div
                key={event.id}
                className="group relative min-h-[430px] md:min-h-[540px] overflow-hidden text-left event-slide focus-within:ring-2 focus-within:ring-forest"
                tabIndex="0"
              >
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain bg-paper transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-mist/70 flex items-center justify-center">
                    <LeafSVG variant="single" className="w-56 opacity-25" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/25 to-transparent transition-colors duration-500 group-hover:from-bark/95 group-hover:via-bark/45" />

                <div className="absolute inset-x-0 bottom-0 p-7 md:p-12 text-cream
                                opacity-100 translate-y-0 transition-all duration-500
                                md:opacity-0 md:translate-y-5
                                md:group-hover:opacity-100 md:group-hover:translate-y-0
                                md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0">
                  <p className="text-sage text-xs font-medium tracking-[0.22em] uppercase mb-2">
                    {event.is_past ? 'Past event' : 'Upcoming event'}
                  </p>
                  <p className="text-cream/75 text-[0.65rem] tracking-[0.2em] uppercase mb-3">
                    {formatDate(event.date)}{event.location ? ` · ${event.location}` : ''}
                  </p>
                  <h1 className="font-display text-4xl md:text-6xl text-cream leading-[1.05] mb-4">
                    {event.title}
                  </h1>
                  {event.description && (
                    <p className="text-cream/85 text-sm font-light leading-relaxed max-w-lg">
                      {event.description}
                    </p>
                  )}
                </div>
                <span className="absolute top-5 right-5 text-cream/70 text-[0.6rem] tracking-[0.2em] uppercase
                                 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                  Hover for details
                </span>
              </div>
            ) : (
              <>
                <h1 className="font-display text-5xl md:text-7xl font-normal text-bark leading-[1.1] mb-5 tracking-tight">
                  {hero.titleLine1}
                  <br />
                  <em className="italic text-walnut font-light">{hero.titleLine2}</em>
                </h1>
                <p className="text-ink-muted text-base font-light leading-relaxed max-w-md mx-auto">
                  {hero.subtitle}
                </p>
              </>
            )}
          </div>

          {events.length > 1 && (
            <div className="flex justify-center gap-2 mb-8" aria-label="Event slides">
              {events.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setEventIndex(index)}
                  aria-label={`Show event ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${index === eventIndex ? 'bg-forest' : 'bg-sage/40'}`}
                />
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={hero.cta1.href}
              className="bg-bark text-cream text-xs font-medium tracking-widest
                         uppercase px-8 py-3 rounded-sm hover:bg-walnut
                         transition-all hover:-translate-y-0.5">
              {hero.cta1.label}
            </Link>
            <Link href={hero.cta2.href}
              className="border border-sage text-bark text-xs font-medium tracking-widest
                         uppercase px-8 py-3 rounded-sm hover:border-forest hover:text-forest
                         transition-all hover:-translate-y-0.5">
              {hero.cta2.label}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2
                        flex flex-col items-center gap-1 opacity-50">
          <div className="w-px h-8 bg-forest scroll-line" />
          <span className="text-ink-muted text-[0.6rem] tracking-[0.2em] uppercase">scroll</span>
        </div>
      </section>

      <section id="about" className="relative px-6 py-24 bg-paper overflow-hidden">
        <LeafSVG variant="single"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-56 opacity-[0.08] pointer-events-none" />

        <div className="grid md:grid-cols-2 gap-20 items-center max-w-5xl mx-auto">
          <div className="relative img-offset">
            <div className="aspect-[3/4] bg-mist rounded-lg overflow-hidden
                            flex items-center justify-center text-8xl">
              {about.image
                ? <img src={about.image} alt="About Bits and Finds" className="w-full h-full object-cover" />
                : '🪵'
              }
            </div>
          </div>

          <div>
            <p className="text-forest text-xs font-medium tracking-[0.22em] uppercase mb-2">
              {about.eyebrow}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-bark leading-snug mb-4">
              {about.title}
              <br />
              <em className="italic text-walnut font-light">{about.titleEm}</em>
            </h2>
            <p className="text-ink-muted text-sm font-light leading-relaxed mb-8">
              {about.body}
            </p>
            <ul className="flex flex-col gap-4">
              {about.values.map((v) => (
                <li key={v.title} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0 mt-2" />
                  <div>
                    <strong className="block text-sm font-medium text-bark mb-0.5">
                      {v.icon} {v.title}
                    </strong>
                    <span className="text-xs text-ink-muted font-light">{v.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
