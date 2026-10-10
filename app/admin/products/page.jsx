'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, isLoggedIn } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { CONFIG } from '@/lib/config'

const EMPTY_FORM = {
  name: '', description: '', price: '', tag: '', emoji: '',
  category: 'General', customCategory: '',
  image_url: '', is_active: true
}

const MAX_IMAGES = 5

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

  const [newImageFiles,   setNewImageFiles]   = useState([])
  const [existingImages,  setExistingImages]  = useState([])
  const [imageError,      setImageError]      = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) router.push('/admin/login')
    else fetchProducts()
  }, [])

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
    setNewImageFiles([])
    setExistingImages([])
    setImageError('')
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
    setNewImageFiles([])
    setExistingImages(product.showcase_images || [])
    setImageError('')
    setSaveError('')
    setShowForm(true)
  }

  function handleImagePick(e) {
    const picked = Array.from(e.target.files || [])
    e.target.value = ''
    if (picked.length === 0) return

    const remainingSlots = MAX_IMAGES - existingImages.length - newImageFiles.length
    if (remainingSlots <= 0) {
      setImageError(`You can only have ${MAX_IMAGES} images per product.`)
      return
    }

    const accepted = picked.slice(0, remainingSlots)
    if (picked.length > remainingSlots) {
      setImageError(`Only added ${accepted.length} of ${picked.length} — max ${MAX_IMAGES} images per product.`)
    } else {
      setImageError('')
    }

    setNewImageFiles(prev => [...prev, ...accepted])
  }

  function removeNewImage(index) {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    setImageError('')
  }

  async function removeExistingImage(imageId) {
    if (!editingId) return
    if (!confirm('Remove this image?')) return
    try {
      const res = await fetch(
        `${CONFIG.apiBaseUrl}/api/products/${editingId}/showcase-images/${imageId}/`,
        { method: 'DELETE', headers: { 'Authorization': `Token ${getToken()}` } }
      )
      if (res.ok) {
        setExistingImages(prev => prev.filter(img => img.id !== imageId))
      } else {
        setImageError('Could not remove that image. Please try again.')
      }
    } catch (err) {
      console.error('Failed to delete image:', err)
      setImageError('Could not reach the server to remove that image.')
    }
  }

  async function uploadNewImages(productId) {
    if (newImageFiles.length === 0) return true

    setUploadingImages(true)
    try {
      const body = new FormData()
      newImageFiles.forEach(file => body.append('images', file))

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
      setImageError(data.error || 'Some images failed to upload.')
      return false
    } catch (err) {
      console.error('Failed to upload images:', err)
      setImageError('Could not reach the server to upload images.')
      return false
    } finally {
      setUploadingImages(false)
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

        const imagesOk = await uploadNewImages(productId)

        await fetchProducts()
        if (imagesOk) {
          setShowForm(false)
          setEditingId(null)
          setForm(EMPTY_FORM)
          setNewImageFiles([])
          setExistingImages([])
        } else {
          setNewImageFiles([])
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

  const totalImageCount = existingImages.length + newImageFiles.length
  const slotsLeft = MAX_IMAGES - totalImageCount

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
              Active products appear in the landing carousel. Edit a product’s images to change its carousel photo.
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
                  Product images ({totalImageCount}/{MAX_IMAGES})
                </label>

                {(existingImages.length > 0 || newImageFiles.length > 0) && (
                  <div className="flex flex-wrap gap-3 mb-2">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative w-20 h-20 rounded-sm overflow-hidden border border-mist group">
                        <img src={img.url} alt="" className="w-full h-full object-cover"/>
                        <button type="button" onClick={() => removeExistingImage(img.id)}
                          className="absolute top-0.5 right-0.5 bg-bark/80 text-cream text-xs
                                     w-5 h-5 rounded-full flex items-center justify-center
                                     hover:bg-red-600 transition-colors">
                          ×
                        </button>
                      </div>
                    ))}
                    {newImageFiles.map((file, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-sm overflow-hidden border border-mist group">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover"/>
                        <button type="button" onClick={() => removeNewImage(i)}
                          className="absolute top-0.5 right-0.5 bg-bark/80 text-cream text-xs
                                     w-5 h-5 rounded-full flex items-center justify-center
                                     hover:bg-red-600 transition-colors">
                          ×
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 bg-bark/70 text-cream
                                         text-[0.55rem] text-center py-0.5">
                          new
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {slotsLeft > 0 ? (
                  <>
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                      onChange={handleImagePick}
                      className="w-full text-sm"/>
                    <span className="text-xs text-ink-muted">
                      JPEG, PNG, or WebP. Up to {MAX_IMAGES} images total — {slotsLeft} slot{slotsLeft !== 1 ? 's' : ''} left.
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-ink-muted">
                    Maximum of {MAX_IMAGES} images reached. Remove one to add another.
                  </span>
                )}
                {imageError && <p className="text-xs text-red-600 mt-1">{imageError}</p>}
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
                <button onClick={handleSave} disabled={saving || uploadingImages}
                  className="bg-bark text-cream text-xs font-medium tracking-widest
                             uppercase px-6 py-2.5 rounded-sm hover:bg-walnut
                             transition-colors disabled:opacity-50">
                  {saving
                    ? 'Saving...'
                    : uploadingImages
                      ? 'Uploading images...'
                      : editingId ? 'Save changes' : 'Add product'}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null) }}
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
                      ? <img
                          src={product.showcase_images?.[0]?.url || product.image || product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"/>
                      : product.emoji || '📦'
                    }
                    {product.showcase_images?.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-bark/80 text-cream
                                       text-[0.6rem] font-medium px-2 py-0.5 rounded-sm">
                        +{product.showcase_images.length - 1} more
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