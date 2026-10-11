'use client'

import { useEffect, useState } from 'react'
import LeafSVG from '@/components/LeafSVG'
import { CONFIG } from '@/lib/config'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const SERVER_FIELD_NAMES = {
  name: 'name',
  phone_number: 'phone',
  email: 'email',
  product_type: 'productType',
  reference_image: 'referenceImage',
  details: 'details',
}

export default function OrderPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    productType: '',
    details: '',
    referenceImage: null,
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (!imagePreview) return undefined
    return () => URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setError('')
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null
    if (!file) return

    let message = ''
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      message = 'Choose a JPG, PNG, or WebP image.'
    } else if (file.size > MAX_IMAGE_SIZE) {
      message = 'Choose an image that is 5 MB or smaller.'
    } else if (file.size === 0) {
      message = 'Choose an image file that is not empty.'
    }

    if (message) {
      event.target.value = ''
      setFieldErrors((current) => ({ ...current, referenceImage: message }))
      return
    }

    setForm((current) => ({ ...current, referenceImage: file }))
    setImagePreview(URL.createObjectURL(file))
    setFieldErrors((current) => ({ ...current, referenceImage: '' }))
    setError('')
  }

  const clearImage = () => {
    setForm((current) => ({ ...current, referenceImage: null }))
    setImagePreview(null)
    setFieldErrors((current) => ({ ...current, referenceImage: '' }))
  }

  const validateForm = (formElement) => {
    const errors = {}
    const emailInput = formElement.elements.email

    if (!form.name.trim()) errors.name = 'Enter your full name.'
    if (!form.phone.trim()) {
      errors.phone = 'Enter a phone number where we can reach you.'
    } else if (form.phone.replace(/\D/g, '').length < 7) {
      errors.phone = 'Enter a valid phone number with at least 7 digits.'
    }
    if (!form.email.trim()) {
      errors.email = 'Enter your email address.'
    } else if (emailInput.validity.typeMismatch) {
      errors.email = 'Enter a valid email address, such as name@example.com.'
    }
    if (!form.productType) errors.productType = 'Select a product type.'
    if (!form.referenceImage) {
      errors.referenceImage = 'Add a reference image to continue.'
    }

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setError('Please review the highlighted fields.')
      const firstInvalidField = Object.keys(errors)[0]
      formElement.elements[firstInvalidField]?.focus()
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!validateForm(event.currentTarget)) return

    setSubmitting(true)
    try {
      const payload = new FormData()
      payload.append('name', form.name.trim())
      payload.append('phone_number', form.phone.trim())
      payload.append('email', form.email.trim())
      payload.append('product_type', form.productType)
      payload.append('details', form.details)
      payload.append('reference_image', form.referenceImage)

      const response = await fetch(`${CONFIG.apiBaseUrl}/api/orders/`, {
        method: 'POST',
        body: payload,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        const serverErrors = data.errors || data
        const mappedErrors = {}

        Object.entries(SERVER_FIELD_NAMES).forEach(([serverName, fieldName]) => {
          const fieldError = serverErrors[serverName]
          if (fieldError) {
            mappedErrors[fieldName] = Array.isArray(fieldError) ? fieldError[0] : fieldError
          }
        })
        setFieldErrors(mappedErrors)
        throw new Error(
          data.detail
          || data.message
          || (Object.keys(mappedErrors).length
            ? 'Please review the highlighted fields.'
            : 'We could not send your order. Please try again.')
        )
      }

      setSubmitted(true)
    } catch (submissionError) {
      setError(submissionError.message || 'Could not send your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const { order } = CONFIG
  const labelClass = 'text-xs font-medium uppercase tracking-[0.12em] text-cream/75'
  const inputClass = `w-full min-w-0 rounded-md border border-cream/20 bg-cream/[0.06]
                      px-4 py-3 text-sm text-cream placeholder:text-cream/45
                      transition-colors focus:border-wheat focus:outline-none focus:ring-2
                      focus:ring-wheat/30 aria-[invalid=true]:border-red-300`

  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-bark px-4 py-12 text-cream sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <LeafSVG
        variant="branch"
        className="pointer-events-none absolute bottom-0 right-0 w-64 rotate-180 opacity-10"
      />

      <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-12 lg:gap-16">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-wheat">
            {order.eyebrow}
          </p>
          <h1 className="mb-3 font-display text-4xl font-normal leading-tight text-sage">
            {order.title}<br />
            <em className="font-light italic text-mist">{order.titleEm}</em>
          </h1>
          <p className="mb-6 text-sm font-light leading-relaxed text-cream/70">{order.subtitle}</p>
          <ul className="flex flex-col gap-2.5">
            {order.infoItems.map((item) => (
              <li key={item} className="flex gap-3 text-sm font-light text-cream/75">
                <span className="flex-shrink-0 text-wheat" aria-hidden="true">↳</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          {!submitted ? (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="flex min-w-0 flex-col gap-5 rounded-xl border border-cream/15 bg-cream/[0.035] p-4 sm:p-6"
            >
              <p className="text-xs text-cream/65">
                Fields marked <span className="font-semibold text-wheat">*</span> are required.
              </p>

              <div className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-2">
                  <label htmlFor="order-name" className={labelClass}>
                    Full Name <span className="text-wheat" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="order-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'order-name-error' : undefined}
                    className={inputClass}
                  />
                  {fieldErrors.name && <FieldError id="order-name-error">{fieldErrors.name}</FieldError>}
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <label htmlFor="order-phone" className={labelClass}>
                    Phone Number <span className="text-wheat" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="order-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? 'order-phone-error' : 'order-phone-hint'}
                    className={inputClass}
                  />
                  <p id="order-phone-hint" className="text-xs leading-relaxed text-cream/60">
                    Include your country code for international numbers.
                  </p>
                  {fieldErrors.phone && <FieldError id="order-phone-error">{fieldErrors.phone}</FieldError>}
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <label htmlFor="order-email" className={labelClass}>
                    Email Address <span className="text-wheat" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="order-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'order-email-error' : undefined}
                    className={inputClass}
                  />
                  {fieldErrors.email && <FieldError id="order-email-error">{fieldErrors.email}</FieldError>}
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <label htmlFor="order-product-type" className={labelClass}>
                    Product Type <span className="text-wheat" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="order-product-type"
                    name="productType"
                    required
                    value={form.productType}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.productType)}
                    aria-describedby={fieldErrors.productType ? 'order-product-type-error' : undefined}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" className="bg-bark">Choose a product type</option>
                    {order.productOptions.map((option) => (
                      <option key={option} value={option} className="bg-bark">{option}</option>
                    ))}
                  </select>
                  {fieldErrors.productType && (
                    <FieldError id="order-product-type-error">{fieldErrors.productType}</FieldError>
                  )}
                </div>

                <div className="flex min-w-0 flex-col gap-2 sm:col-span-2">
                  <label htmlFor="order-reference-image" className={labelClass}>
                    Reference Image <span className="text-wheat" aria-hidden="true">*</span>
                  </label>
                  <div className="min-w-0 rounded-lg border border-dashed border-cream/30 bg-cream/[0.025] p-3 sm:p-4">
                    {imagePreview ? (
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={imagePreview}
                          alt="Preview of selected reference"
                          className="h-16 w-16 flex-shrink-0 rounded-md border border-cream/20 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-cream/90">{form.referenceImage?.name}</p>
                          <p className="text-xs text-cream/60">
                            {(form.referenceImage.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={clearImage}
                          className="flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center rounded-md px-2 text-sm text-cream/75 transition-colors hover:bg-cream/10 hover:text-wheat focus-visible:outline focus-visible:outline-2 focus-visible:outline-wheat"
                          aria-label="Remove selected reference image"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <input
                        id="order-reference-image"
                        name="referenceImage"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        required
                        onChange={handleImageChange}
                        aria-invalid={Boolean(fieldErrors.referenceImage)}
                        aria-describedby={fieldErrors.referenceImage
                          ? 'order-reference-image-error order-reference-image-hint'
                          : 'order-reference-image-hint'}
                        className="block min-h-11 w-full min-w-0 cursor-pointer text-sm text-cream/80 file:mr-3 file:min-h-10 file:cursor-pointer file:rounded-full file:border-0 file:bg-cream file:px-4 file:font-medium file:text-bark hover:file:bg-wheat"
                      />
                    )}
                    <p id="order-reference-image-hint" className="mt-2 text-xs leading-relaxed text-cream/65">
                      JPG, PNG, or WebP. Maximum file size: 5 MB.
                    </p>
                  </div>
                  {fieldErrors.referenceImage && (
                    <FieldError id="order-reference-image-error">{fieldErrors.referenceImage}</FieldError>
                  )}
                </div>

                <div className="flex min-w-0 flex-col gap-2 sm:col-span-2">
                  <label htmlFor="order-details" className={labelClass}>
                    Order Details <span className="font-normal normal-case tracking-normal text-cream/60">(optional)</span>
                  </label>
                  <textarea
                    id="order-details"
                    name="details"
                    rows={4}
                    maxLength={2000}
                    placeholder="Share sizes, material, design, quantity, or anything else that will help us understand your idea."
                    value={form.details}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.details)}
                    aria-describedby={fieldErrors.details ? 'order-details-error' : undefined}
                    className={`${inputClass} min-h-32 resize-y leading-relaxed`}
                  />
                  {fieldErrors.details && <FieldError id="order-details-error">{fieldErrors.details}</FieldError>}
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-md border border-red-200/30 bg-red-950/20 px-3 py-2 text-sm text-red-100">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-cream px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-bark shadow-sm transition-colors hover:bg-wheat focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wheat disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                {submitting && (
                  <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-bark/30 border-t-bark" />
                )}
                {submitting ? 'Sending request…' : 'Send Order Request'}
                {!submitting && <span aria-hidden="true">→</span>}
              </button>
            </form>
          ) : (
            <div className="rounded-xl border border-wheat/30 bg-cream/5 p-6 text-center sm:p-8">
              <h2 className="mb-2 font-display text-3xl font-normal text-wheat">Thank you 🌿</h2>
              <p className="text-sm font-light text-cream/75">
                We received your order request. To help us find it quickly, please message the Bits &amp; Finds Facebook page with your details or a screenshot of this order.
              </p>
              <div className="mt-6 rounded-lg border border-wheat/25 bg-cream/5 p-4 text-left">
                <p className="mb-2 text-xs uppercase tracking-[0.14em] text-wheat">Suggested message</p>
                <p className="text-sm font-light leading-relaxed text-cream/85">
                  “Hi, I ordered this [product] under the name [your name].”
                </p>
                <p className="mt-2 text-xs text-cream/65">
                  You can also send a screenshot of your order details.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function FieldError({ children, id }) {
  return (
    <p id={id} className="text-xs leading-relaxed text-red-200" role="alert">
      {children}
    </p>
  )
}
