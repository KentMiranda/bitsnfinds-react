'use client'

import { useEffect, useState, useRef } from 'react'
import SectionHeader from '@/components/SectionHeader'
import LeafSVG from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [imageIndexes, setImageIndexes] = useState({})
  const [visibleIds, setVisibleIds] = useState(new Set())
  const [lightbox, setLightbox] = useState(null)
  const observerRef = useRef(null)

  useEffect(() => {
    document.title = `Events — ${CONFIG.brand.name}`
    fetch(`${CONFIG.apiBaseUrl}/api/events/`, { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleIds((prev) => new Set(prev).add(entry.target.dataset.eventId))
          }
        })
      },
      { threshold: 0.15 }
    )
    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') setLightbox((cur) => cur && { ...cur, index: (cur.index - 1 + cur.images.length) % cur.images.length })
      if (e.key === 'ArrowRight') setLightbox((cur) => cur && { ...cur, index: (cur.index + 1) % cur.images.length })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox])

  const registerCard = (node) => {
    if (node && observerRef.current) observerRef.current.observe(node)
  }

  const upcomingCount = events.filter((e) => !e.is_past).length
  const pastCount = events.filter((e) => e.is_past).length

  const filtered = events
    .filter((e) => filter === 'all' ? true : filter === 'past' ? e.is_past : !e.is_past)
    .filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const groupedByMonth = filtered.reduce((groups, event) => {
    if (!event.date) return groups
    const date = new Date(`${event.date}T00:00:00`)
    const key = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
    if (!groups[key]) groups[key] = []
    groups[key].push(event)
    return groups
  }, {})

  const getImages = (event) => event.image_urls?.length
    ? event.image_urls
    : event.image_url ? [event.image_url] : []

  const currentImageIndex = (eventId) => imageIndexes[eventId] || 0
  const cycleImage = (eventId, images, delta) => {
    setImageIndexes((prev) => {
      const current = prev[eventId] || 0
      const next = (current + delta + images.length) % images.length
      return { ...prev, [eventId]: next }
    })
  }

  return (
    <section className="relative px-6 py-24 bg-cream overflow-hidden min-h-screen">
      <LeafSVG variant="sprig"
        className="absolute top-0 left-0 w-44 opacity-[0.08] pointer-events-none" />

      <SectionHeader
        eyebrow="Find something special"
        title="Where to"
        titleEm="find us"
        subtitle="Browse our upcoming markets and past events."
        centered
      />

      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-muted text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for event"
            className="w-full bg-transparent border-b border-mist pl-7 pb-3 text-sm text-bark
                       placeholder:text-ink-muted placeholder:tracking-widest placeholder:uppercase placeholder:text-xs
                       focus:outline-none focus:border-forest transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-14 text-[0.65rem] tracking-[0.18em] uppercase">
        {[
          ['all', 'All events', events.length],
          ['upcoming', 'Upcoming', upcomingCount],
          ['past', 'Past', pastCount],
        ].map(([value, label, count]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`event-filter ${filter === value ? 'event-filter-active' : ''}`}
          >
            {label} <span>{count}</span>
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        {loading ? (
          <p className="text-center text-ink-muted text-sm font-light py-16">Loading events...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-ink-muted text-sm font-light py-16">No events found.</p>
        ) : (
          Object.entries(groupedByMonth).map(([monthLabel, monthEvents]) => (
            <div key={monthLabel} className="mb-16">
              <div className="inline-block bg-bark text-cream text-xs font-medium tracking-[0.18em] uppercase px-4 py-2 rounded-sm mb-2">
                {monthLabel}
              </div>
              <div className="border-t-2 border-bark mb-2" />

              {monthEvents.map((event, i) => {
                const images = getImages(event)
                const activeIndex = currentImageIndex(event.id)
                const date = new Date(`${event.date}T00:00:00`)
                const weekday = WEEKDAY_SHORT[date.getDay()]
                const day = date.getDate()
                const isVisible = visibleIds.has(String(event.id))

                return (
                  <div
                    key={event.id}
                    ref={registerCard}
                    data-event-id={event.id}
                    className={`group flex flex-col md:flex-row items-start gap-6 py-8 border-b border-mist
                               transition-all duration-700 ease-out
                               ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ transitionDelay: `${Math.min(i, 6) * 60}ms` }}
                  >
                    <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-3 md:gap-0 md:w-16 md:pt-2 order-1">
                      <p className="text-[0.6rem] tracking-widest uppercase text-ink-muted md:mb-0.5">{weekday}</p>
                      <p className="font-display text-3xl text-bark leading-none">{String(day).padStart(2, '0')}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => images.length > 0 && setLightbox({ images, index: activeIndex, title: event.title })}
                      disabled={images.length === 0}
                      className="relative w-full md:w-72 h-56 md:h-52 flex-shrink-0 rounded-md overflow-hidden bg-mist order-2
                                 disabled:cursor-default cursor-zoom-in"
                    >
                      {images.length > 0 ? (
                        <img
                          key={images[activeIndex]}
                          src={images[activeIndex]}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <LeafSVG variant="single" className="w-14 opacity-25" />
                        </div>
                      )}
                      {images.length > 1 && (
                        <>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); cycleImage(event.id, images, -1) }}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); cycleImage(event.id, images, -1) } }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cream/85
                                       flex items-center justify-center text-sm text-bark opacity-0
                                       group-hover:opacity-100 transition-opacity hover:bg-cream"
                            aria-label="Previous photo"
                          >
                            ‹
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); cycleImage(event.id, images, 1) }}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); cycleImage(event.id, images, 1) } }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cream/85
                                       flex items-center justify-center text-sm text-bark opacity-0
                                       group-hover:opacity-100 transition-opacity hover:bg-cream"
                            aria-label="Next photo"
                          >
                            ›
                          </span>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_, idx) => (
                              <span
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                  idx === activeIndex ? 'bg-cream' : 'bg-cream/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </button>

                    <div className="flex-1 min-w-0 order-3">
                      <h3 className="font-display text-2xl md:text-3xl text-bark leading-tight mb-2">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="text-sm text-walnut flex items-center gap-1 mb-3">
                          📍 {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-sm text-ink-muted font-light leading-relaxed mb-4 max-w-md">
                          {event.description}
                        </p>
                      )}
                      <span className="text-[0.6rem] uppercase tracking-wider border border-mist rounded-full px-3 py-1 text-ink-muted">
                        {event.is_past ? 'Past event' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-bark/95 flex items-center justify-center p-6 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-cream text-2xl w-10 h-10 flex items-center justify-center hover:text-wheat transition-colors"
            aria-label="Close"
          >
            ×
          </button>

          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.images[lightbox.index]}
              alt=""
              className="w-full max-h-[75vh] object-contain rounded-md"
            />
            {lightbox.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setLightbox((cur) => ({ ...cur, index: (cur.index - 1 + cur.images.length) % cur.images.length }))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-cream/90
                             flex items-center justify-center text-lg text-bark hover:bg-cream transition-colors"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setLightbox((cur) => ({ ...cur, index: (cur.index + 1) % cur.images.length }))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-cream/90
                             flex items-center justify-center text-lg text-bark hover:bg-cream transition-colors"
                  aria-label="Next photo"
                >
                  ›
                </button>
                <p className="text-center text-cream/80 text-xs tracking-[0.2em] mt-4">
                  {lightbox.index + 1} / {lightbox.images.length}
                </p>
              </>
            )}
            <p className="text-center text-sage font-display text-lg mt-2">{lightbox.title}</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  )
}