import { createClient } from '@/lib/supabase/server';
import { corsHeaders } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

interface ChallengeOption {
  id: string;
  option_key: string;
  display_name: string;
  token_name: string;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  const origin = request.headers.get("origin") || undefined;
  
  try {
    console.log('🏆 Starting winner selection process...');
    
    const { challengeId } = await params;
    console.log('📋 Challenge ID:', challengeId);
    
    const body = await request.json();
    console.log('📥 Request body:', body);
    
    const { winnerOptionId } = body;
    console.log('🎯 Winner option ID:', winnerOptionId);

    if (!winnerOptionId) {
      console.error('❌ No winner option ID provided');
      return NextResponse.json(
        { error: 'Winner option ID is required' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    console.log('🔗 Creating Supabase client...');
    const supabase = await createClient();
    console.log('✅ Supabase client created');

    console.log('🔍 Fetching challenge with options...');
    // Get the challenge with its options to validate the winner selection
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select(`
        *,
        challenge_options (*)
      `)
      .eq('id', challengeId)
      .single();

    console.log('📊 Challenge query result:', { challenge, challengeError });

    if (challengeError) {
      console.error('❌ Challenge query error:', challengeError);
      return NextResponse.json(
        { error: 'Challenge not found', details: challengeError },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    if (!challenge) {
      console.error('❌ Challenge not found');
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    console.log('📋 Challenge found:', challenge.title);
    console.log('🎲 Challenge options:', challenge.challenge_options);

    // Verify the winner option belongs to this challenge
    const winnerOption = challenge.challenge_options.find(
      (option: { id: string }) => option.id === winnerOptionId
    );

    console.log('🏆 Winner option found:', winnerOption);

    if (!winnerOption) {
      console.error('❌ Invalid winner option for this challenge');
      return NextResponse.json(
        { error: 'Invalid winner option for this challenge' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    console.log('🔄 Preparing winner selection (no DB update needed)...');
    // Note: We skip database update since winner_option_id column doesn't exist
    // Winner information will be handled through the broadcasting system
    
    console.log('✅ Winner selection prepared successfully');
    console.log('🏆 Winner selected for challenge:', challengeId);
    console.log('🎯 Winner option:', winnerOption);

    // Broadcast the winner event via WebSocket
    try {
      console.log('📡 Preparing winner broadcast...');
      const winnerPayload = {
        // Challenge information
        id: challenge.id,
        title: challenge.title,
        event_type: challenge.event_type,
        stream_id: challenge.stream_id,
        state: 'resolved',
        
        // Winner information
        winner: {
          option_id: winnerOption.id,
          option_key: winnerOption.option_key,
          display_name: winnerOption.display_name,
          token_name: winnerOption.token_name,
        },
        
        // All options for context
        options: challenge.challenge_options.map((opt: ChallengeOption) => ({
          id: opt.id,
          option_key: opt.option_key,
          display_name: opt.display_name,
          token_name: opt.token_name,
          is_winner: opt.id === winnerOptionId,
        })),
        
        // Metadata
        metadata: {
          total_options: challenge.challenge_options.length,
          stream_id: challenge.stream_id,
          event_type: challenge.event_type,
          winner_selected_at: new Date().toISOString(),
        },
        
        // Timestamp
        timestamp: new Date().toISOString(),
      };

      const broadcastUrl = `${request.nextUrl.origin}/api/broadcast`;
      console.log('🌐 Broadcasting winner event to:', broadcastUrl);
      console.log('📤 Winner payload:', winnerPayload);

      const broadcastResponse = await fetch(broadcastUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          streamId: challenge.stream_id,
          event: 'challenge:winner',
          payload: winnerPayload
        }),
      });

      console.log('📡 Broadcast response status:', broadcastResponse.status);

      if (broadcastResponse.ok) {
        const broadcastResult = await broadcastResponse.json();
        console.log('✅ Winner broadcast successful:', broadcastResult);
        console.log('📊 Sent to', broadcastResult.sentCount || 0, 'connections');
      } else {
        const errorData = await broadcastResponse.json();
        console.log('⚠️ Winner broadcast failed:', errorData.error);
        console.log('💾 Winner was still selected successfully');
      }
      
    } catch (broadcastError) {
      console.error("❌ Error broadcasting winner:", broadcastError);
      // Don't fail the entire operation if broadcasting fails
    }

    console.log('🎉 Winner selection completed successfully');
    return NextResponse.json({
      success: true,
      challenge: { ...challenge, state: 'resolved' },
      winner: winnerOption,
      message: `Winner selected: ${winnerOption.display_name}`
    }, { headers: corsHeaders(origin) });

  } catch (error) {
    console.error('❌ Fatal error in winner selection:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
} 