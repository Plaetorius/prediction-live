import { NextRequest, NextResponse } from 'next/server';

// Import the activeConnections from the broadcast endpoint
// Since we can't directly import it, we'll create a simple endpoint to check connections

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const streamId = searchParams.get('streamId');

		// This is a simple debug endpoint
		// In a real implementation, you'd want to share the activeConnections state
		return NextResponse.json({
			message: 'Debug endpoint - check server logs for connection info',
			streamId: streamId,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('❌ Debug endpoint error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
} 