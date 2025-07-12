import { corsHeaders } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  
  try {
    const { searchParams } = new URL(request.url);
    const streamId = searchParams.get('streamId');

    // This is a simple debug endpoint
    // In a real implementation, you'd want to share the activeConnections state
    return NextResponse.json({
      message: 'Debug endpoint - check server logs for connection info',
      streamId: streamId,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders(origin) });
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
} 