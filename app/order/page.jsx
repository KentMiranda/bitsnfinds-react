'use client'

import { useState } from 'react'
import LeafSVG    from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

export default function OrderPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', productType: '', details: '' })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`${CONFIG.apiBaseUrl}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone_number: form.phone,
          email: form.email,
          product_type: form.productType,
          details: form.details,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const message = data.email?.[0]
          || data.phone_number?.[0]
          || data.product_type?.[0]
          || data.name?.[0]
          || 'Something went wrong. Please try again.'
        throw new Error(message)
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Could not send your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const { order } = CONFIG

  const inputClass = `w-full bg-cream/5 border border-cream/10 rounded-sm
                      px-4 py-3 text-cream text-sm font-light
                      placeholder:text-cream/25
                      focus:outline-none focus:border-wheat transition-colors`

  return (
    <section className="relative px-6 py-24 bg-bark text-cream overflow-hidden min-h-screen">
      <LeafSVG variant="branch"
        className="absolute bottom-0 right-0 w-64 opacity-10 pointer-events-none rotate-180" />

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-20 items-start max-w-4xl mx-auto">
        <div>
          <p className="text-wheat text-xs font-medium tracking-[0.22em] uppercase mb-2">
            {order.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-normal text-cream leading-snug mb-4">
            {order.title}<br />
            <em className="italic text-mist font-light">{order.titleEm}</em>
          </h1>
          <p className="text-cream/60 text-sm font-light leading-relaxed mb-8">{order.subtitle}</p>
          <ul className="flex flex-col gap-3">
            {order.infoItems.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-cream/65 font-light">
                <span className="text-wheat flex-shrink-0">↳</span>{item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-cream/45">Full Name</label>
                  <input name="name" type="text" required placeholder="Your name"
                    value={form.name} onChange={handleChange} className={inputClass}/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-cream/45">Contact Number</label>
                  <input name="phone" type="tel" required placeholder="+63 9XX XXX XXXX"
                    value={form.phone} onChange={handleChange} className={inputClass}/>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-cream/45">Email Address</label>
                <input name="email" type="email" required placeholder="you@email.com"
                  value={form.email} onChange={handleChange} className={inputClass}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-cream/45">Product Type</label>
                <select name="productType" required value={form.productType}
                  onChange={handleChange} className={inputClass}>
                  <option value="">Select a product type...</option>
                  {order.productOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-bark">{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-cream/45">Order Details</label>
                <textarea name="details" rows={5}
                  placeholder="Describe what you'd like — size, wood type, design, quantity..."
                  value={form.details} onChange={handleChange} className={`${inputClass} resize-y`}/>
              </div>
              {error && (
                <p className="text-sm text-red-300/90 font-light">{error}</p>
              )}
              <button type="submit" disabled={submitting}
                className="self-start bg-cream text-bark text-xs font-medium
                           tracking-widest uppercase px-8 py-3 rounded-sm
                           hover:bg-wheat transition-all hover:-translate-y-0.5
                           disabled:opacity-50 disabled:hover:translate-y-0">
                {submitting ? 'Sending…' : 'Send Order Request →'}
              </button>
            </form>
          ) : (
            <div className="text-center p-10 border border-wheat/30 rounded-md bg-cream/5">
              <h3 className="font-display text-3xl font-normal text-wheat mb-2">Thank you 🌿</h3>
              <p className="text-cream/60 text-sm font-light">
                We received your order request. We'll contact you within 24–48 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
