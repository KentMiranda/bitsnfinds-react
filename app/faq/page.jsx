import FAQItem       from '@/components/FAQItem'
import SectionHeader from '@/components/SectionHeader'
import LeafSVG       from '@/components/LeafSVG'
import { CONFIG }    from '@/lib/config'

export const metadata = { title: `FAQ — ${CONFIG.brand.name}` }

export default function FAQPage() {
  return (
    <section className="relative px-6 py-24 bg-paper overflow-hidden min-h-screen">
      <LeafSVG variant="single"
        className="absolute right-0 top-16 w-44 opacity-[0.07] pointer-events-none" />
      <SectionHeader eyebrow="FAQ" title="Common" titleEm="questions" centered />
      <ul className="max-w-xl mx-auto">
        {CONFIG.faqs.map((faq) => (
          <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
        ))}
      </ul>
    </section>
  )
}
