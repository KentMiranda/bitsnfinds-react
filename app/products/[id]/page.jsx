'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import LeafSVG from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetch(`${CONFIG.apiBaseUrl}/api/products/${id}/`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then((data) => {
        const showcaseUrls = (data.showcase_images || []).map((img) => img.url)
        setProduct({
          ...data,
          desc: data.description,
          category: data.category || 'General',
          images: showcaseUrls.length > 0
            ? showcaseUrls
            : [data.image || data.image_url].filter(Boolean),
        })
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (product) document.title = `${product.name} — ${CONFIG.brand.name}`
  }, [product])

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-cream px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-[3/4] bg-mist rounded-md" />
          <div className="pt-4">
            <div className="h-4 bg-mist rounded w-1/3 mb-4" />
            <div className="h-8 bg-mist rounded w-2/3 mb-4" />
            <div className="h-3 bg-mist rounded w-full mb-2" />
            <div className="h-3 bg-mist rounded w-4/5" />
          </div>
        </div>
      </section>
    )
  }

  if (notFound || !product) {
    return (
      <section className="min-h-[60vh] bg-cream px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <p className="text-ink-muted text-sm font-light mb-4">We couldn't find that product.</p>
        <Link href="/products" className="text-forest text-xs font-medium tracking-wider uppercase hover:text-bark">
          ← Back to the gallery
        </Link>
      </section>
    )
  }

  const photos = product.images
  const hasMultiple = photos.length > 1

  return (
    <section className="page-surface relative min-h-[60vh] overflow-hidden bg-cream px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <LeafSVG variant="sprig" className="absolute top-0 left-0 w-44 opacity-[0.08] pointer-events-none" />

      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-forest sm:mb-8"
        >
          ← Back
        </button>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <div className="relative aspect-[3/4] bg-mist rounded-md overflow-hidden mb-4">
              {photos.length > 0 ? (
                <img
                  key={photos[activeIndex]}
                  src={photos[activeIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {product.emoji}
                </div>
              )}

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((i) => (i - 1 + photos.length) % photos.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/90
                               flex items-center justify-center text-sm text-bark hover:bg-cream transition-colors"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((i) => (i + 1) % photos.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/90
                               flex items-center justify-center text-sm text-bark hover:bg-cream transition-colors"
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {hasMultiple && (
              <div className="flex gap-2 flex-wrap">
                {photos.map((photo, i) => (
                  <button
                    key={photo}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`w-16 h-16 rounded-sm overflow-hidden border-2 transition-colors
                      ${i === activeIndex ? 'border-forest' : 'border-transparent hover:border-mist'}`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 md:pt-2">
            {product.category && product.category !== 'General' && (
              <span className="text-[0.65rem] tracking-widest uppercase text-forest border border-mist rounded-full px-3 py-1">
                {product.category}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl text-bark leading-snug mt-4 mb-2">
              {product.name}
            </h1>
            {product.price && (
              <p className="mb-4 text-lg font-medium text-walnut">{product.price}</p>
            )}
            <p className="mb-6 text-sm font-light leading-relaxed text-ink-muted">
              {product.desc}
            </p>

            <Link
              href={`/order?product=${encodeURIComponent(product.name)}`}
              className="inline-block bg-bark text-cream text-xs font-medium tracking-widest
                         uppercase px-8 py-3 rounded-sm hover:bg-walnut transition-all hover:-translate-y-0.5"
            >
              Order this →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}