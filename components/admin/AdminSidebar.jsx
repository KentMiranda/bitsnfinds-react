'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/lib/auth'

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  function handleLogout() {
    logout()
    router.push('/admin/login')
  }

  const isActive = (path) => pathname.startsWith(path)

  return (
    <aside className="w-14 bg-bark flex flex-col items-center py-4 gap-3 flex-shrink-0">
      <div className="w-8 h-8 bg-forest rounded-md flex items-center justify-center text-cream text-xs font-display font-bold mb-2">
        B
      </div>

      <Link href="/admin/orders"
        title="Orders"
        className={`w-9 h-9 rounded-md flex items-center justify-center text-lg transition-colors
                    ${isActive('/admin/orders')
                      ? 'bg-forest text-cream'
                      : 'text-cream/40 hover:text-cream hover:bg-forest/50'}`}>
        📋
      </Link>

      <Link href="/admin/products"
        title="Products"
        className={`w-9 h-9 rounded-md flex items-center justify-center text-lg transition-colors
                    ${isActive('/admin/products')
                      ? 'bg-forest text-cream'
                      : 'text-cream/40 hover:text-cream hover:bg-forest/50'}`}>
        📦
      </Link>

      <button
        onClick={handleLogout}
        title="Log out"
        className="mt-auto w-9 h-9 rounded-md flex items-center justify-center text-lg text-cream/40 hover:text-cream hover:bg-forest/50 transition-colors">
        🚪
      </button>
    </aside>
  )
}
