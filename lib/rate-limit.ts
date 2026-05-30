import { supabaseServer } from '@/lib/clients/supabase-server'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

// Simple rate limiting using Supabase
// Stores counts in a rate_limits table (we'll create it below)
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMinutes: number
): Promise<RateLimitResult> {
  const now       = new Date()
  const windowMs  = windowMinutes * 60 * 1000
  const resetAt   = new Date(now.getTime() + windowMs)

  try {
    // Get current count for this key
    const { data } = await supabaseServer
      .from('rate_limits')
      .select('count, reset_at')
      .eq('key', key)
      .gt('reset_at', now.toISOString())
      .single()

    if (!data) {
      // First request in this window — create record
      await supabaseServer.from('rate_limits').upsert({
        key,
        count:    1,
        reset_at: resetAt.toISOString(),
      }, { onConflict: 'key' })

      return { allowed: true, remaining: maxRequests - 1, resetAt }
    }

    if (data.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetAt: new Date(data.reset_at) }
    }

    // Increment count
    await supabaseServer
      .from('rate_limits')
      .update({ count: data.count + 1 })
      .eq('key', key)

    return {
      allowed:   true,
      remaining: maxRequests - data.count - 1,
      resetAt:   new Date(data.reset_at),
    }
  } catch {
    // If rate limit check fails, allow the request
    return { allowed: true, remaining: maxRequests, resetAt }
  }
}

// Get client IP from request headers
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const real      = req.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || real || 'unknown'
}
