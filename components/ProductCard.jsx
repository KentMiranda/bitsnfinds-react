import Link from 'next/link'

export default function ProductCard({ product }) {
  const { name, desc, price, tag, emoji, image } = product

  return (
    <div className="bg-paper border border-mist rounded-md overflow-hidden
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl hover:border-sage
                    cursor-pointer group">
      <div className="relative aspect-[4/3] bg-mist overflow-hidden">
        {image ? (
          <img src={image} alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center
                          text-5xl bg-gradient-to-br from-mist to-[#dce8d4]">
            {emoji}
          </div>
        )}
        {tag && (
          <span className="absolute top-3 left-3 bg-bark text-cream
                           text-[0.6rem] font-medium tracking-wider uppercase
                           px-2 py-1 rounded-sm">
            {tag}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-normal text-bark mb-1">{name}</h3>
        <p className="text-ink-muted text-xs font-light leading-relaxed mb-4">{desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-wheat font-medium text-sm">{price}</span>
          <Link href="/order"
            className="text-forest text-xs font-medium tracking-wider uppercase
                       hover:text-bark transition-colors">
            Order →
          </Link>
        </div>
      </div>
    </div>
  )
}
