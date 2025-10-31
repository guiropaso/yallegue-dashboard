import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

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

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error fetching providers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

