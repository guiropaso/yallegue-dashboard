import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const documentType = searchParams.get('type') as 'dui_front_url' | 'dui_back_url' | 'police_record_url' | null

    if (!documentType || !['dui_front_url', 'dui_back_url', 'police_record_url'].includes(documentType)) {
      return NextResponse.json(
        { error: 'Invalid document type. Must be one of: dui_front_url, dui_back_url, police_record_url' },
        { status: 400 }
      )
    }

    // Update the provider_documents table to set the document URL to null
    const { data, error } = await supabaseServer
      .from('provider_documents')
      .update({ [documentType]: null })
      .eq('provider_id', id)
      .select()
      .single()

    if (error) {
      console.error('Error deleting document:', error)
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
    console.error('Unexpected error deleting document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

