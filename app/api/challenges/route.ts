import { createChallenge, getChallenges } from '@/lib/challenges/actions';
import { corsHeaders } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

interface ChallengeOption {
  id: string;
  challenge_id: string;
  option_key: string;
  display_name: string;
  token_name: string;
  created_at: string;
  updated_at?: string;
}

interface Challenge {
  id: string;
  title: string;
  event_type: string;
  stream_id: string;
  state?: string;
  created_at: string;
  updated_at?: string;
  started_at?: string;
  closing_at?: string;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  
  try {
    console.log('🔍 API: Starting to fetch challenges...');
    const result = await getChallenges();

    console.log('📊 API: getChallenges result:', {
      hasError: !!result.error,
      hasData: !!result.data,
      dataType: typeof result.data,
      dataLength: Array.isArray(result.data) ? result.data.length : 'not an array'
    });

    if (result.error) {
      console.error('❌ API: Error from getChallenges:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    console.log('✅ API: Returning challenges data:', result.data);
    return NextResponse.json(result.data, { headers: corsHeaders(origin) });
  } catch (error) {
    console.error('❌ API: Unexpected error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  
  try {
    const body = await request.json();
    
    // Ensure we have a valid stream ID (UUID format)
    let actualStreamId = body.streamId;
    
    // If streamId is not a UUID, try to look it up
    if (!/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(body.streamId)) {
      console.log('🔎 Looking up stream ID for username:', body.streamId);
      
      try {
        const lookupResponse = await fetch(`${request.nextUrl.origin}/api/streams/lookup?twitchStreamId=${encodeURIComponent(body.streamId)}`);
        
        if (lookupResponse.ok) {
          const lookupData = await lookupResponse.json();
          actualStreamId = lookupData.id;
          console.log('✅ Resolved stream ID:', actualStreamId, 'from username:', body.streamId);
        } else {
          console.log('⚠️ Stream lookup failed, using original streamId:', body.streamId);
        }
      } catch {
        console.log('⚠️ Stream lookup error, using original streamId:', body.streamId);
      }
    }

    // Update the body with the resolved stream ID
    const challengeData = {
      ...body,
      streamId: actualStreamId
    };

    const result = await createChallenge(challengeData);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    // Check if result.data exists and extract challenge and options data
    if (!result.data) {
      return NextResponse.json(
        { error: 'No data returned from challenge creation' },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    const { challenge, options } = result.data as { challenge: Challenge; options: ChallengeOption[] };

    console.log('🎯 API: Challenge created successfully with ID:', challenge.id);
    console.log('📋 API: Full challenge object:', challenge);

    // Broadcast the new challenge via WebSocket using the broadcast endpoint
    try {
      console.log('🔔 Broadcasting new challenge to stream:', actualStreamId);
      console.log('🎯 Challenge details:', { id: challenge.id, title: challenge.title, event_type: challenge.event_type });
      
      const challengePayload = {
        // Challenge information
        id: challenge.id,
        title: challenge.title,
        event_type: challenge.event_type,
        stream_id: challenge.stream_id,
        state: challenge.state || 'open',
        created_at: challenge.created_at,
        updated_at: challenge.updated_at,
        started_at: challenge.started_at || new Date().toISOString(),
        closing_at: challenge.closing_at,
        
        // Complete options information
        options: options.map((opt: ChallengeOption) => ({
          id: opt.id,
          challenge_id: opt.challenge_id,
          option_key: opt.option_key,
          display_name: opt.display_name,
          token_name: opt.token_name,
          created_at: opt.created_at,
          odds: 1.0, // Default odds
          // Additional metadata
          metadata: {
            created_at: opt.created_at,
            updated_at: opt.updated_at
          }
        })),
        
        // Additional metadata
        metadata: {
          total_options: options.length,
          stream_id: actualStreamId,
          event_type: body.eventType,
          broadcast_timestamp: new Date().toISOString()
        },
        
        // Timestamp for the broadcast
        timestamp: new Date().toISOString()
      };

      // Use the broadcast endpoint for WebSocket communication
      const broadcastUrl = `${request.nextUrl.origin}/api/broadcast`;
      console.log('🌐 Sending challenge to broadcast endpoint:', broadcastUrl);
      console.log('📤 Broadcasting to stream ID:', actualStreamId);

      const broadcastResponse = await fetch(broadcastUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          streamId: actualStreamId,
          event: 'challenge:new',
          payload: challengePayload
        }),
      });

      if (broadcastResponse.ok) {
        const broadcastResult = await broadcastResponse.json();
        console.log('✅ Challenge broadcast successful:', broadcastResult);
        console.log('📊 Sent to', broadcastResult.sentCount || 0, 'connections');
      } else {
        const errorData = await broadcastResponse.json();
        console.log('⚠️ Challenge broadcast failed:', errorData.error);
        console.log('💾 Challenge was still created successfully');
      }
      
    } catch (broadcastError) {
      console.error("❌ Error broadcasting challenge:", broadcastError);
      // Don't fail the entire operation if broadcasting fails
    }

    return NextResponse.json(result.data, { headers: corsHeaders(origin) });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
} 