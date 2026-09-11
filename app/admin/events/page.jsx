'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { CONFIG } from '@/lib/config'
import { getToken, isLoggedIn } from '@/lib/auth'

const EMPTY_FORM = {
  title: '', date: '', location: '', description: '', image_url: '', is_past: false, is_active: true
}

export default function AdminEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) router.push('/admin/login')
    else fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const response = await fetch(`${CONFIG.apiBaseUrl}/api/events/`, {
        headers: { Authorization: `Token ${getToken()}` }
      })
      const data = await response.json()
      if (response.ok) setEvents(data)
      else if (response.status === 401) router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  function editEvent(event) {
    setEditingId(event.id)
    setForm({ ...event, date: event.date || '' })
    setShowForm(true)
  }

  async function saveEvent() {
    setSaving(true)
    try {
      const response = await fetch(
        `${CONFIG.apiBaseUrl}/api/events/${editingId ? `${editingId}/` : ''}`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${getToken()}`
          },
          body: JSON.stringify(form)
        }
      )
      if (response.ok) {
        await fetchEvents()
        setForm(EMPTY_FORM)
        setEditingId(null)
        setShowForm(false)
      }
    } finally {
      setSaving(false)
    }
  }

  async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return
    await fetch(`${CONFIG.apiBaseUrl}/api/events/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${getToken()}` }
    })
    fetchEvents()
  }

  const inputClass = 'w-full border border-mist rounded-sm px-3 py-2.5 text-sm text-ink bg-cream focus:outline-none focus:border-sage'

  return (
    <div className="min-h-screen bg-cream flex">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="px-8 py-6 border-b border-mist flex items-center justify-between sticky top-0 bg-cream/95 backdrop-blur-sm z-10">
          <div>
            <h1 className="font-display text-2xl text-bark">Events</h1>
            <p className="text-ink-muted text-sm font-light">Manage events shown on the landing page.</p>
          </div>
          <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }}
            className="bg-bark text-cream text-xs font-medium tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-walnut">
            + Add event
          </button>
        </header>

        <div className="px-8 py-6">
          {showForm && (
            <section className="bg-paper border border-mist rounded-lg p-6 mb-6">
              <h2 className="font-display text-lg text-bark mb-5">{editingId ? 'Edit event' : 'Add event'}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input className={inputClass} placeholder="Event title" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input className={inputClass} type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <input className={inputClass} placeholder="Location (optional)" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <input className={inputClass} placeholder="Image URL (optional)" value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              </div>
              <textarea className={`${inputClass} mt-4 min-h-24`} placeholder="Short event description (optional)"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-6 mt-4 text-sm text-ink-muted">
                <label><input type="checkbox" checked={form.is_past}
                  onChange={(e) => setForm({ ...form, is_past: e.target.checked })} /> <span className="ml-2">Past event</span></label>
                <label><input type="checkbox" checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> <span className="ml-2">Show on landing page</span></label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={saveEvent} disabled={saving || !form.title || !form.date}
                  className="bg-bark text-cream text-xs uppercase tracking-widest px-5 py-2.5 rounded-sm disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save event'}
                </button>
                <button onClick={() => setShowForm(false)} className="border border-mist text-bark text-xs uppercase tracking-widest px-5 py-2.5 rounded-sm">
                  Cancel
                </button>
              </div>
            </section>
          )}

          {loading ? <p className="text-ink-muted">Loading events...</p> : events.length === 0 ? (
            <p className="text-ink-muted">No events yet. Add an event to show it on the landing page.</p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {events.map((event) => (
                <article key={event.id} className="bg-paper border border-mist rounded-lg overflow-hidden">
                  {event.image_url && <img src={event.image_url} alt="" className="w-full h-36 object-cover" />}
                  <div className="p-5">
                    <div className="flex justify-between gap-3">
                      <h2 className="font-display text-lg text-bark">{event.title}</h2>
                      <span className="text-[0.6rem] uppercase tracking-widest text-forest">{event.is_past ? 'Past' : 'Upcoming'}</span>
                    </div>
                    <p className="text-sm text-walnut mt-2">{event.date}{event.location ? ` · ${event.location}` : ''}</p>
                    {event.description && <p className="text-xs text-ink-muted mt-3">{event.description}</p>}
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => editEvent(event)} className="text-xs uppercase tracking-widest text-forest">Edit</button>
                      <button onClick={() => deleteEvent(event.id)} className="text-xs uppercase tracking-widest text-red-700">Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
