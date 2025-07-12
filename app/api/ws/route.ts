import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const streamId = searchParams.get('streamId');

	if (!streamId) {
		return new Response('Missing streamId parameter', { status: 400 });
	}

	// For Chrome extensions, you'll want to connect to this endpoint
	// The actual WebSocket connection will be handled by your extension
	return new Response(JSON.stringify({
		message: 'WebSocket endpoint ready',
		streamId,
		endpoint: `/api/streams/${streamId}/events`
	}), {
		headers: {
			'Content-Type': 'application/json',
		},
	});
} 