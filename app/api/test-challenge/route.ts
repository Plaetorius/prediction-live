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

    console.log('🧪 Test challenge broadcast requested for stream:', streamId);

    // Create dummy challenge data
    const dummyChallenge = {
      id: 'test-challenge-' + Date.now(),
      title: 'Test Challenge - Who will win?',
      event_type: 'test_event',
      stream_id: streamId,
      state: 'open',
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      options: [
        {
          id: 'option-1',
          challenge_id: 'test-challenge-' + Date.now(),
          option_key: 'team_a',
          display_name: 'Team A',
          token_name: 'TEAM_A',
          created_at: new Date().toISOString(),
          odds: 2.0
        },
        {
          id: 'option-2',
          challenge_id: 'test-challenge-' + Date.now(),
          option_key: 'team_b',
          display_name: 'Team B',
          token_name: 'TEAM_B',
          created_at: new Date().toISOString(),
          odds: 1.5
        }
      ],
      metadata: {
        total_options: 2,
        stream_id: streamId,
        event_type: 'test_event',
        broadcast_timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    // Send the challenge event to the broadcast endpoint
    const broadcastUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/broadcast'
      : 'https://prediction-live.vercel.app/api/broadcast';

    console.log('🌐 Sending challenge:new to broadcast endpoint:', broadcastUrl);

    const response = await fetch(broadcastUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        streamId: streamId,
        event: 'challenge:new',
        payload: dummyChallenge
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test challenge broadcast successful:', result);
      return NextResponse.json({
        success: true,
        result: result,
        challenge: dummyChallenge
      }, { headers: corsHeaders(origin) });
    } else {
      const error = await response.json();
      console.error('❌ Test challenge broadcast failed:', error);
      return NextResponse.json({
        success: false,
        error: error
      }, { status: response.status, headers: corsHeaders(origin) });
    }
  } catch (error) {
    console.error('❌ Test challenge broadcast error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
} 