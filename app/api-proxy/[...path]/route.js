const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || 'https://bitsnfinds-backend.onrender.com'
).replace(/\/+$/, '')

const ALLOWED_PREFIXES = new Set(['api', 'health'])
const FORWARDED_REQUEST_HEADERS = ['accept', 'authorization', 'content-type', 'x-csrftoken']
const FORWARDED_RESPONSE_HEADERS = ['cache-control', 'content-type']

async function proxyRequest(request, { params }) {
  if (process.env.NODE_ENV !== 'development') {
    return new Response('Not found', { status: 404 })
  }

  const path = params.path || []
  if (!ALLOWED_PREFIXES.has(path[0])) {
    return Response.json({ error: 'Unsupported API path' }, { status: 404 })
  }

  const target = new URL(
    `/${path.map((segment) => encodeURIComponent(segment)).join('/')}${request.nextUrl.pathname.endsWith('/') ? '/' : ''}${request.nextUrl.search}`,
    API_ORIGIN
  )
  const headers = new Headers()
  FORWARDED_REQUEST_HEADERS.forEach((name) => {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  })

  const method = request.method

  try {
    const upstream = await fetch(target, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer(),
      cache: 'no-store',
    })
    const responseHeaders = new Headers()
    FORWARDED_RESPONSE_HEADERS.forEach((name) => {
      const value = upstream.headers.get(name)
      if (value) responseHeaders.set(name, value)
    })

    return new Response(
      method === 'HEAD' || upstream.status === 204 || upstream.status === 304
        ? null
        : upstream.body,
      {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
      }
    )
  } catch (error) {
    console.error(`Local API proxy failed for ${request.method} ${target.pathname}:`, error)
    return Response.json({ error: 'Could not reach the configured API server' }, { status: 502 })
  }
}

export const GET = proxyRequest
export const HEAD = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const PATCH = proxyRequest
export const DELETE = proxyRequest
