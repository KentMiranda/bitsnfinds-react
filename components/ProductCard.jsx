export default function ProductCard({ product }) {
  const { name, desc, emoji, image } = product

  return (
    <article className="bg-paper border border-mist rounded-md overflow-hidden group">
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
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-normal text-bark mb-1">{name}</h3>
        <p className="text-ink-muted text-xs font-light leading-relaxed">{desc}</p>
      </div>
    </article>
  )
}
