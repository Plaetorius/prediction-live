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
    const { challengeId, userId, optionId, amount, tokenName } = body;

    // Validate required fields
    if (!challengeId || !userId || !optionId || !amount || !tokenName) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: challengeId, userId, optionId, amount, tokenName' 
        },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    console.log('🎯 Received prediction request:', {
      challengeId,
      userId,
      optionId,
      amount,
      tokenName
    });

    // TODO: Implement actual prediction logic
    // For now, return a mock success response
    const mockResponse = {
      success: true,
      message: 'Prediction placed successfully',
      prediction: {
        id: 'pred_' + Date.now(),
        challengeId,
        userId,
        optionId,
        amount,
        tokenName,
        placedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(mockResponse, { 
      headers: corsHeaders(origin) 
    });

  } catch (error) {
    console.error('❌ Error processing prediction:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
} 