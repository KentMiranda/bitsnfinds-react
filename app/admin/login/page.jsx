// app/admin/login/page.jsx
// ================================================================
// The login page for Tita Mari's admin panel.
// She enters her username + password here.
// On success, saves the token and redirects to /admin/orders
// ================================================================

'use client'

import { useState }    from 'react'
import { useRouter }   from 'next/navigation'
import { saveAuth }    from '@/lib/auth'
import { CONFIG }      from '@/lib/config'

export default function AdminLoginPage() {
  const router = useRouter()

  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${CONFIG.apiBaseUrl}/api/auth/login/`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        // Save the token and username to localStorage
        saveAuth(data.token, data.username)
        // Redirect to the orders dashboard
        router.push('/admin/orders')
      } else {
        setError(data.error || 'Invalid username or password')
      }
    } catch (err) {
      setError('Could not connect to server. Make sure Django is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-bark rounded-lg flex items-center justify-center
                          text-2xl mx-auto mb-3">
            🌿
          </div>
          <h1 className="font-display text-2xl font-normal text-bark">Bits & Finds</h1>
          <p className="text-ink-muted text-sm font-light mt-1">Owner portal</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit}
          className="bg-paper border border-mist rounded-lg p-6 flex flex-col gap-4">

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700
                            text-sm rounded-sm px-3 py-2">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.65rem] font-medium tracking-widest
                              uppercase text-ink-muted">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="tita_mari"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-mist rounded-sm px-3 py-2.5
                         text-sm text-ink bg-cream
                         focus:outline-none focus:border-sage transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.65rem] font-medium tracking-widest
                              uppercase text-ink-muted">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-mist rounded-sm px-3 py-2.5
                         text-sm text-ink bg-cream
                         focus:outline-none focus:border-sage transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bark text-cream text-xs font-medium
                       tracking-widest uppercase py-3 rounded-sm
                       hover:bg-walnut transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </form>

        <p className="text-center text-xs text-ink-muted mt-4 font-light">
          This page is for the store owner only.
        </p>

      </div>
    </div>
  )
}
