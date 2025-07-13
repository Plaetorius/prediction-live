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
  const { challengeId } = await params;
  
  try {
    const body = await request.json();
    const { winnerOptionId } = body;

    if (!winnerOptionId) {
      return NextResponse.json(
        { error: 'Winner option ID is required' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const supabase = await createClient();

    // Get the challenge with its options to validate the winner selection
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select(`
        *,
        challenge_options (*)
      `)
      .eq('id', challengeId)
      .single();

    if (challengeError || !challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    // Verify the winner option belongs to this challenge
    const winnerOption = challenge.challenge_options.find(
      (option: { id: string }) => option.id === winnerOptionId
    );

    if (!winnerOption) {
      return NextResponse.json(
        { error: 'Invalid winner option for this challenge' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    // Update the challenge with the winner and set state to resolved
    const { data: updatedChallenge, error: updateError } = await supabase
      .from('challenges')
      .update({
        winner_option_id: winnerOptionId,
        state: 'resolved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', challengeId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating challenge with winner:', updateError);
      return NextResponse.json(
        { error: 'Failed to update challenge' },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    console.log('🏆 Winner selected for challenge:', challengeId);
    console.log('🎯 Winner option:', winnerOption);

    // Broadcast the winner event via WebSocket
    try {
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

    return NextResponse.json({
      success: true,
      challenge: updatedChallenge,
      winner: winnerOption,
      message: `Winner selected: ${winnerOption.display_name}`
    }, { headers: corsHeaders(origin) });

  } catch (error) {
    console.error('Error selecting winner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
} 