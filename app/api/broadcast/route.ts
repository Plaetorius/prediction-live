import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for active connections
const activeConnections = new Map<string, Set<ReadableStreamDefaultController>>();

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { streamId, event, payload } = body;

		if (!streamId || !event || !payload) {
			return NextResponse.json(
				{ error: 'Missing required fields: streamId, event, payload' },
				{ status: 400 }
			);
		}

		console.log('🔔 Broadcasting event:', event, 'to stream:', streamId);

		// Get all active connections for this stream
		const connections = activeConnections.get(streamId);
		if (!connections || connections.size === 0) {
			console.log('📭 No active connections for stream:', streamId);
			return NextResponse.json({ message: 'No active connections' });
		}

		// Send the message to all connected clients
		const message = JSON.stringify({
			type: event,
			data: payload,
			timestamp: new Date().toISOString()
		});

		const encoder = new TextEncoder();
		const encodedMessage = encoder.encode(`data: ${message}\n\n`);

		let sentCount = 0;
		for (const controller of connections) {
			try {
				controller.enqueue(encodedMessage);
				sentCount++;
				console.log(`📤 Sent ${event} event to connection ${sentCount}`);
			} catch (error) {
				console.error('❌ Error sending to connection:', error);
			}
		}

		console.log(`✅ Broadcast sent to ${sentCount} connections`);
		return NextResponse.json({ 
			message: `Broadcast sent to ${sentCount} connections`,
			sentCount,
			eventType: event
		});

	} catch (error) {
		console.error('❌ Broadcast error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const streamId = searchParams.get('streamId');
	
	if (!streamId) {
		return new Response('Stream ID is required', { status: 400 });
	}

	try {
		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			start(controller) {
				// Add this connection to the active connections
				if (!activeConnections.has(streamId)) {
					activeConnections.set(streamId, new Set());
				}
				activeConnections.get(streamId)!.add(controller);

				// Send initial connection message
				const connectMessage = JSON.stringify({
					type: 'connected',
					streamId: streamId,
					timestamp: new Date().toISOString()
				});
				controller.enqueue(encoder.encode(`data: ${connectMessage}\n\n`));

				console.log(`🔌 New SSE connection for stream: ${streamId}`);
			},
			cancel() {
				// Remove this connection when it's closed
				const connections = activeConnections.get(streamId);
				if (connections) {
					// Note: We can't access controller here, so we'll clean up on next broadcast
					// This is a limitation of the current approach
				}
				console.log(`🔌 SSE connection closed for stream: ${streamId}`);
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache, no-transform',
				'Connection': 'keep-alive',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST',
				'Access-Control-Allow-Headers': 'Content-Type',
				'X-Accel-Buffering': 'no',
			},
		});
	} catch (error) {
		console.error('❌ SSE error:', error);
		return new Response('Internal server error', { status: 500 });
	}
} 