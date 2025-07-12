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
    const { streamId, message } = body;

    if (!streamId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: streamId, message' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    console.log('🧪 Test broadcast requested for stream:', streamId);
    console.log('📝 Message:', message);

    // Send the test message to the broadcast endpoint
    const broadcastUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/broadcast'
      : 'https://prediction-live.vercel.app/api/broadcast';

    console.log('🌐 Sending to broadcast endpoint:', broadcastUrl);

    const response = await fetch(broadcastUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        streamId: streamId,
        event: 'test:message',
        payload: {
          message: message,
          timestamp: new Date().toISOString(),
          test: true
        }
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test broadcast successful:', result);
      return NextResponse.json({
        success: true,
        result: result
      }, { headers: corsHeaders(origin) });
    } else {
      const error = await response.json();
      console.error('❌ Test broadcast failed:', error);
      return NextResponse.json({
        success: false,
        error: error
      }, { status: response.status, headers: corsHeaders(origin) });
    }
  } catch (error) {
    console.error('❌ Test broadcast error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
} 