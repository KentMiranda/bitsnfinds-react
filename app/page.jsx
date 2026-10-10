'use client'

import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CONFIG } from '@/lib/config'

export default function HomePage() {
  const { hero, about, services } = CONFIG
  const [products, setProducts] = useState(CONFIG.products)
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState(false)
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isDocumentVisible, setIsDocumentVisible] = useState(true)
  const [isCarouselHovered, setIsCarouselHovered] = useState(false)
  const [carouselWidth, setCarouselWidth] = useState(0)
  const [failedImageSources, setFailedImageSources] = useState(() => new Set())
  const heroCarouselRef = useRef(null)
  const swipeStartRef = useRef(null)
  const suppressSwipeClickRef = useRef(false)
  const activeHeroImageIndex = products.length ? heroImageIndex % products.length : 0
  const previousActiveIndexRef = useRef(activeHeroImageIndex)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${CONFIG.apiBaseUrl}/api/products/`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Product request failed (${response.status})`)
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Product response was not a list')
        setProducts(data.filter((product) => product.is_active !== false).map((product) => {
          const showcaseImages = (product.showcase_images || []).map((image) => image.url)
          const images = showcaseImages.length > 0
            ? showcaseImages
            : [product.image || product.image_url].filter(Boolean)

          return {
            ...product,
            slug: product.id || product.slug || product.name,
            desc: product.description || product.desc || '',
            image: images[0] || '',
            images,
          }
        }))
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.warn('Could not load landing page products:', error)
        }
      })

    return () => controller.abort()
  }, [])

  const moveHeroCarousel = useCallback((direction) => {
    if (products.length < 2) return
    setHeroImageIndex((current) => (current + direction + products.length) % products.length)
  }, [products.length])

  const navigateHeroCarousel = (direction) => {
    moveHeroCarousel(direction)
  }

  useEffect(() => {
    if (products.length && heroImageIndex !== activeHeroImageIndex) {
      setHeroImageIndex(activeHeroImageIndex)
    }
  }, [activeHeroImageIndex, heroImageIndex, products.length])

  useLayoutEffect(() => {
    previousActiveIndexRef.current = activeHeroImageIndex
  }, [activeHeroImageIndex])

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => {
      setPrefersReducedMotion(motionPreference.matches)
    }
    const updateDocumentVisibility = () => {
      setIsDocumentVisible(document.visibilityState === 'visible')
    }

    updateMotionPreference()
    updateDocumentVisibility()
    motionPreference.addEventListener('change', updateMotionPreference)
    document.addEventListener('visibilitychange', updateDocumentVisibility)

    return () => {
      motionPreference.removeEventListener('change', updateMotionPreference)
      document.removeEventListener('visibilitychange', updateDocumentVisibility)
    }
  }, [])

  useLayoutEffect(() => {
    const measureCarousel = () => {
      const carousel = heroCarouselRef.current
      if (carousel) setCarouselWidth(carousel.clientWidth)
    }

    measureCarousel()
    const observer = new ResizeObserver(measureCarousel)
    if (heroCarouselRef.current) observer.observe(heroCarouselRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !isDocumentVisible ||
      isCarouselHovered ||
      products.length < 2
    ) return undefined

    const interval = window.setInterval(() => {
      moveHeroCarousel(1)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [isCarouselHovered, isDocumentVisible, moveHeroCarousel, prefersReducedMotion, products.length])

  useEffect(() => {
    const revealElements = document.querySelectorAll('[data-home-reveal]')
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [events.length, eventsLoading])

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
      .then((response) => {
        if (!response.ok) throw new Error(`Event request failed (${response.status})`)
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Event response was not a list')
        setEvents(data)
        setEventsError(false)
        try {
          window.sessionStorage.setItem(cacheKey, JSON.stringify(data))
        } catch (error) {
          console.warn('Could not cache events:', error)
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.warn('Could not load landing page events:', error)
          setEventsError(true)
        }
      })
      .finally(() => {
        window.clearTimeout(timeout)
        setEventsLoading(false)
      })

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  const upcomingCount = events.filter((item) => !item.is_past).length

  return (
    <div className="home-page">
      <section
        id="featured-products"
        role="region"
        aria-label="Featured products"
        aria-roledescription="carousel"
        onKeyDown={(event) => {
          if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            navigateHeroCarousel(-1)
          } else if (event.key === 'ArrowRight') {
            event.preventDefault()
            navigateHeroCarousel(1)
          }
        }}
        className="hero-gallery home-carousel-stage relative w-full overflow-hidden px-3 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16"
      >
        <div className="home-carousel-editorial home-carousel-enter relative mx-auto w-full max-w-[1160px]">
          <header className="mb-7 flex flex-col justify-between gap-4 border-b border-bark/15 pb-5 sm:mb-9 sm:flex-row sm:items-end sm:pb-6">
            <div>
              <p className="mb-3 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-walnut">
                Bits &amp; Finds <span className="mx-2 text-bark/30">/</span> The engraving edit
              </p>
              <h1 className="max-w-2xl font-display text-3xl font-normal leading-tight tracking-[-0.03em] text-bark sm:text-4xl lg:text-5xl">
                Little details. <em className="font-light text-walnut">Lasting meaning.</em>
              </h1>
            </div>
            <p className="max-w-sm text-sm font-light leading-6 text-ink-muted sm:text-right">
              {hero.subtitle}
            </p>
          </header>
          <div
            ref={heroCarouselRef}
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
            onFocusCapture={() => setIsCarouselHovered(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsCarouselHovered(false)
              }
            }}
          >
            <div className="relative h-[58vw] min-h-[250px] max-h-[540px] sm:h-[48vw] md:h-[40vw] lg:h-[min(38vw,500px)]">
              {products.map((product, index) => {
                const image = product.images?.[0] || product.image
                const isActive = index === activeHeroImageIndex
                const productKey = product.id || product.slug || product.name
                const relativeIndex = ((index - activeHeroImageIndex + products.length + Math.floor(products.length / 2)) % products.length) - Math.floor(products.length / 2)
                const previousRelativeIndex = ((index - previousActiveIndexRef.current + products.length + Math.floor(products.length / 2)) % products.length) - Math.floor(products.length / 2)
                const isWrappingBehindStack = Math.abs(relativeIndex - previousRelativeIndex) > 1
                const x = relativeIndex * carouselWidth * 0.68

                return (
                  <article
                    key={productKey}
                    className={`absolute left-1/2 top-1/2 h-[88%] w-[88%] max-w-[960px] -translate-y-1/2 sm:w-[82%] lg:w-[76%] ${
                      isActive ? 'z-20' : 'z-[1]'
                    }`}
                    style={{
                      transform: `translate(calc(-50% + ${x}px), -50%) scale(${isActive ? 1 : 0.97})`,
                      transition: isWrappingBehindStack ? 'none' : 'transform 850ms cubic-bezier(0.22, 1, 0.36, 1)',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${products.length}: ${product.name}`}
                    aria-hidden={!isActive}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <Link
                      href={`/products/${product.id || product.slug}`}
                      tabIndex={isActive ? undefined : -1}
                      aria-label={`View ${product.name}`}
                      className="group relative block h-full touch-pan-y overflow-hidden bg-mist shadow-[0_20px_55px_rgba(12,47,75,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bark"
                      onPointerDown={(event) => {
                        if (event.pointerType === 'touch') swipeStartRef.current = { x: event.clientX, y: event.clientY }
                      }}
                      onPointerUp={(event) => {
                        const start = swipeStartRef.current
                        swipeStartRef.current = null
                        if (!start) return
                        const deltaX = event.clientX - start.x
                        const deltaY = event.clientY - start.y
                        if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return
                        suppressSwipeClickRef.current = true
                        navigateHeroCarousel(deltaX < 0 ? 1 : -1)
                      }}
                      onPointerCancel={() => { swipeStartRef.current = null }}
                      onClickCapture={(event) => {
                        if (!suppressSwipeClickRef.current) return
                        suppressSwipeClickRef.current = false
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    >
                      {image && !failedImageSources.has(image) ? (
                        <img
                          src={image}
                          alt={product.name}
                          loading={isActive ? 'eager' : 'lazy'}
                          decoding="async"
                          fetchPriority={isActive ? 'high' : 'auto'}
                          onError={() => setFailedImageSources((current) => new Set(current).add(image))}
                          className={`h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035] ${isActive ? 'scale-[1.015]' : 'scale-100'}`}
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#e6f2f1] to-[#d7eceb] text-5xl text-bark/65"
                        >
                          {product.emoji}
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-bark/65">{product.name}</span>
                        </div>
                      )}
                    </Link>
                  </article>
                )
              })}
              {products.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-bark/70">Thoughtful gifts, made personal</p>
                  <h1 className="font-display text-3xl leading-tight text-bark sm:text-4xl">
                    Little details. <em className="font-light text-walnut">Lasting meaning.</em>
                  </h1>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">{hero.subtitle}</p>
                  <Link href="/products" className="home-action mt-5 inline-flex min-h-11 items-center rounded-sm bg-bark px-5 text-xs font-medium uppercase tracking-widest text-cream">
                    Explore the collection
                  </Link>
                </div>
              )}
              {products.length > 0 && (
                <Link
                  href="/products"
                  tabIndex={isCarouselHovered ? 0 : -1}
                  aria-label="View all products"
                  aria-hidden={!isCarouselHovered}
                  className={`home-carousel-cta absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center text-white ${
                    isCarouselHovered ? 'is-visible' : ''
                  }`}
                >
                  <span className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-wheat sm:text-xs">
                    Bits &amp; Finds <span className="mx-2 text-white/55">/</span> The engraving edit
                  </span>
                  <span className="max-w-3xl font-display text-3xl leading-[1.08] sm:text-5xl lg:text-6xl">
                    Find a piece <em className="font-light">made personal.</em>
                  </span>
                  <span className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-wheat pb-1 text-xs font-semibold uppercase tracking-[0.2em] sm:mt-8">
                    View all products <span aria-hidden="true" className="text-lg text-wheat">↗</span>
                  </span>
                </Link>
              )}
            </div>
          </div>
          <div className="hero-slideshow-controls mx-auto mt-5 w-full max-w-5xl px-2 sm:mt-6 sm:px-6">
            <div className="flex items-center justify-between gap-4 border-b border-bark/15 pb-3">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ink-muted">
                Selected work <span className="mx-2 text-bark/30">/</span> {products.length ? String(activeHeroImageIndex + 1).padStart(2, '0') : '00'} of {String(products.length).padStart(2, '0')}
              </p>
              <Link href={hero.cta2.href} className="home-text-action inline-flex min-h-11 items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-bark">
                Commission a piece <span aria-hidden="true" className="text-lg text-walnut">→</span>
              </Link>
            </div>
            <div
              className="relative mt-4 h-px w-full overflow-hidden bg-bark/15"
              role="progressbar"
              aria-label="Carousel position"
              aria-valuemin={products.length ? 1 : 0}
              aria-valuemax={Math.max(products.length, 1)}
              aria-valuenow={products.length ? activeHeroImageIndex + 1 : 0}
            >
              <div
                className="absolute inset-y-0 left-0 bg-wheat transition-transform duration-700 ease-out"
                style={{
                  width: `${products.length ? 100 / products.length : 0}%`,
                  transform: `translateX(${activeHeroImageIndex * 100}%)`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="home-services px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="home-reveal mb-10 grid gap-5 border-b border-bark/10 pb-8 md:mb-12 md:grid-cols-[1fr_0.7fr] md:items-end md:gap-12 md:pb-10" data-home-reveal>
            <div>
              <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-walnut">
                {services.eyebrow}
              </p>
              <h2 className="max-w-2xl font-display text-4xl font-normal leading-[1.06] tracking-[-0.03em] text-bark sm:text-5xl lg:text-6xl">
                {services.title} <em className="font-light text-walnut">{services.titleEm}</em>
              </h2>
            </div>
            <p className="max-w-md text-sm font-light leading-7 text-ink-muted md:justify-self-end">
              {hero.subtitle}
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-3 md:gap-5">
            {services.items.map((service, index) => (
              <article
                key={service.title}
                className="home-reveal home-service-card group flex flex-col border-b border-bark/10 py-6 first:pt-0 last:border-b-0 md:min-h-[250px] md:border-b-0 md:border-l md:px-6 md:py-3 md:first:border-l-0 md:first:pt-3"
                data-home-reveal
                style={{ '--reveal-delay': `${index * 120}ms` }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-display text-3xl font-light text-walnut/65 transition-colors duration-300 group-hover:text-walnut" aria-hidden="true">{service.icon}</span>
                  <span className="text-[0.62rem] font-medium tracking-[0.18em] text-ink-muted/75">{service.number}</span>
                </div>
                <h3 className="mb-3 font-display text-2xl text-bark">{service.title}</h3>
                <p className="max-w-sm text-sm font-light leading-6 text-ink-muted">{service.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 md:mt-10">
            <Link href={hero.cta2.href}
              className="home-text-action inline-flex min-h-11 items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-bark">
              {hero.cta2.label} <span aria-hidden="true" className="text-lg text-walnut">→</span>
            </Link>
          </div>
        </div>
      </section>

      {(events.length > 0 || eventsLoading || eventsError) && (
        <section id="events" className="home-events px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="home-reveal mx-auto grid max-w-6xl items-center gap-8 rounded-[1.5rem] border border-bark/10 bg-white/55 p-6 sm:p-9 md:grid-cols-[1fr_auto] md:gap-12 md:p-12" data-home-reveal>
            <div>
              <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-walnut">
                Find something special
              </p>
              <h2 className="font-display text-3xl text-bark sm:text-4xl md:text-5xl">
                A little more personal, <em className="font-light text-walnut">in person.</em>
              </h2>
            </div>
            <div className="md:max-w-sm md:text-right">
            {eventsLoading ? (
              <p className="text-sm font-light text-ink-muted" role="status">Finding our next pop-up...</p>
            ) : eventsError ? (
              <div>
                <p className="mb-5 text-sm font-light leading-6 text-ink-muted" role="status">
                  Event updates are temporarily unavailable.
                </p>
                <Link href="/events"
                  className="home-text-action inline-flex min-h-11 items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-bark">
                  Visit the events page <span aria-hidden="true" className="text-lg text-walnut">→</span>
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm font-light leading-6 text-ink-muted">
                  {upcomingCount > 0
                    ? `We have ${upcomingCount} upcoming event${upcomingCount !== 1 ? 's' : ''} — come say hello.`
                    : 'Take a look back at where we\'ve been.'}
                </p>
                <Link href="/events"
                  className="home-text-action inline-flex min-h-11 items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-bark">
                  Explore our events <span aria-hidden="true" className="text-lg text-walnut">→</span>
                </Link>
              </>
            )}
            </div>
          </div>
        </section>
      )}

      <section id="about" className="home-about relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <img
          src="/images/favicon.png"
          alt=""
          aria-hidden="true"
          className="home-about-watermark"
        />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.9fr_1fr] md:items-center md:gap-16">
          <div className="home-reveal" data-home-reveal>
            <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-wheat">
              {about.eyebrow}
            </p>
            <h2 className="font-display text-4xl font-normal leading-[1.06] text-cream sm:text-5xl md:text-6xl">
              {about.title} <em className="font-light text-sage">{about.titleEm}</em>
            </h2>
          </div>
          <div className="home-reveal md:pt-10" data-home-reveal style={{ '--reveal-delay': '120ms' }}>
            <p className="mb-7 max-w-xl text-sm font-light leading-7 text-cream/75 sm:text-base">
              {about.body}
            </p>
            <Link href="/contact" className="home-about-link inline-flex min-h-11 items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-cream">
              Get to know us <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}