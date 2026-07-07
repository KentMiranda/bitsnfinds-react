import Link from 'next/link'
import LeafSVG from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

export default function HomePage() {
  const { hero, about } = CONFIG

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center
                          text-center px-6 py-24 bg-cream overflow-hidden">
        <LeafSVG variant="branch"
          className="absolute top-0 left-0 w-[min(280px,35vw)] opacity-[0.13] pointer-events-none" />
        <LeafSVG variant="branch"
          className="absolute bottom-0 right-0 w-[min(240px,30vw)] opacity-[0.11] pointer-events-none rotate-180" />

        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <LeafSVG variant="sprig" className="w-4 h-4 opacity-60" />
            <span className="text-forest text-xs font-medium tracking-[0.25em] uppercase">
              {hero.eyebrow}
            </span>
            <LeafSVG variant="sprig" className="w-4 h-4 opacity-60 scale-x-[-1]" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-normal
                         text-bark leading-[1.1] mb-5 tracking-tight">
            {hero.titleLine1}
            <br />
            <em className="italic text-walnut font-light">{hero.titleLine2}</em>
          </h1>

          <p className="text-ink-muted text-base font-light leading-relaxed
                        max-w-md mx-auto mb-10">
            {hero.subtitle}
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={hero.cta1.href}
              className="bg-bark text-cream text-xs font-medium tracking-widest
                         uppercase px-8 py-3 rounded-sm hover:bg-walnut
                         transition-all hover:-translate-y-0.5">
              {hero.cta1.label}
            </Link>
            <Link href={hero.cta2.href}
              className="border border-sage text-bark text-xs font-medium tracking-widest
                         uppercase px-8 py-3 rounded-sm hover:border-forest hover:text-forest
                         transition-all hover:-translate-y-0.5">
              {hero.cta2.label}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2
                        flex flex-col items-center gap-1 opacity-50">
          <div className="w-px h-8 bg-forest scroll-line" />
          <span className="text-ink-muted text-[0.6rem] tracking-[0.2em] uppercase">scroll</span>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative px-6 py-24 bg-paper overflow-hidden">
        <LeafSVG variant="single"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-56 opacity-[0.08] pointer-events-none" />

        <div className="grid md:grid-cols-2 gap-20 items-center max-w-5xl mx-auto">
          <div className="relative img-offset">
            <div className="aspect-[3/4] bg-mist rounded-lg overflow-hidden
                            flex items-center justify-center text-8xl">
              {about.image
                ? <img src={about.image} alt="About Bits and Finds" className="w-full h-full object-cover" />
                : '🪵'
              }
            </div>
          </div>

          <div>
            <p className="text-forest text-xs font-medium tracking-[0.22em] uppercase mb-2">
              {about.eyebrow}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-bark leading-snug mb-4">
              {about.title}
              <br />
              <em className="italic text-walnut font-light">{about.titleEm}</em>
            </h2>
            <p className="text-ink-muted text-sm font-light leading-relaxed mb-8">
              {about.body}
            </p>
            <ul className="flex flex-col gap-4">
              {about.values.map((v) => (
                <li key={v.title} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0 mt-2" />
                  <div>
                    <strong className="block text-sm font-medium text-bark mb-0.5">
                      {v.icon} {v.title}
                    </strong>
                    <span className="text-xs text-ink-muted font-light">{v.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
