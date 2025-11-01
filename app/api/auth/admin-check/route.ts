import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('admins')
      .select('email')
      .eq('email', email)
      .single()

    if (error) {
      // If no row found, user is not admin (this is expected)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ isAdmin: false })
      }
      console.error('Error checking admin status:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ isAdmin: !!data }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
  } catch (error) {
    console.error('Unexpected error checking admin status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

