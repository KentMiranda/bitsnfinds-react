import LeafSVG from './LeafSVG'

export default function SectionHeader({ eyebrow, title, titleEm, subtitle, centered = false }) {
  return (
    <div className={`mb-14 ${centered ? 'text-center' : ''}`}>
      <p className="text-forest text-xs font-medium tracking-[0.22em] uppercase mb-2">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-normal text-bark leading-snug mb-3">
        {title}{' '}
        {titleEm && <em className="italic text-walnut font-light">{titleEm}</em>}
      </h2>
      {centered && (
        <div className="flex items-center justify-center gap-4 my-4 opacity-40">
          <div className="h-px w-16 bg-forest" />
          <LeafSVG variant="sprig" className="w-4 h-4" />
          <div className="h-px w-16 bg-forest" />
        </div>
      )}
      {subtitle && (
        <p className={`text-ink-muted text-sm font-light leading-relaxed
                       ${centered ? 'max-w-md mx-auto' : 'max-w-md'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
