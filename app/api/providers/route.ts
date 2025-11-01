import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Use RPC to call the function that queries the private schema view
    const { data, error } = await supabaseServer
      .rpc('get_providers_admin_view')

    if (error) {
      console.error('Error fetching providers:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Add headers to prevent caching
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Unexpected error fetching providers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

