'use client'

import Link from 'next/link'

export default function ProductCard({ product, index = 0, onSelect }) {
  const { id, slug, name, desc, emoji, image, images, price, category } = product
  const photos = images?.length > 0 ? images : (image ? [image] : [])
  const href = `/products/${id || slug}`
  const cardClassName = 'group block w-full animate-[fadeUp_0.6s_ease-out_both] text-left'
  const cardStyle = { animationDelay: `${Math.min(index, 8) * 70}ms` }

  const content = (
    <>
      <div className="product-card-image relative aspect-[3/4] bg-mist overflow-hidden rounded-md mb-4">
        {photos.length > 0 ? (
          <img
            src={photos[0]}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-mist to-sage">
            {emoji}
          </div>
        )}

        {photos.length > 1 && (
          <span className="absolute bottom-3 right-3 text-[0.6rem] tracking-widest uppercase
                           text-cream bg-bark/70 backdrop-blur-sm px-2.5 py-1 rounded-full
                           opacity-100 transition-opacity duration-300">
            {photos.length} photos
          </span>
        )}

        {category && category !== 'General' && (
          <span className="absolute top-3 left-3 text-[0.6rem] tracking-widest uppercase
                           text-bark bg-cream/90 px-2.5 py-1 rounded-full">
            {category}
          </span>
        )}

        <div className="product-card-overlay absolute inset-0 flex items-end bg-gradient-to-t from-bark/65 via-bark/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="mb-4 ml-4 rounded-full border border-cream/40 bg-bark/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-cream backdrop-blur-sm">
            View photos
          </span>
        </div>
      </div>

      <div className="px-0.5">
        <h3 className="font-display text-lg font-normal text-bark leading-snug mb-1 transition-colors group-hover:text-walnut">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-ink-muted text-xs font-light leading-relaxed line-clamp-1 flex-1">{desc}</p>
          {price && <span className="text-xs text-walnut font-medium flex-shrink-0 ml-3">{price}</span>}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={(event) => onSelect(product, event.currentTarget)}
        aria-label={`View ${name} photos${photos.length > 1 ? `, ${photos.length} images` : ''}`}
        className={cardClassName}
        style={cardStyle}
      >
        {content}
      </button>
    )
  }

  return (
    <Link href={href} className={cardClassName} style={cardStyle}>
      {content}
    </Link>
  )
}