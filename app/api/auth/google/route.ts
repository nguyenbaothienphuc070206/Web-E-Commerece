import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const roleParam = searchParams.get('role') // Get role parameter (admin or customer)
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  
  // Generate state for CSRF protection, include role if provided
  const state = JSON.stringify({
    random: Math.random().toString(36).substring(7),
    role: roleParam || 'user'
  })
  
  const params = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: state,
  }

  // Add params to URL
  Object.entries(params).forEach(([key, value]) => {
    googleAuthUrl.searchParams.append(key, value)
  })

  // Store state in cookie for verification
  const response = NextResponse.redirect(googleAuthUrl.toString())
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  })

  return response
}