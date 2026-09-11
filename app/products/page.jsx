'use client'

import Link          from 'next/link'
import { useEffect, useState } from 'react'
import ProductCard     from '@/components/ProductCard'
import SectionHeader   from '@/components/SectionHeader'
import LeafSVG         from '@/components/LeafSVG'
import { CONFIG }      from '@/lib/config'

export default function ProductsPage() {
  const { gallery } = CONFIG
  const [products, setProducts] = useState(CONFIG.products)

  useEffect(() => {
    document.title = `Gallery — ${CONFIG.brand.name}`
    fetch(`${CONFIG.apiBaseUrl}/api/products/`)
      .then((response) => response.ok ? response.json() : [])
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.map((product) => ({
            ...product,
            desc: product.description,
            image: product.image || product.image_url,
          })))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="relative px-6 py-24 bg-cream overflow-hidden min-h-screen">
      <LeafSVG variant="sprig"
        className="absolute top-0 left-0 w-44 opacity-[0.08] pointer-events-none" />
      <SectionHeader
        eyebrow={gallery.eyebrow}
        title={gallery.title}
        titleEm={gallery.titleEm}
        subtitle={gallery.subtitle}
        centered />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      <div className="mt-16 text-center max-w-lg mx-auto">
        <p className="text-ink-muted text-sm font-light leading-relaxed mb-5">
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
