'use client'

import Link from 'next/link'

export default function ProductCard({ product, index = 0 }) {
  const { id, slug, name, desc, emoji, image, images, price, category } = product
  const photos = images?.length > 0 ? images : (image ? [image] : [])
  const href = `/products/${id || slug}`

  return (
    <Link
      href={href}
      className="group block animate-[fadeUp_0.6s_ease-out_both]"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <div className="relative aspect-[3/4] bg-mist overflow-hidden rounded-sm mb-4">
        {photos.length > 0 ? (
          <img
            src={photos[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-mist to-[#dce8d4]">
            {emoji}
          </div>
        )}

        {photos.length > 1 && (
          <span className="absolute bottom-3 right-3 text-[0.6rem] tracking-widest uppercase
                           text-cream bg-bark/70 backdrop-blur-sm px-2.5 py-1 rounded-full
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {photos.length} photos
          </span>
        )}

        {category && category !== 'General' && (
          <span className="absolute top-3 left-3 text-[0.6rem] tracking-widest uppercase
                           text-bark bg-cream/90 px-2.5 py-1 rounded-full">
            {category}
          </span>
        )}

        <div className="absolute inset-0 bg-bark/0 group-hover:bg-bark/5 transition-colors duration-300 flex items-center justify-center">
          <span className="text-cream text-xs tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100
                           transition-opacity duration-300 bg-bark/80 px-4 py-2 rounded-full">
            View
          </span>
        </div>
      </div>

      <div className="px-0.5">
        <h3 className="font-display text-base font-normal text-bark leading-snug mb-1">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-ink-muted text-xs font-light leading-relaxed line-clamp-1 flex-1">{desc}</p>
          {price && <span className="text-xs text-wheat font-medium flex-shrink-0 ml-3">{price}</span>}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Link>
  )
}