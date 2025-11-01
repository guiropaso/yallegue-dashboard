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
    const { registration_step } = body

    if (typeof registration_step !== 'number') {
      return NextResponse.json(
        { error: 'registration_step must be a number' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('providers')
      .update({ registration_step })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating registration step:', error)
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
    console.error('Unexpected error updating registration step:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

