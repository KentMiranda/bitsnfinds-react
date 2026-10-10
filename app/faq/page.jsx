import FAQItem       from '@/components/FAQItem'
import SectionHeader from '@/components/SectionHeader'
import LeafSVG       from '@/components/LeafSVG'
import { CONFIG }    from '@/lib/config'

export const metadata = { title: `FAQ — ${CONFIG.brand.name}` }

export default function FAQPage() {
  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-paper px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <LeafSVG variant="single"
        className="absolute right-0 top-16 w-44 opacity-[0.07] pointer-events-none" />
      <SectionHeader eyebrow="FAQ" title="Common" titleEm="questions" centered />
      <ul className="mx-auto max-w-2xl">
        {CONFIG.faqs.map((faq) => (
          <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
        ))}
      </ul>
    </section>
  )
}
