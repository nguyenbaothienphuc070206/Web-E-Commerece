import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: string
  email_verified: boolean
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')?.value

  if (!sessionToken) {
    return null
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // Verify session
  const { data: session } = await supabase
    .from('user_sessions')
    .select('user_id, expires_at')
    .eq('session_token', sessionToken)
    .single()

  if (!session || new Date(session.expires_at) < new Date()) {
    return null
  }

  // Get user data
  const { data: user } = await supabase
    .from('users')
    .select('id, email, full_name, avatar_url, role, email_verified')
    .eq('id', session.user_id)
    .single()

  return user
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}
