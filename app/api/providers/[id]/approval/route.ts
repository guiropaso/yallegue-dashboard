import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { approved } = body

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'approved field must be a boolean' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('providers')
      .update({ is_approved: approved })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating approval status:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
  } catch (error) {
    console.error('Unexpected error updating approval status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

