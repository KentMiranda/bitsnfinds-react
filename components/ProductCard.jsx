'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProductCard({ product, index = 0 }) {
  const { name, desc, emoji, image, images, price, category } = product
  const photos = images?.length > 0 ? images : (image ? [image] : [])
  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = (e, i) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveIndex(i)
  }

  const cycle = (e, delta) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveIndex((current) => (current + delta + photos.length) % photos.length)
  }

  return (
    <article
      className="group bg-paper rounded-2xl overflow-hidden shadow-sm hover:shadow-lg
                 transition-shadow duration-300 animate-[fadeUp_0.6s_ease-out_both]"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <div className="relative aspect-[4/3] bg-mist overflow-hidden">
        {photos.length > 0 ? (
          <img
            key={photos[activeIndex]}
            src={photos[activeIndex]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-mist to-[#dce8d4]">
            {emoji}
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => cycle(e, -1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-cream/90
                         flex items-center justify-center text-xs text-bark opacity-0
                         group-hover:opacity-100 transition-opacity duration-300 hover:bg-cream z-10"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => cycle(e, 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-cream/90
                         flex items-center justify-center text-xs text-bark opacity-0
                         group-hover:opacity-100 transition-opacity duration-300 hover:bg-cream z-10"
              aria-label="Next photo"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => goTo(e, i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === activeIndex ? 'bg-cream' : 'bg-cream/50 hover:bg-cream/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {category && category !== 'General' && (
          <span className="absolute top-3 left-3 text-[0.6rem] tracking-widest uppercase
                           text-cream bg-bark/70 backdrop-blur-sm px-2.5 py-1 rounded-full
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {category}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-display text-base font-semibold text-bark leading-snug">{name}</h3>
          {price && <span className="text-sm text-ink-muted flex-shrink-0">{price}</span>}
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-ink-muted text-xs font-light leading-relaxed line-clamp-3 flex-1">
            {desc}
          </p>
          <Link
            href={`/order?product=${encodeURIComponent(name)}`}
            className="flex-shrink-0 bg-bark text-cream text-xs font-medium
                       px-5 py-2 rounded-full hover:bg-walnut transition-colors"
          >
            Order
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  )
}