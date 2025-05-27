import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import path from 'path'
import fs from 'fs'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from Supabase to check subscription status
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get file type from query params
    const { searchParams } = new URL(req.url)
    const fileType = searchParams.get('file')

    if (!fileType) {
      return NextResponse.json({ error: 'File type required' }, { status: 400 })
    }

    let fileName: string
    let contentType: string

    switch (fileType) {
      case 'extension':
        fileName = 'codemap-extension.vsix'
        contentType = 'application/octet-stream'
        break
      case 'agent':
        fileName = 'codemap-agent.zip'
        contentType = 'application/zip'
        break
      default:
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Check if user has access (free users get basic access, paid users get everything)
    const hasAccess = user.plan === 'free' || user.is_active

    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'Subscription required for downloads' 
      }, { status: 403 })
    }

    // Construct file path
    const filePath = path.join(process.cwd(), 'public', 'downloads', fileName)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath)

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 