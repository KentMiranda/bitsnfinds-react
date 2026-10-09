'use client'

import Link          from 'next/link'
import { useEffect, useState, useRef } from 'react'
import ProductCard     from '@/components/ProductCard'
import SectionHeader   from '@/components/SectionHeader'
import LeafSVG         from '@/components/LeafSVG'
import { CONFIG }      from '@/lib/config'

const KNOWN_CATEGORIES = [
  'General',
  'Christmas',
  'Halloween',
  'Fall / Autumn',
  'Winter',
]

export default function ProductsPage() {
  const { gallery } = CONFIG
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    document.title = `Gallery — ${CONFIG.brand.name}`
    fetch(`${CONFIG.apiBaseUrl}/api/products/`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => {
        if (!Array.isArray(data)) return
        setProducts(data.map((product) => {
          const showcaseUrls = (product.showcase_images || []).map((img) => img.url)
          return {
            ...product,
            slug: product.id || product.name,
            desc: product.description,
            category: product.category || 'General',
            image: showcaseUrls[0] || product.image || product.image_url || '',
            images: showcaseUrls.length > 0
              ? showcaseUrls
              : [product.image || product.image_url].filter(Boolean),
          }
        }))
      })
      .catch((error) => console.warn('Could not load gallery products:', error))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const presentCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
  const otherPresent = presentCategories.filter((cat) => !KNOWN_CATEGORIES.includes(cat))

  const filterOptions = [
    { value: 'all', label: 'All products' },
    ...KNOWN_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
    { value: 'Others', label: 'Others' },
  ]

  const visibleProducts = activeFilter === 'all'
    ? products
    : activeFilter === 'Others'
      ? products.filter((p) => otherPresent.includes(p.category))
      : products.filter((p) => p.category === activeFilter)

  const activeLabel = filterOptions.find((opt) => opt.value === activeFilter)?.label || 'All products'

  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-cream px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <LeafSVG variant="sprig"
        className="absolute top-0 left-0 w-44 opacity-[0.08] pointer-events-none" />
      <SectionHeader
        eyebrow={gallery.eyebrow}
        title={gallery.title}
        titleEm={gallery.titleEm}
        subtitle={gallery.subtitle}
        centered />

      <div className="mb-10 flex justify-center sm:mb-12">
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-bark
                       bg-paper border border-mist rounded-full px-6 py-3
                       hover:border-forest transition-colors duration-200"
          >
            <span>{activeLabel}</span>
            <span
              className={`text-[0.6rem] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            >
              ▼
            </span>
          </button>

          <div
            className={`absolute z-30 top-full mt-2 left-1/2 -translate-x-1/2 w-56
                       bg-paper border border-mist rounded-lg shadow-xl overflow-hidden
                       origin-top transition-all duration-200 ease-out
                       ${isOpen
                         ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                         : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}`}
          >
            <div className="max-h-72 overflow-y-auto py-1.5">
              {filterOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { setActiveFilter(option.value); setIsOpen(false) }}
                  style={{ transitionDelay: isOpen ? `${index * 25}ms` : '0ms' }}
                  className={`w-full text-left px-5 py-2.5 text-xs tracking-wider uppercase
                             transition-all duration-200
                             ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}
                             ${activeFilter === option.value
                               ? 'bg-forest text-cream'
                               : 'text-ink-muted hover:bg-mist/60 hover:text-forest'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-mist" />
              <div className="pt-3">
                <div className="h-4 bg-mist rounded w-2/3 mb-3" />
                <div className="h-3 bg-mist rounded w-full mb-2" />
                <div className="h-3 bg-mist rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : visibleProducts.length === 0 ? (
        <p className="text-center text-ink-muted text-sm font-light py-16">
          No products in this category yet.
        </p>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visibleProducts.map((product, index) => (
            <div key={product.slug} className="relative">
              {activeFilter === 'Others' && (
                <span className="absolute top-3 left-3 z-10 bg-wheat text-bark text-[0.6rem]
                                 font-medium tracking-wider uppercase px-2 py-0.5 rounded-sm">
                  {product.category}
                </span>
              )}
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto mt-12 max-w-lg text-center sm:mt-16">
        <p className="mb-4 text-sm font-light leading-relaxed text-ink-muted">
          {gallery.footerNote}
        </p>
        <Link href={gallery.orderLink.href}
          className="inline-block text-forest text-xs font-medium tracking-wider uppercase
                     hover:text-bark transition-colors">
          {gallery.orderLink.label} →
        </Link>
      </div>
    </section>
  )
}