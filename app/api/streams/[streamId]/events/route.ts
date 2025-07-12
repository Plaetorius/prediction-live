import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ streamId: string }> }
) {
	const { streamId } = await params;

	// Create a Server-Sent Events stream for real-time updates
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			const supabase = await createClient();
			
			// Subscribe to the stream channel
			const channel = supabase
				.channel(`stream-${streamId}`)
				.on('broadcast', { event: 'challenge:new' }, (payload) => {
					// Send the event as SSE
					const data = JSON.stringify({
						type: 'challenge:new',
						payload
					});
					
					controller.enqueue(encoder.encode(`data: ${data}\n\n`));
				})
				.subscribe();

			// Send initial connection message
			controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
				type: 'connected', 
				streamId,
				timestamp: new Date().toISOString()
			})}\n\n`));

			// Keep the connection alive
			const keepAlive = setInterval(() => {
				controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
					type: 'ping',
					timestamp: new Date().toISOString()
				})}\n\n`));
			}, 30000); // Send ping every 30 seconds

			// Cleanup on close
			return () => {
				clearInterval(keepAlive);
				channel.unsubscribe();
			};
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
} 