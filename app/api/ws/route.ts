import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const streamId = searchParams.get('streamId');
	
	if (!streamId) {
		return new Response('Stream ID is required', { status: 400 });
	}

	try {
		const supabase = await createClient();
		
		// Create a channel for the specific stream
		const channel = supabase.channel(`stream-${streamId}`);
		
		// Set up the SSE connection
		const encoder = new TextEncoder();
		let isConnected = false;
		
		const stream = new ReadableStream({
			start(controller) {
				// Send initial connection message
				const connectMessage = JSON.stringify({
					type: 'connected',
					streamId: streamId,
					timestamp: new Date().toISOString()
				});
				controller.enqueue(encoder.encode(`data: ${connectMessage}\n\n`));
				
				// Subscribe to the channel
				channel
					.on('broadcast', { event: 'challenge:new' }, (payload) => {
						try {
							console.log('🔔 Broadcasting challenge to SSE client:', payload);
							
							const message = JSON.stringify({
								type: 'challenge:new',
								data: payload,
								timestamp: new Date().toISOString()
							});
							
							controller.enqueue(encoder.encode(`data: ${message}\n\n`));
						} catch (error) {
							console.error('❌ Error sending SSE message:', error);
						}
					})
					.subscribe((status) => {
						console.log('📡 SSE subscription status:', status);
						isConnected = status === 'SUBSCRIBED';
						
						if (isConnected) {
							const statusMessage = JSON.stringify({
								type: 'status',
								status: 'subscribed',
								streamId: streamId,
								timestamp: new Date().toISOString()
							});
							controller.enqueue(encoder.encode(`data: ${statusMessage}\n\n`));
						}
					});
			},
			cancel() {
				console.log('🔌 SSE connection cancelled, cleaning up...');
				try {
					channel.unsubscribe();
				} catch (error) {
					console.error('❌ Error cleaning up SSE connection:', error);
				}
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache, no-transform',
				'Connection': 'keep-alive',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type',
				'X-Accel-Buffering': 'no', // Disable nginx buffering
			},
		});
	} catch (error) {
		console.error('❌ SSE error:', error);
		return new Response('Internal server error', { status: 500 });
	}
} 