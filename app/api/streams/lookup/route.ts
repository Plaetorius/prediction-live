import { createClient } from '@/lib/supabase/server';
import { corsHeaders } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  const { searchParams } = new URL(request.url);
  const twitchStreamId = searchParams.get('twitchStreamId');
  
  if (!twitchStreamId) {
    return NextResponse.json({ error: 'Missing twitchStreamId' }, { 
      status: 400, 
      headers: corsHeaders(origin) 
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('streams')
    .select('id')
    .eq('twitch_stream_id', twitchStreamId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Stream not found' }, { 
      status: 404, 
      headers: corsHeaders(origin) 
    });
  }

  return NextResponse.json({ id: data.id }, { 
    headers: corsHeaders(origin) 
  });
} 