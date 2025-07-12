import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { streamId, message } = body;

		if (!streamId) {
			return NextResponse.json(
				{ error: 'Stream ID is required' },
				{ status: 400 }
			);
		}

		console.log('🧪 Testing broadcast to stream:', streamId);

		// Send a test broadcast
		const broadcastResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/broadcast`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				streamId: streamId,
				event: 'test:message',
				payload: {
					message: message || `Test message at ${new Date().toISOString()}`,
					timestamp: new Date().toISOString()
				}
			})
		});

		const result = await broadcastResponse.json();
		console.log('🧪 Test broadcast result:', result);

		return NextResponse.json({
			success: true,
			result: result
		});

	} catch (error) {
		console.error('❌ Test broadcast error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
} 