import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const twitchStreamId = searchParams.get('twitchStreamId');
  if (!twitchStreamId) {
    return NextResponse.json({ error: 'Missing twitchStreamId' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('streams')
    .select('id')
    .eq('twitch_stream_id', twitchStreamId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Stream not found' }, { status: 404 });
  }

  return NextResponse.json({ id: data.id });
} 