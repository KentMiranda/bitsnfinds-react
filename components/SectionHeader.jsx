import LeafSVG from './LeafSVG'

export default function SectionHeader({ eyebrow, title, titleEm, subtitle, centered = false }) {
  return (
    <div className={`section-header mb-10 sm:mb-12 ${centered ? 'text-center' : ''}`}>
      <p className="text-walnut text-[0.65rem] font-semibold tracking-[0.22em] uppercase mb-2">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-normal text-bark leading-tight mb-3">
        {title}{' '}
        {titleEm && <em className="italic text-walnut font-light">{titleEm}</em>}
      </h2>
      {centered && (
        <div className="flex items-center justify-center gap-3 my-4 opacity-50">
          <div className="h-px w-12 bg-wheat" />
          <LeafSVG variant="sprig" className="w-4 h-4 text-walnut" />
          <div className="h-px w-12 bg-wheat" />
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
