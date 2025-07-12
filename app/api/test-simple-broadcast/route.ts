import { corsHeaders } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  
  try {
    const body = await request.json();
    const { streamId } = body;

    if (!streamId) {
      return NextResponse.json(
        { error: 'Missing required field: streamId' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    console.log('🧪 Simple test broadcast for stream:', streamId);

    // Send a simple test message directly to the broadcast endpoint
    const broadcastUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/broadcast'
      : 'https://prediction-live.vercel.app/api/broadcast';

    console.log('🌐 Sending simple test to:', broadcastUrl);

    const response = await fetch(broadcastUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        streamId: streamId,
        event: 'test:simple',
        payload: {
          message: `Simple test message at ${new Date().toISOString()}`,
          test: true,
          timestamp: new Date().toISOString()
        }
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Simple test broadcast successful:', result);
      return NextResponse.json({
        success: true,
        result: result,
        message: 'Simple test message sent successfully'
      }, { headers: corsHeaders(origin) });
    } else {
      const error = await response.json();
      console.error('❌ Simple test broadcast failed:', error);
      return NextResponse.json({
        success: false,
        error: error
      }, { status: response.status, headers: corsHeaders(origin) });
    }
  } catch (error) {
    console.error('❌ Simple test broadcast error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
} 