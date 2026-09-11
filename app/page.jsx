 'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import LeafSVG from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

export default function HomePage() {
  const { hero, about, services } = CONFIG
  const [events, setEvents] = useState([])
  const [eventIndex, setEventIndex] = useState(0)
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    const cacheKey = 'bitsnfinds-events'
    try {
      const cached = window.sessionStorage.getItem(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) {
          setEvents(parsed)
          setEventsLoading(false)
        }
      }
    } catch (error) {
      console.warn('Could not read cached events:', error)
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)

    fetch(`${CONFIG.apiBaseUrl}/api/events/`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => {
        if (!Array.isArray(data)) return
        setEvents(data)
        try {
          window.sessionStorage.setItem(cacheKey, JSON.stringify(data))
        } catch (error) {
          console.warn('Could not cache events:', error)
        }
      })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(timeout)
        setEventsLoading(false)
      })

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (events.length < 2) return undefined
    const timer = window.setInterval(() => {
      setEventIndex((current) => (current + 1) % events.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [events.length])

  useEffect(() => {
    if (events.length > 0 && eventIndex >= events.length) setEventIndex(0)
  }, [events.length, eventIndex])

  const event = events[eventIndex]
  const upcomingCount = events.filter((item) => !item.is_past).length
  const pastCount = events.filter((item) => item.is_past).length
  const formatDate = (value) => value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        month: 'long', day: 'numeric', year: 'numeric'
      })
    : ''

  return (
    <>
      <section className="relative min-h-[calc(100vh-73px)] flex items-center
                          px-6 py-16 md:py-24 bg-cream overflow-hidden">
        <LeafSVG variant="branch"
          className="absolute top-0 left-0 w-[min(280px,35vw)] opacity-[0.13] pointer-events-none" />
        <LeafSVG variant="branch"
          className="absolute bottom-0 right-0 w-[min(240px,30vw)] opacity-[0.11] pointer-events-none rotate-180" />

        <div className="relative max-w-7xl w-full mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div className="max-w-xl lg:pt-4">
            <div className="inline-flex items-center gap-2 border border-sage/70 rounded-full px-3 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-wheat" />
              <span className="text-forest text-[0.65rem] font-medium tracking-[0.22em] uppercase">
                {hero.eyebrow}
              </span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-normal text-bark leading-[0.92] mb-7 tracking-[-0.04em]">
              Made to
              <br />
              <em className="italic text-walnut font-light">mean more.</em>
            </h1>
            <p className="text-ink-muted text-base md:text-lg font-light leading-relaxed max-w-md mb-9">
              {hero.subtitle}
            </p>

            <div className="flex gap-3 flex-wrap">
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

            <div className="flex items-center gap-4 mt-10 pt-5 border-t border-sage/50 max-w-md">
              <span className="text-2xl font-display text-bark">01</span>
              <p className="text-xs text-ink-muted leading-relaxed flex-1">
                Designed with intention.
                <br />
                Engraved with precision.
              </p>
              <span className="text-[0.6rem] tracking-[0.18em] uppercase text-forest whitespace-nowrap">Est. 2024</span>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[620px] mt-4 lg:mt-0">
            <div className="absolute top-0 right-0 w-[68%] h-[78%] overflow-hidden bg-mist shadow-[10px_10px_0_rgba(136,216,192,0.28)]">
              <img src="/images/products/ellie.jpeg" alt="Custom engraved portrait piece" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="absolute bottom-0 left-0 w-[54%] h-[48%] overflow-hidden bg-sage border-[8px] border-cream shadow-[-8px_8px_0_rgba(255,147,133,0.24)]">
              <img src="/images/products/cutting-board.jpeg" alt="Custom engraved cutting board" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="absolute bottom-[12%] right-[3%] bg-wheat text-bark w-20 h-20 rounded-full flex items-center justify-center text-center rotate-[-12deg]">
              <span className="text-[0.6rem] tracking-[0.15em] uppercase leading-tight">Made<br />personal</span>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative px-6 py-24 bg-cream overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
            <h2 className="order-2 md:order-1 font-display text-4xl md:text-6xl text-bark leading-tight">
              {services.title}
              <br />
              <em className="italic text-walnut font-light">{services.titleEm}</em>
            </h2>
            <p className="order-1 md:order-2 text-forest text-xs font-medium tracking-[0.25em] uppercase md:pt-2">
              {services.eyebrow}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {services.items.map((service) => (
              <article key={service.title} className="min-h-[300px] flex flex-col">
                <div className="flex items-start justify-between mb-12">
                  <span className="text-2xl text-wheat" aria-hidden="true">{service.icon}</span>
                  <span className="text-xs tracking-[0.2em] text-ink-muted">{service.number}</span>
                </div>
                <h3 className="font-display text-2xl text-bark mb-4">{service.title}</h3>
                <p className="text-sm text-ink-muted font-light leading-relaxed">{service.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {(event || eventsLoading) && (
        <section id="events" className="relative px-6 py-24 bg-paper overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-forest text-xs font-medium tracking-[0.25em] uppercase mb-2">
                  Where to find us
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-bark">
                  Upcoming &amp; past events
                </h2>
                <div className="flex gap-4 mt-4 text-[0.65rem] tracking-[0.18em] uppercase text-ink-muted">
                  <span><strong className="text-forest">{upcomingCount}</strong> upcoming</span>
                  <span><strong className="text-walnut">{pastCount}</strong> past</span>
                </div>
              </div>
              {events.length > 1 && (
                <div className="flex gap-2" aria-label="Event slides">
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
            </div>

            {event ? <div
              key={event.id}
              className="group relative min-h-[430px] md:min-h-[600px] overflow-hidden event-slide focus-within:ring-2 focus-within:ring-forest"
              tabIndex="0"
            >
              {event.image_url ? (
                <img src={event.image_url} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-contain bg-mist transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
              ) : (
                <div className="absolute inset-0 bg-mist flex items-center justify-center">
                  <LeafSVG variant="single" className="w-56 opacity-25" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-12 text-cream opacity-100 md:opacity-0 md:translate-y-5 transition-all duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0">
                <p className="text-sage text-xs font-medium tracking-[0.22em] uppercase mb-2">
                  {event.is_past ? 'Past event' : 'Upcoming event'}
                </p>
                <p className="text-cream/75 text-[0.65rem] tracking-[0.2em] uppercase mb-3">
                  {formatDate(event.date)}{event.location ? ` · ${event.location}` : ''}
                </p>
                <h3 className="font-display text-4xl md:text-6xl leading-[1.05] mb-4">
                  {event.title}
                </h3>
                {event.description && <p className="text-cream/85 text-sm font-light leading-relaxed max-w-lg">{event.description}</p>}
              </div>
            </div> : (
                <div className="min-h-[430px] md:min-h-[600px] bg-mist/40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-sage/40 border-t-forest rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs tracking-[0.2em] uppercase text-ink-muted">Loading events</p>
                  </div>
                </div>
              )}
          </div>
        </section>
      )}

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
