import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    const bucket = searchParams.get('bucket') || 'provider_documents' // Default bucket name

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      )
    }

    // Clean the path - remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    // Generate signed URL (valid for 1 hour)
    const { data, error } = await supabaseServer
      .storage
      .from(bucket)
      .createSignedUrl(cleanPath, 3600) // 1 hour expiration

    if (error) {
      console.error('Error generating signed URL:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ signedUrl: data.signedUrl }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
  } catch (error) {
    console.error('Unexpected error generating signed URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

