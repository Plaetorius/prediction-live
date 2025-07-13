import { createClient } from '@/lib/supabase/server';
import { corsHeaders } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

interface Prediction {
  id: string;
  amount: number;
  status: string;
  placed_at: string;
  wallet_address: string;
  resolved_at: string | null;
  payout_amount: number | null;
}

interface ChallengeOption {
  id: string;
  challenge_id: string;
  option_key: string;
  display_name: string;
  token_name: string;
  created_at: string;
  predictions: Prediction[];
}

interface Challenge {
  id: string;
  stream_id: string;
  event_type: string;
  title: string;
  state: string;
  started_at: string;
  closed_at: string | null;
  resolved_at: string | null;
  created_at: string;
  challenge_options: ChallengeOption[];
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ streamId: string }> }
) {
  const origin = request.headers.get("origin") || undefined;
  
  try {
    const { streamId } = await params;
    console.log('🔍 Fetching challenges for stream:', streamId);
    
    const supabase = await createClient();
    
    // Fetch challenges for the specific stream with their options and predictions
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select(`
        *,
        challenge_options (
          *,
          predictions (
            id,
            amount,
            status,
            placed_at,
            wallet_address,
            resolved_at,
            payout_amount
          )
        )
      `)
      .eq('stream_id', streamId)
      .order('created_at', { ascending: false });

    if (challengesError) {
      console.error('❌ Error fetching challenges:', challengesError);
      return NextResponse.json(
        { error: 'Failed to fetch challenges', details: challengesError.message },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    console.log('📊 Found challenges:', challenges?.length || 0);
    
    // Process the data to include useful statistics
    const processedChallenges = (challenges as Challenge[])?.map(challenge => {
      const totalPredictions = challenge.challenge_options?.reduce((sum: number, option: ChallengeOption) => 
        sum + (option.predictions?.length || 0), 0
      ) || 0;
      
      const totalAmount = challenge.challenge_options?.reduce((sum: number, option: ChallengeOption) => 
        sum + (option.predictions?.reduce((optSum: number, pred: Prediction) => 
          optSum + parseFloat(pred.amount.toString()), 0
        ) || 0), 0
      ) || 0;

      return {
        ...challenge,
        challenge_options: challenge.challenge_options?.map((option: ChallengeOption) => ({
          ...option,
          predictions: option.predictions || [],
          prediction_count: option.predictions?.length || 0,
          total_amount: option.predictions?.reduce((sum: number, pred: Prediction) => 
            sum + parseFloat(pred.amount.toString()), 0
          ) || 0
        })) || [],
        total_predictions: totalPredictions,
        total_amount: totalAmount
      };
    }) || [];

    console.log('✅ Processed challenges with predictions');
    
    return NextResponse.json(processedChallenges, { 
      headers: corsHeaders(origin) 
    });
    
  } catch (error) {
    console.error('❌ Error in challenges API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
} 