'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, isLoggedIn } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { CONFIG } from '@/lib/config'

const STATUS_STYLES = {
  received:  'bg-red-50 text-red-600',
  confirmed: 'bg-amber-50 text-amber-600',
  engraving: 'bg-yellow-50 text-yellow-600',
  quality:   'bg-blue-50 text-blue-600',
  ready:     'bg-purple-50 text-purple-600',
  shipped:   'bg-teal-50 text-teal-600',
  delivered: 'bg-green-50 text-green-700',
}

const STATUS_LABELS = {
  received:  'Order Received',
  confirmed: 'Design Confirmed',
  engraving: 'Engraving',
  quality:   'Quality Check',
  ready:     'Ready to Ship',
  shipped:   'Shipped',
  delivered: 'Delivered',
}

const DOT_COLORS = {
  received:  'bg-red-400',
  confirmed: 'bg-amber-400',
  engraving: 'bg-yellow-400',
  quality:   'bg-blue-400',
  ready:     'bg-purple-400',
  shipped:   'bg-teal-400',
  delivered: 'bg-green-500',
}

const TABS = ['All', 'Unread', 'Active', 'Done']

export default function AdminOrdersPage() {
  const router = useRouter()

  const [orders,       setOrders]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [activeTab,    setActiveTab]    = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [saving,       setSaving]       = useState(false)
  const [statusUpdate, setStatusUpdate] = useState('')

  useEffect(() => {
    if (!isLoggedIn()) router.push('/admin/login')
    else fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const res = await fetch(`${CONFIG.apiBaseUrl}/api/admin/orders/`, {
        headers: { 'Authorization': `Token ${getToken()}` }
      })
      const data = await res.json()
      if (res.ok) setOrders(data)
      else if (res.status === 401) router.push('/admin/login')
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  async function saveStatus() {
    if (!selectedOrder) return
    setSaving(true)
    try {
      const res = await fetch(
        `${CONFIG.apiBaseUrl}/api/admin/orders/${selectedOrder.id}/`,
        {
          method:  'PATCH',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Token ${getToken()}`,
          },
          body: JSON.stringify({
            status:  statusUpdate || selectedOrder.status,
            is_read: true,
          }),
        }
      )
      if (res.ok) {
        await fetchOrders()
        setSelectedOrder(null)
      }
    } catch (err) {
      console.error('Failed to update order:', err)
    } finally {
      setSaving(false)
    }
  }

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'Unread') return !o.is_read
    if (activeTab === 'Active') return ['confirmed', 'engraving', 'quality', 'ready'].includes(o.status)
    if (activeTab === 'Done')   return ['shipped', 'delivered'].includes(o.status)
    return true
  })

  const unreadCount = orders.filter((o) => !o.is_read).length

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <AdminSidebar />

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col border-r border-mist bg-paper ${selectedOrder ? 'w-80 flex-shrink-0' : 'flex-1'}`}>
          <div className="px-5 py-4 border-b border-mist flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-normal text-bark">Orders</h1>
              <p className="text-ink-muted text-xs font-light">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-50 text-red-600 text-xs font-medium
                               px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 px-5 py-3 border-b border-mist">
            {[
              { label: 'Total',  value: orders.length },
              { label: 'Active', value: orders.filter(o => ['confirmed','engraving','quality','ready'].includes(o.status)).length },
              { label: 'Done',   value: orders.filter(o => ['shipped','delivered'].includes(o.status)).length },
            ].map((s) => (
              <div key={s.label} className="bg-cream rounded-md p-2">
                <div className="text-xl font-medium text-bark">{s.value}</div>
                <div className="text-xs text-ink-muted font-light">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex border-b border-mist">
            {TABS.map((tab) => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors
                            border-b-2 -mb-px
                            ${activeTab === tab
                              ? 'text-forest border-forest'
                              : 'text-ink-muted border-transparent hover:text-bark'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-ink-muted text-sm font-light">
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-ink-muted text-sm font-light">
                No orders here yet.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <button key={order.id}
                  onClick={() => { setSelectedOrder(order); setStatusUpdate(order.status) }}
                  className={`w-full text-left px-5 py-3.5 border-b border-mist
                              flex items-center gap-3 transition-colors
                              ${selectedOrder?.id === order.id
                                ? 'bg-mist/40'
                                : 'hover:bg-cream'}`}>

                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT_COLORS[order.status] || 'bg-gray-300'}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-bark truncate">
                        {order.name}
                      </span>
                      {!order.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-ink-muted font-light truncate">
                      {order.product_type}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[0.6rem] font-medium px-1.5 py-0.5 rounded-sm
                                      ${STATUS_STYLES[order.status] || 'bg-gray-50 text-gray-500'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <span className="text-[0.65rem] text-ink-muted">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {selectedOrder && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-mist flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-ink-muted hover:text-bark transition-colors text-sm">
                  ← Back
                </button>
                <div>
                  <h2 className="font-display text-lg font-normal text-bark">
                    {selectedOrder.name}
                  </h2>
                  <p className="text-xs text-ink-muted font-light">
                    {selectedOrder.order_number}
                  </p>
                </div>
              </div>
              {!selectedOrder.is_read && (
                <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  Unread
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
              <div className="bg-paper border border-mist rounded-md p-4">
                <p className="text-[0.65rem] font-medium tracking-widest uppercase
                              text-ink-muted mb-3">
                  Customer info
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Name',    value: selectedOrder.name         },
                    { label: 'Email',   value: selectedOrder.email        },
                    { label: 'Phone',   value: selectedOrder.phone_number },
                    { label: 'Product', value: selectedOrder.product_type },
                    { label: 'Date',    value: formatDate(selectedOrder.created_at) },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-xs text-ink-muted">{row.label}</span>
                      <span className="text-xs font-medium text-bark text-right max-w-[60%]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-paper border border-mist rounded-md p-4">
                <p className="text-[0.65rem] font-medium tracking-widest uppercase
                              text-ink-muted mb-2">
                  Their request
                </p>
                <p className="text-sm text-ink-muted font-light leading-relaxed italic">
                  "{selectedOrder.details}"
                </p>
              </div>

              <div className="bg-paper border border-mist rounded-md p-4">
                <p className="text-[0.65rem] font-medium tracking-widest uppercase
                              text-ink-muted mb-3">
                  Update status
                </p>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full border border-mist rounded-sm px-3 py-2
                             text-sm text-ink bg-cream
                             focus:outline-none focus:border-sage transition-colors mb-3">
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                <button
                  onClick={saveStatus}
                  disabled={saving}
                  className="w-full border border-forest text-forest text-xs font-medium
                             tracking-widest uppercase py-2.5 rounded-sm
                             hover:bg-forest hover:text-cream transition-colors
                             disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>

            </div>
          </div>
        )}

        {!selectedOrder && !loading && filteredOrders.length > 0 && (
          <div className="flex-1 flex items-center justify-center text-ink-muted
                          text-sm font-light">
            Select an order to view details
          </div>
        )}

      </div>
    </div>
  )
}
