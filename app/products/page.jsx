import ProductCard   from '@/components/ProductCard'
import SectionHeader from '@/components/SectionHeader'
import LeafSVG       from '@/components/LeafSVG'
import { CONFIG }    from '@/lib/config'

export const metadata = { title: `Products — ${CONFIG.brand.name}` }

export default function ProductsPage() {
  return (
    <section className="relative px-6 py-24 bg-cream overflow-hidden min-h-screen">
      <LeafSVG variant="sprig"
        className="absolute top-0 left-0 w-44 opacity-[0.08] pointer-events-none" />
      <SectionHeader
        eyebrow="Gallery & Products" title="What we" titleEm="make"
        subtitle="Every piece is available for order — or use it as inspiration for something custom."
        centered />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {CONFIG.products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}
