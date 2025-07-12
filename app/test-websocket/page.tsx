'use client';

import { useEffect, useState } from 'react';

export default function TestWebSocket() {
	const [events, setEvents] = useState<Record<string, unknown>[]>([]);
	const [streamId, setStreamId] = useState('test-stream');
	const [isConnected, setIsConnected] = useState(false);
	const [eventSource, setEventSource] = useState<EventSource | null>(null);

	const connectToStream = (newStreamId: string) => {
		if (eventSource) {
			eventSource.close();
		}

		const newEventSource = new EventSource(`/api/streams/${newStreamId}/events`);

		newEventSource.onopen = () => {
			console.log('SSE connection opened');
			setIsConnected(true);
		};

		newEventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('Received SSE event:', data);
			setEvents(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 events
		};

		newEventSource.onerror = (error) => {
			console.error('SSE error:', error);
			setIsConnected(false);
		};

		setEventSource(newEventSource);
	};

	useEffect(() => {
		connectToStream(streamId);
		
		return () => {
			if (eventSource) {
				eventSource.close();
			}
		};
	}, [streamId]);

	const testChallengeCreation = async () => {
		try {
			const response = await fetch('/api/challenges', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					streamId: streamId,
					eventType: 'test-event',
					title: 'Test Challenge',
					options: [
						{
							optionKey: 'yes',
							displayName: 'Yes',
							tokenName: 'YES_TOKEN'
						},
						{
							optionKey: 'no',
							displayName: 'No',
							tokenName: 'NO_TOKEN'
						}
					]
				})
			});

			const result = await response.json();
			console.log('Challenge created:', result);
		} catch (error) {
			console.error('Error creating challenge:', error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white p-6">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">WebSocket Test</h1>
				
				<div className="mb-6">
					<div className="flex items-center gap-4 mb-4">
						<input
							type="text"
							value={streamId}
							onChange={(e) => setStreamId(e.target.value)}
							className="px-3 py-2 bg-gray-800 border border-gray-600 rounded"
							placeholder="Stream ID"
						/>
						<div className={`px-3 py-1 rounded ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
							{isConnected ? 'Connected' : 'Disconnected'}
						</div>
						<button
							onClick={() => connectToStream(streamId)}
							className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded"
						>
							Reconnect
						</button>
					</div>
					
					<button
						onClick={testChallengeCreation}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
					>
						Create Test Challenge
					</button>
				</div>

				<div className="bg-gray-800 rounded-lg p-4">
					<h2 className="text-xl font-semibold mb-4">Real-time Events</h2>
					<div className="space-y-2 max-h-96 overflow-y-auto">
						{events.length === 0 ? (
							<p className="text-gray-400">No events yet. Create a challenge to see events.</p>
						) : (
							events.map((event, index) => (
								<div key={index} className="p-3 bg-gray-700 rounded">
									<pre className="text-sm">{JSON.stringify(event, null, 2)}</pre>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
} 