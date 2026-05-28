function normalizeSupabaseUrl(raw: string): string {
  let url = raw.trim().replace(/\/+$/, "")
  // Common mistake: pasting the REST endpoint instead of the project URL
  url = url.replace(/\/rest\/v1\/?$/i, "")
  return url
}

function isValidAnonKey(key: string): boolean {
  // Supabase anon/service keys are JWTs; sb_publishable_* keys are not supported by @supabase/ssr
  return key.startsWith("eyJ")
}

export function getSupabaseEnv() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!rawUrl || !anonKey) return null

  const url = normalizeSupabaseUrl(rawUrl)
  if (!url.includes("supabase.co")) return null
  if (!isValidAnonKey(anonKey)) return null

  return { url, anonKey }
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null
}

export function getSupabaseConfigError(): string | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!rawUrl || !anonKey) {
    return "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
  }
  if (!normalizeSupabaseUrl(rawUrl).includes("supabase.co")) {
    return "NEXT_PUBLIC_SUPABASE_URL must be your project URL, e.g. https://YOUR_PROJECT.supabase.co (not the /rest/v1 path)."
  }
  if (!isValidAnonKey(anonKey)) {
    return "NEXT_PUBLIC_SUPABASE_ANON_KEY must be the anon JWT from Supabase → Settings → API (starts with eyJ). Do not use sb_publishable_* keys."
  }
  return null
}
