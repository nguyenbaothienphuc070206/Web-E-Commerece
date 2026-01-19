import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, createUser, toPublicUser } from '../../_store'
import { createSessionToken } from '@/lib/server/auth'
import { getSupabaseAdminClient } from '@/lib/server/supabase'

interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope: string
  token_type: string
  id_token: string
}

interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Check for OAuth errors
  if (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
  }

  // Verify state (CSRF protection)
  const storedState = request.cookies.get('oauth_state')?.value
  if (!state || state !== storedState) {
    console.error('State mismatch')
    return NextResponse.redirect(`${origin}/login?error=state_mismatch`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(`${origin}/login?error=token_exchange_failed`)
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json()

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      console.error('Failed to fetch user info')
      return NextResponse.redirect(`${origin}/login?error=user_info_failed`)
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json()

    // Get Supabase admin client
    const supabase = getSupabaseAdminClient()

    try {
      // Check if user already exists
      let user = await findUserByEmail(googleUser.email)
      let userId: string

      if (user) {
        // User exists - update profile information
        userId = user.id
        
        const { error: updateError } = await supabase
          .from('users')
          .update({
            full_name: googleUser.name,
            avatar_url: googleUser.picture,
            email_verified: googleUser.verified_email,
            last_sign_in_at: new Date().toISOString(),
          })
          .eq('id', userId)

        if (updateError) {
          console.error('Failed to update user profile:', updateError)
        }
      } else {
        // User doesn't exist - create new user
        user = await createUser({
          email: googleUser.email,
          passwordHash: '', // OAuth users don't have passwords
          name: googleUser.name,
          role: 'user',
        })
        
        userId = user.id

        // Update additional OAuth-specific fields
        const { error: updateError } = await supabase
          .from('users')
          .update({
            avatar_url: googleUser.picture,
            email_verified: googleUser.verified_email,
            last_sign_in_at: new Date().toISOString(),
          })
          .eq('id', userId)

        if (updateError) {
          console.error('Failed to update new user profile:', updateError)
        }
      }

      // Store or update OAuth provider information
      const { error: oauthError } = await supabase
        .from('oauth_providers')
        .upsert({
          user_id: userId,
          provider: 'google',
          provider_user_id: googleUser.id,
          provider_email: googleUser.email,
          provider_data: googleUser,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        }, {
          onConflict: 'provider,provider_user_id'
        })

      if (oauthError) {
        console.error('Failed to store OAuth provider info:', oauthError)
        // Continue anyway since user creation/login succeeded
      }

      // Create session token using our custom auth system
      const sessionToken = createSessionToken(toPublicUser(user), 7 * 24 * 60 * 60) // 7 days

      // Set session cookie
      const response = NextResponse.redirect(`${origin}/account`)
      response.cookies.set('session_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })

      // Clear state cookie
      response.cookies.delete('oauth_state')

      return response

    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      return NextResponse.redirect(`${origin}/login?error=database_error`)
    }

  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${origin}/login?error=exception`)
  }
}
