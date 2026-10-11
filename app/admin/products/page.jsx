'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, isLoggedIn } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { CONFIG } from '@/lib/config'

const EMPTY_FORM = {
  name: '', description: '', price: '', tag: '', emoji: '',
  category: 'General', customCategory: '',
  image_url: '', is_active: true
}

const MAX_MEDIA = 5
const MAX_VIDEO_SIZE = 50 * 1024 * 1024
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
const VIDEO_EXTENSIONS = ['mp4', 'webm']

const CATEGORY_OPTIONS = [
  'General',
  'Christmas',
  'Halloween',
  'Fall / Autumn',
  'Winter',
  'Other',
]

export default function AdminProductsPage() {
  const router = useRouter()

  const [products,       setProducts]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [showForm,       setShowForm]       = useState(false)
  const [editingId,      setEditingId]      = useState(null)
  const [form,           setForm]           = useState(EMPTY_FORM)
  const [saving,         setSaving]         = useState(false)
  const [saveError,      setSaveError]      = useState('')

  const [newMediaFiles,   setNewMediaFiles]   = useState([])
  const [existingMedia,   setExistingMedia]   = useState([])
  const [mediaError,      setMediaError]      = useState('')
  const [uploadingMedia,  setUploadingMedia]  = useState(false)
  const previewUrlsRef = useRef(new Set())

  useEffect(() => {
    if (!isLoggedIn()) router.push('/admin/login')
    else fetchProducts()
  }, [])

  useEffect(() => () => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function clearNewMedia() {
    newMediaFiles.forEach(({ previewUrl }) => {
      URL.revokeObjectURL(previewUrl)
      previewUrlsRef.current.delete(previewUrl)
    })
    setNewMediaFiles([])
  }

  async function fetchProducts() {
    try {
      const res = await fetch(`${CONFIG.apiBaseUrl}/api/products/`, {
        headers: { 'Authorization': `Token ${getToken()}` }
      })
      const data = await res.json()
      if (res.ok) setProducts(data)
      else if (res.status === 401) router.push('/admin/login')
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  function openAddForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    clearNewMedia()
    setExistingMedia([])
    setMediaError('')
    setSaveError('')
    setShowForm(true)
  }

  function openEditForm(product) {
    const savedCategory = product.category || 'General'
    const isKnownCategory = CATEGORY_OPTIONS.includes(savedCategory)
    setForm({
      name:        product.name,
      description: product.description,
      price:       product.price,
      tag:         product.tag        || '',
      emoji:       product.emoji      || '',
      category:    isKnownCategory ? savedCategory : 'Other',
      customCategory: isKnownCategory ? '' : savedCategory,
      image_url:   product.image_url  || '',
      is_active:   product.is_active,
    })
    setEditingId(product.id)
    clearNewMedia()
    setExistingMedia(product.showcase_images || [])
    setMediaError('')
    setSaveError('')
    setShowForm(true)
  }

  function handleMediaPick(e) {
    const picked = Array.from(e.target.files || [])
    e.target.value = ''
    if (picked.length === 0) return

    const remainingSlots = MAX_MEDIA - existingMedia.length - newMediaFiles.length
    if (remainingSlots <= 0) {
      setMediaError(`You can only have ${MAX_MEDIA} media items per product.`)
      return
    }

    const validFiles = []
    const rejected = []
    picked.forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      if (file.size === 0) {
        rejected.push(`${file.name} is empty.`)
      } else if (IMAGE_EXTENSIONS.includes(extension)) {
        validFiles.push({ file, mediaType: 'image' })
      } else if (VIDEO_EXTENSIONS.includes(extension)) {
        if (file.size > MAX_VIDEO_SIZE) {
          rejected.push(`${file.name} exceeds the 50 MB video limit.`)
        } else {
          validFiles.push({ file, mediaType: 'video' })
        }
      } else {
        rejected.push(`${file.name} is not a supported image or video.`)
      }
    })

    const accepted = validFiles.slice(0, remainingSlots).map((media) => {
      const previewUrl = URL.createObjectURL(media.file)
      previewUrlsRef.current.add(previewUrl)
      return { ...media, previewUrl }
    })
    if (validFiles.length > remainingSlots) {
      rejected.push(`Only added ${accepted.length} of ${validFiles.length} valid files — maximum ${MAX_MEDIA} media items per product.`)
    }
    if (rejected.length) {
      setMediaError(rejected.join(' '))
    } else {
      setMediaError('')
    }

    setNewMediaFiles((previous) => [...previous, ...accepted])
  }

  function removeNewMedia(index) {
    const removed = newMediaFiles[index]
    if (removed) {
      URL.revokeObjectURL(removed.previewUrl)
      previewUrlsRef.current.delete(removed.previewUrl)
    }
    setNewMediaFiles((previous) => previous.filter((_, i) => i !== index))
    setMediaError('')
  }

  async function removeExistingMedia(imageId) {
    if (!editingId) return
    if (!confirm('Remove this media item?')) return
    try {
      const res = await fetch(
        `${CONFIG.apiBaseUrl}/api/products/${editingId}/showcase-images/${imageId}/`,
        { method: 'DELETE', headers: { 'Authorization': `Token ${getToken()}` } }
      )
      if (res.ok) {
        setExistingMedia((prev) => prev.filter((media) => media.id !== imageId))
      } else {
        setMediaError('Could not remove that media item. Please try again.')
      }
    } catch (err) {
      console.error('Failed to delete product media:', err)
      setMediaError('Could not reach the server to remove that media item.')
    }
  }

  async function uploadNewMedia(productId) {
    if (newMediaFiles.length === 0) return true

    setUploadingMedia(true)
    try {
      const body = new FormData()
      newMediaFiles.forEach(({ file }) => body.append('images', file))

      const res = await fetch(
        `${CONFIG.apiBaseUrl}/api/products/${productId}/showcase-images/`,
        {
          method: 'POST',
          headers: { 'Authorization': `Token ${getToken()}` },
          body,
        }
      )
      if (res.ok) return true

      const data = await res.json().catch(() => ({}))
      setMediaError(data.error || 'Some media files failed to upload.')
      return false
    } catch (err) {
      console.error('Failed to upload product media:', err)
      setMediaError('Could not reach the server to upload media.')
      return false
    } finally {
      setUploadingMedia(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    try {
      const url    = editingId
        ? `${CONFIG.apiBaseUrl}/api/products/${editingId}/`
        : `${CONFIG.apiBaseUrl}/api/products/`
      const method = editingId ? 'PUT' : 'POST'

      const finalCategory = form.category === 'Other'
        ? (form.customCategory.trim() || 'Other')
        : form.category

      const body = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'category') {
          body.append('category', finalCategory)
        } else if (key !== 'customCategory') {
          body.append(key, value)
        }
      })

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Token ${getToken()}`,
        },
        body,
      })

      if (res.ok) {
        const savedProduct = await res.json()
        const productId = savedProduct.id || editingId

        const mediaOk = await uploadNewMedia(productId)

        await fetchProducts()
        if (mediaOk) {
          setShowForm(false)
          setEditingId(null)
          setForm(EMPTY_FORM)
          clearNewMedia()
          setExistingMedia([])
        }
      } else {
        const data = await res.json().catch(() => ({}))
        const errors = data.errors || data
        const message = Object.values(errors)
          .flat()
          .filter(Boolean)
          .join(' ')
        setSaveError(message || 'Could not save this product. Please check the fields and try again.')
      }
    } catch (err) {
      console.error('Failed to save product:', err)
      setSaveError('Could not reach the server. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    try {
      await fetch(`${CONFIG.apiBaseUrl}/api/products/${id}/`, {
        method:  'DELETE',
        headers: { 'Authorization': `Token ${getToken()}` },
      })
      await fetchProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }

  const inputClass = `w-full border border-mist rounded-sm px-3 py-2.5
                      text-sm text-ink bg-cream
                      focus:outline-none focus:border-sage transition-colors`

  const totalMediaCount = existingMedia.length + newMediaFiles.length
  const slotsLeft = MAX_MEDIA - totalMediaCount

  return (
    <div className="admin-shell min-h-screen bg-cream flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-mist bg-cream/95 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5 lg:px-8">
          <div>
            <h1 className="font-display text-2xl font-normal text-bark">Products</h1>
            <p className="text-ink-muted text-sm font-light">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
            <p className="mt-1 text-xs font-light text-ink-muted">
              Active products appear in the landing carousel. Add photos or videos to each product’s media gallery.
            </p>
          </div>
          <button
            onClick={openAddForm}
            className="bg-bark text-cream text-xs font-medium tracking-widest
                       uppercase px-5 py-2.5 rounded-sm hover:bg-walnut transition-colors">
            + Add product
          </button>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          {showForm && (
            <div className="mb-5 rounded-lg border border-mist bg-paper p-4 sm:p-6">
              <h2 className="font-display text-lg font-normal text-bark mb-5">
                {editingId ? 'Edit product' : 'Add new product'}
              </h2>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-medium tracking-widest uppercase text-ink-muted">
                    Product name *
                  </label>
                  <input type="text" placeholder="e.g. Portrait Engraving"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-medium tracking-widest uppercase text-ink-muted">
                    Price or pricing note
                  </label>
                  <input type="text" placeholder="e.g. From $25, Custom quote, Contact us"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={inputClass}/>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[0.65rem] font-medium tracking-widest uppercase text-ink-muted">
                  Category
                </label>
                <select value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputClass}>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {form.category === 'Other' && (
                  <input type="text" placeholder="Specify the category (e.g. Keychains, Boards)"
                    value={form.customCategory}
                    onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
                    className={`${inputClass} mt-1`}/>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[0.65rem] font-medium tracking-widest uppercase text-ink-muted">
                  Product media ({totalMediaCount}/{MAX_MEDIA})
                </label>

                {(existingMedia.length > 0 || newMediaFiles.length > 0) && (
                  <div className="flex flex-wrap gap-3 mb-2">
                    {existingMedia.map((media) => (
                      <div key={media.id} className="relative w-20 h-20 rounded-sm overflow-hidden border border-mist group">
                        {media.media_type === 'video'
                          ? <video src={media.url} muted playsInline preload="metadata" className="w-full h-full object-cover"/>
                          : <img src={media.url} alt="" className="w-full h-full object-cover"/>
                        }
                        {media.media_type === 'video' && (
                          <span className="absolute bottom-1 left-1 rounded bg-bark/80 px-1 text-[0.5rem] text-cream">VIDEO</span>
                        )}
                        <button type="button" onClick={() => removeExistingMedia(media.id)}
                          aria-label="Remove media item"
                          className="absolute top-0.5 right-0.5 bg-bark/80 text-cream text-xs
                                     w-5 h-5 rounded-full flex items-center justify-center
                                     hover:bg-red-600 transition-colors">
                          ×
                        </button>
                      </div>
                    ))}
                    {newMediaFiles.map((media, i) => (
                      <div key={media.previewUrl} className="relative w-20 h-20 rounded-sm overflow-hidden border border-mist group">
                        {media.mediaType === 'video'
                          ? <video src={media.previewUrl} muted playsInline preload="metadata" className="w-full h-full object-cover"/>
                          : <img src={media.previewUrl} alt="" className="w-full h-full object-cover"/>
                        }
                        <button type="button" onClick={() => removeNewMedia(i)}
                          aria-label="Remove selected media item"
                          className="absolute top-0.5 right-0.5 bg-bark/80 text-cream text-xs
                                     w-5 h-5 rounded-full flex items-center justify-center
                                     hover:bg-red-600 transition-colors">
                          ×
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 bg-bark/70 text-cream
                                         text-[0.55rem] text-center py-0.5">
                          {media.mediaType === 'video' ? 'new video' : 'new photo'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {slotsLeft > 0 ? (
                  <>
                    <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,.mp4,.webm" multiple
                      onChange={handleMediaPick}
                      className="w-full text-sm"/>
                    <span className="text-xs text-ink-muted">
                      Photos: JPG, PNG, or WebP. Videos: MP4 or WebM, up to 50 MB each. Maximum {MAX_MEDIA} photos/videos combined; {slotsLeft} slot{slotsLeft !== 1 ? 's' : ''} left.
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-ink-muted">
                    Maximum of {MAX_MEDIA} media items reached. Remove one to add another.
                  </span>
                )}
                {mediaError && <p role="alert" className="text-xs text-red-600 mt-1">{mediaError}</p>}
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[0.65rem] font-medium tracking-widest uppercase text-ink-muted">
                  Description *
                </label>
                <textarea placeholder="Describe this product..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} resize-y`}/>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-medium tracking-widest uppercase text-ink-muted">
                    Tag (optional)
                  </label>
                  <input type="text" placeholder="e.g. Bestseller"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className={inputClass}/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-medium tracking-widest uppercase text-ink-muted">
                    Emoji (optional)
                  </label>
                  <input type="text" placeholder="e.g. 🖼️"
                    value={form.emoji}
                    onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    className={inputClass}/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-medium tracking-widest uppercase text-ink-muted">
                    Image URL (optional)
                  </label>
                  <input type="url" placeholder="https://..."
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className={inputClass}/>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <input type="checkbox" id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 accent-forest"/>
                <label htmlFor="is_active" className="text-sm text-ink-muted font-light">
                  Show this product on the website
                </label>
              </div>

              {saveError && <p className="text-sm text-red-700 mb-4">{saveError}</p>}

              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving || uploadingMedia}
                  className="bg-bark text-cream text-xs font-medium tracking-widest
                             uppercase px-6 py-2.5 rounded-sm hover:bg-walnut
                             transition-colors disabled:opacity-50">
                  {saving
                    ? 'Saving...'
                    : uploadingMedia
                      ? 'Uploading media...'
                      : editingId ? 'Save changes' : 'Add product'}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null); clearNewMedia() }}
                  className="border border-mist text-ink-muted text-xs font-medium
                             tracking-widest uppercase px-6 py-2.5 rounded-sm
                             hover:border-sage transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center text-ink-muted text-sm font-light py-16">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-ink-muted text-sm font-light py-16">
              No products yet. Click "Add product" to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <div key={product.id}
                  className="bg-paper border border-mist rounded-md overflow-hidden">

                  <div className="aspect-[4/3] bg-mist flex items-center justify-center text-4xl relative">
                    {(product.showcase_images?.[0]?.url || product.image || product.image_url)
                      ? product.showcase_images?.[0]?.media_type === 'video'
                        ? <video
                            src={product.showcase_images[0].url}
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"/>
                        : <img
                            src={product.showcase_images?.[0]?.url || product.image || product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"/>
                      : product.emoji || '📦'
                    }
                    {product.showcase_images?.length > 0 && (
                      <span className="absolute bottom-2 right-2 bg-bark/80 text-cream
                                       text-[0.6rem] font-medium px-2 py-0.5 rounded-sm">
                        {product.showcase_images.length} media item{product.showcase_images.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {product.tag && (
                      <span className="absolute top-2 left-2 bg-bark text-cream
                                       text-[0.6rem] font-medium tracking-wider
                                       uppercase px-2 py-0.5 rounded-sm">
                        {product.tag}
                      </span>
                    )}
                    {!product.is_active && (
                      <span className="absolute top-2 right-2 bg-red-50 text-red-600
                                       text-[0.6rem] font-medium tracking-wider
                                       uppercase px-2 py-0.5 rounded-sm">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-base font-normal text-bark">
                        {product.name}
                      </h3>
                      {product.category && (
                        <span className="text-[0.6rem] uppercase tracking-wider text-forest
                                         border border-mist rounded-full px-2 py-0.5 flex-shrink-0">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-muted font-light leading-relaxed mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-walnut font-medium text-sm">{product.price}</span>
                      <div className="flex gap-2">
                        <button onClick={() => openEditForm(product)}
                          className="text-xs text-forest font-medium hover:text-bark
                                     transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product.id)}
                          className="text-xs text-red-400 font-medium hover:text-red-600
                                     transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}