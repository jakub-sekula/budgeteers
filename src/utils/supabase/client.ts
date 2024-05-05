import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function getAuthenticatedObjectUrl(bucket: string, path: string) {
  return `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_CODE}.supabase.co/storage/v1/object/authenticated/${bucket}/${path}`
}