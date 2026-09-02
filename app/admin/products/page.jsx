// app/admin/products/page.jsx
// ================================================================
// Products management page — Tita Mari can:
// - See all products
// - Add a new product
// - Edit an existing product
// - Delete a product
// ================================================================

'use client'

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/navigation'
import { getToken, isLoggedIn } from '@/lib/auth'
import AdminSidebar             from '@/components/admin/AdminSidebar'
import { CONFIG }               from '@/lib/config'

const EMPTY_FORM = {
  name: '', description: '', price: '', tag: '', emoji: '', image_url: '', is_active: true
}

export default function AdminProductsPage() {
  const router = useRouter()

  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [saving,    setSaving]    = useState(false)

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
    setShowForm(true)
  }

  function openEditForm(product) {
    setForm({
      name:        product.name,
      description: product.description,
      price:       product.price,
      tag:         product.tag        || '',
      emoji:       product.emoji      || '',
      image_url:   product.image_url  || '',
      is_active:   product.is_active,
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const url    = editingId
        ? `${CONFIG.apiBaseUrl}/api/products/${editingId}/`
        : `${CONFIG.apiBaseUrl}/api/products/`
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Token ${getToken()}`,
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        await fetchProducts()
        setShowForm(false)
        setEditingId(null)
        setForm(EMPTY_FORM)
      }
    } catch (err) {
      console.error('Failed to save product:', err)
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

  return (
    <div className="min-h-screen bg-cream flex">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="px-8 py-6 border-b border-mist flex items-center justify-between
                        sticky top-0 bg-cream/95 backdrop-blur-sm z-10">
          <div>
            <h1 className="font-display text-2xl font-normal text-bark">Products</h1>
            <p className="text-ink-muted text-sm font-light">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={openAddForm}
            className="bg-bark text-cream text-xs font-medium tracking-widest
                       uppercase px-5 py-2.5 rounded-sm hover:bg-walnut transition-colors">
            + Add product
          </button>
        </div>

        <div className="px-8 py-6">

          {/* Add/Edit form */}
          {showForm && (
            <div className="bg-paper border border-mist rounded-lg p-6 mb-6">
              <h2 className="font-display text-lg font-normal text-bark mb-5">
                {editingId ? 'Edit product' : 'Add new product'}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
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
                    Price *
                  </label>
                  <input type="text" placeholder="e.g. From ₱1,800"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={inputClass}/>
                </div>
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

              <div className="grid grid-cols-3 gap-4 mb-4">
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

              {/* Active toggle */}
              <div className="flex items-center gap-3 mb-5">
                <input type="checkbox" id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 accent-forest"/>
                <label htmlFor="is_active" className="text-sm text-ink-muted font-light">
                  Show this product on the website
                </label>
              </div>

              {/* Form buttons */}
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving}
                  className="bg-bark text-cream text-xs font-medium tracking-widest
                             uppercase px-6 py-2.5 rounded-sm hover:bg-walnut
                             transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
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

          {/* Products grid */}
          {loading ? (
            <div className="text-center text-ink-muted text-sm font-light py-16">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-ink-muted text-sm font-light py-16">
              No products yet. Click "Add product" to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id}
                  className="bg-paper border border-mist rounded-md overflow-hidden">

                  {/* Product image / placeholder */}
                  <div className="aspect-[4/3] bg-mist flex items-center justify-center
                                  text-4xl relative">
                    {product.image_url
                      ? <img src={product.image_url} alt={product.name}
                             className="w-full h-full object-cover"/>
                      : product.emoji || '📦'
                    }
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

                  {/* Product info */}
                  <div className="p-4">
                    <h3 className="font-display text-base font-normal text-bark mb-0.5">
                      {product.name}
                    </h3>
                    <p className="text-xs text-ink-muted font-light leading-relaxed mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-wheat font-medium text-sm">{product.price}</span>
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
