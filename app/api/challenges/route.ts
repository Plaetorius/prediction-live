import { createChallenge, getChallenges } from '@/lib/challenges/actions';
import { corsHeaders } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  
  try {
    const result = await getChallenges();

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    return NextResponse.json(result.data, { headers: corsHeaders(origin) });
  } catch (error) {
    console.error('Error fetching challenges:', error);
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
    const result = await createChallenge(body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: corsHeaders(origin) }
      );
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