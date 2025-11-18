import { askTaTTTyAPI } from '../data'

export async function enhanceStory(story: string): Promise<string> {
  if (!askTaTTTyAPI.baseURL) {
    throw new Error('CRITICAL: askTaTTTyAPI.baseURL is not configured')
  }
  if (!askTaTTTyAPI.enhanceEndpoint) {
    throw new Error('CRITICAL: enhance endpoint is not configured')
  }
  let url: string
  try {
    url = new URL(askTaTTTyAPI.enhanceEndpoint, askTaTTTyAPI.baseURL).toString()
  } catch {
    throw new Error('CRITICAL: Invalid baseURL or endpoint configuration')
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ story }),
    signal: AbortSignal.timeout(askTaTTTyAPI.requestTimeout),
  })
  if (!res.ok) {
    let msg = `Backend error: HTTP ${res.status} ${res.statusText}`
    try {
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        const err = await res.json()
        if (err?.error) msg = err.error
      } else {
        const text = await res.text()
        if (text) msg = `${msg} - ${text}`
      }
    } catch {}
    throw new Error(msg)
  }
  const ct = (res.headers.get('content-type') || '').toLowerCase()
  if (!ct.includes('application/json')) {
    throw new Error('Backend error: Unsupported Content-Type')
  }
  const data = await res.json()
  const enhanced = data?.result?.enhanced_story
  if (!enhanced || typeof enhanced !== 'string') {
    throw new Error('Backend error: Missing result.enhanced_story')
  }
  return enhanced
}