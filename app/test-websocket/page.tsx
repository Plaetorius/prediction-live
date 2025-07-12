"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestWebSocketPage() {
	const [messages, setMessages] = useState<string[]>([]);
	const [streamId, setStreamId] = useState('otplol_');
	const [isConnected, setIsConnected] = useState(false);
	const [eventSource, setEventSource] = useState<EventSource | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const addMessage = (message: string) => {
		setMessages(prev => [...prev.slice(-50), `${new Date().toLocaleTimeString()}: ${message}`]);
	};

	const connectToStream = () => {
		if (eventSource) {
			eventSource.close();
		}

		setIsLoading(true);
		addMessage('Connecting to SSE...');

		try {
			const es = new EventSource(`/api/broadcast?streamId=${streamId}`);
			
			es.onopen = () => {
				console.log('🔌 SSE connection opened');
				setIsConnected(true);
				setIsLoading(false);
				addMessage('✅ Connected to SSE');
			};

			es.onmessage = (event) => {
				try {
					console.log('📨 Received SSE message:', event.data);
					const data = JSON.parse(event.data);
					addMessage(`📨 Received: ${JSON.stringify(data, null, 2)}`);
				} catch (error) {
					console.error('❌ Error parsing SSE message:', error);
					addMessage(`❌ Error parsing message: ${error}`);
				}
			};

			es.onerror = (error) => {
				console.error('❌ SSE error:', error);
				setIsConnected(false);
				setIsLoading(false);
				addMessage('❌ SSE connection error');
			};

			setEventSource(es);
		} catch (error) {
			console.error('❌ Error creating EventSource:', error);
			setIsLoading(false);
			addMessage(`❌ Error creating connection: ${error}`);
		}
	};

	const disconnect = () => {
		if (eventSource) {
			eventSource.close();
			setEventSource(null);
			setIsConnected(false);
			addMessage('🔌 Disconnected from SSE');
		}
	};

	const testBroadcast = async () => {
		if (!isConnected) {
			addMessage('❌ Not connected to stream');
			return;
		}

		setIsLoading(true);
		addMessage('🔄 Creating test challenge...');

		try {
			// First, create the challenge
			const response = await fetch('/api/challenges', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: `Test Challenge ${Date.now()}`,
					streamId: streamId,
					eventType: 'test',
					options: [
						{ optionKey: 'option_a', displayName: 'Option A', tokenName: 'OPTION_A' },
						{ optionKey: 'option_b', displayName: 'Option B', tokenName: 'OPTION_B' }
					]
				}),
			});

			if (response.ok) {
				const result = await response.json();
				addMessage('✅ Test challenge created successfully');
				addMessage(`📊 Challenge ID: ${result.challenge?.id || 'unknown'}`);
				
				// Manually trigger a broadcast to test the SSE connection
				await testManualBroadcast(result.challenge, result.options);
			} else {
				const error = await response.json();
				addMessage(`❌ Failed to create challenge: ${error.error}`);
			}
		} catch (error) {
			addMessage(`❌ Error creating test challenge: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const testManualBroadcast = async (challenge: { id: string; title: string; event_type: string; stream_id: string }, options: Array<{ id: string; option_key: string; display_name: string; token_name: string }>) => {
		try {
			addMessage('📡 Testing manual broadcast...');
			
			const broadcastResponse = await fetch('/api/broadcast', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					streamId: streamId,
					event: 'challenge:new',
					payload: {
						id: challenge.id,
						title: challenge.title,
						event_type: challenge.event_type,
						stream_id: challenge.stream_id,
						options: options.map(opt => ({
							id: opt.id,
							option_key: opt.option_key,
							display_name: opt.display_name,
							token_name: opt.token_name,
							odds: 1.0
						})),
						timestamp: new Date().toISOString()
					}
				}),
			});

			if (broadcastResponse.ok) {
				const result = await broadcastResponse.json();
				addMessage(`✅ Manual broadcast sent: ${result.message}`);
			} else {
				addMessage('⚠️ Manual broadcast failed, but challenge was created');
			}
		} catch (error) {
			addMessage(`❌ Error with manual broadcast: ${error}`);
		}
	};

	const testSimpleBroadcast = async () => {
		if (!isConnected) {
			addMessage('❌ Not connected to stream');
			return;
		}

		setIsLoading(true);
		addMessage('📡 Testing simple broadcast...');

		try {
			// Try the new simple test endpoint first
			const response = await fetch('/api/test-simple-broadcast', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					streamId: streamId
				}),
			});

			if (response.ok) {
				const result = await response.json();
				addMessage(`✅ Simple test broadcast sent: ${result.message}`);
				addMessage(`📊 Result: ${JSON.stringify(result.result)}`);
			} else {
				const error = await response.json();
				addMessage(`❌ Failed to send simple test broadcast: ${error.error}`);
			}
		} catch (error) {
			addMessage(`❌ Error with simple test broadcast: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const testChallengeDetails = () => {
		addMessage('🧪 Testing challenge details display...');
		addMessage('📋 This will simulate receiving a challenge event in the extension');
		
		// Simulate receiving a challenge event
		const mockChallenge = {
			id: 'test-challenge-123',
			streamId: streamId,
			eventType: 'test-match',
			title: 'Test Challenge with Full Details',
			state: 'open' as const,
			startedAt: new Date().toISOString(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			options: [
				{
					id: 'option-1',
					challenge_id: 'test-challenge-123',
					optionKey: 'team_a',
					displayName: 'Team Alpha',
					tokenName: 'TEAM_ALPHA',
					odds: 1.5,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
					metadata: {
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					}
				},
				{
					id: 'option-2',
					challenge_id: 'test-challenge-123',
					optionKey: 'team_b',
					displayName: 'Team Beta',
					tokenName: 'TEAM_BETA',
					odds: 2.0,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
					metadata: {
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					}
				}
			],
			metadata: {
				total_options: 2,
				stream_id: streamId,
				event_type: 'test-match',
				broadcast_timestamp: new Date().toISOString()
			}
		};
		
		// Dispatch the mock event
		const event = new CustomEvent('challenge-update', {
			detail: {
				type: 'challenge:new',
				challenge: mockChallenge
			}
		});
		document.dispatchEvent(event);
		
		addMessage('✅ Mock challenge event dispatched - check console for details');
	};

	const clearMessages = () => {
		setMessages([]);
	};

	useEffect(() => {
		// Listen for challenge-update events (simulating extension behavior)
		const handleChallengeUpdate = (event: CustomEvent) => {
			console.log('🎯 Extension received challenge-update event:', event.detail);
			
			// Log full challenge details to console
			console.log('🎯 ===== FULL CHALLENGE DETAILS =====');
			console.log('Challenge Object:', event.detail.challenge);
			console.log('Challenge ID:', event.detail.challenge.id);
			console.log('Challenge Title:', event.detail.challenge.title);
			console.log('Challenge State:', event.detail.challenge.state);
			console.log('Challenge Stream ID:', event.detail.challenge.streamId);
			console.log('Challenge Event Type:', event.detail.challenge.eventType);
			console.log('Challenge Started At:', event.detail.challenge.startedAt);
			console.log('Challenge Created At:', event.detail.challenge.createdAt);
			console.log('Challenge Updated At:', event.detail.challenge.updatedAt);
			
			console.log('🎲 ===== ALL OPTIONS =====');
			event.detail.challenge.options.forEach((option: { displayName: string; tokenName: string; optionKey: string; odds: number; id: string; challenge_id: string; created_at?: string; updated_at?: string; metadata?: { created_at?: string; updated_at?: string } }, index: number) => {
				console.log(`Option ${index + 1}:`, option);
			});
			
			if (event.detail.challenge.metadata) {
				console.log('📊 ===== METADATA =====');
				console.log('Metadata:', event.detail.challenge.metadata);
			}
			
			console.log('🎯 ===== END FULL CHALLENGE DETAILS =====');
			
			addMessage(`🎯 Extension Event: ${event.detail.type}`);
			addMessage(`📋 Challenge: ${event.detail.challenge.title}`);
			addMessage(`🎲 Options: ${event.detail.challenge.options.length} options`);
			addMessage(`📊 State: ${event.detail.challenge.state}`);
			addMessage(`🕒 Started: ${new Date(event.detail.challenge.startedAt).toLocaleTimeString()}`);
			addMessage(`📅 Created: ${new Date(event.detail.challenge.createdAt || '').toLocaleTimeString()}`);
			addMessage(`🔄 Updated: ${new Date(event.detail.challenge.updatedAt || '').toLocaleTimeString()}`);
			
			if (event.detail.challenge.metadata) {
				addMessage(`📈 Total Options: ${event.detail.challenge.metadata.total_options}`);
				addMessage(`📡 Stream: ${event.detail.challenge.metadata.stream_id}`);
				addMessage(`🎯 Event Type: ${event.detail.challenge.metadata.event_type}`);
				addMessage(`📡 Broadcast: ${new Date(event.detail.challenge.metadata.broadcast_timestamp).toLocaleTimeString()}`);
			}
			
			// Show all options with details
			addMessage(`🎲 ===== OPTIONS =====`);
			event.detail.challenge.options.forEach((option: { displayName: string; tokenName: string; optionKey: string; odds: number; id: string }, index: number) => {
				addMessage(`  ${index + 1}. ${option.displayName} (${option.tokenName})`);
				addMessage(`     Key: ${option.optionKey} | Odds: ${option.odds} | ID: ${option.id}`);
			});
			
			// Show full challenge object for debugging
			addMessage(`🔍 Full Challenge Object:`);
			addMessage(JSON.stringify(event.detail.challenge, null, 2));
		};

		document.addEventListener('challenge-update', handleChallengeUpdate as EventListener);

		return () => {
			document.removeEventListener('challenge-update', handleChallengeUpdate as EventListener);
			if (eventSource) {
				eventSource.close();
			}
		};
	}, [eventSource]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0B0518] via-[#1a0f2e] to-[#0B0518] p-8">
			<div className="max-w-4xl mx-auto space-y-6">
				<Card className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/20">
					<CardHeader>
						<CardTitle className="text-[#f5f5f5]">SSE Test</CardTitle>
						<p className="text-[#f5f5f5]/70 text-sm">
							This page tests the Server-Sent Events (SSE) connection and broadcasting functionality.
							The extension should be connected to the same stream ID to receive broadcasts.
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-4 items-end">
							<div className="flex-1">
								<Label htmlFor="streamId" className="text-[#f5f5f5]">Stream ID from Supabase</Label>
								<Input
									id="streamId"
									value={streamId}
									onChange={(e) => setStreamId(e.target.value)}
									className="bg-[#f5f5f5]/10 border-[#f5f5f5]/20 text-[#f5f5f5]"
									disabled={isConnected}
								/>
							</div>
							<Button
								onClick={isConnected ? disconnect : connectToStream}
								disabled={isLoading}
								className={`${
									isConnected 
										? 'bg-red-500 hover:bg-red-600' 
										: 'bg-green-500 hover:bg-green-600'
								} text-white disabled:opacity-50`}
							>
								{isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
							</Button>
							<Button
								onClick={testBroadcast}
								disabled={!isConnected || isLoading}
								className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
							>
								{isLoading ? 'Creating...' : 'Test Broadcast'}
							</Button>
							<Button
								onClick={testSimpleBroadcast}
								disabled={!isConnected || isLoading}
								className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
							>
								Simple Test
							</Button>
							<Button
								onClick={async () => {
									if (!isConnected) {
										addMessage('❌ Not connected to stream');
										return;
									}
									
									setIsLoading(true);
									addMessage('📡 Testing original broadcast endpoint...');
									
									try {
										const response = await fetch('/api/test-broadcast', {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify({
												streamId: streamId,
												message: `Original test message ${Date.now()}`
											}),
										});

										if (response.ok) {
											const result = await response.json();
											addMessage(`✅ Original broadcast sent: ${result.result.message}`);
											addMessage(`📊 Sent to: ${result.result.sentCount} connections`);
										} else {
											const error = await response.json();
											addMessage(`❌ Failed to send original broadcast: ${error.error}`);
										}
									} catch (error) {
										addMessage(`❌ Error with original broadcast: ${error}`);
									} finally {
										setIsLoading(false);
									}
								}}
								disabled={!isConnected || isLoading}
								className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
							>
								Original Test
							</Button>
							<Button
								onClick={testChallengeDetails}
								disabled={!isConnected || isLoading}
								className="bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50"
							>
								Test Challenge Details
							</Button>
							<Button
								onClick={() => {
									addMessage('🔍 Checking active connections...');
									fetch(`/api/debug-connections?streamId=${streamId}`)
										.then(res => res.json())
										.then(data => {
											addMessage(`🔍 Debug info: ${JSON.stringify(data)}`);
										})
										.catch(err => {
											addMessage(`❌ Debug error: ${err}`);
										});
								}}
								variant="outline"
								className="text-[#f5f5f5] border-[#f5f5f5]/20 hover:bg-[#f5f5f5]/10"
							>
								Debug
							</Button>
							<Button
								onClick={clearMessages}
								variant="outline"
								className="text-[#f5f5f5] border-[#f5f5f5]/20 hover:bg-[#f5f5f5]/10"
							>
								Clear
							</Button>
						</div>
						
						<div className="flex items-center gap-2">
							<div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
							<span className="text-[#f5f5f5]">
								{isConnected ? 'Connected' : 'Disconnected'}
							</span>
							{isLoading && (
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
									<span className="text-[#f5f5f5]/70">Loading...</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<Card className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/20">
					<CardHeader>
						<CardTitle className="text-[#f5f5f5]">Messages ({messages.length})</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-96 overflow-y-auto bg-black/20 rounded-lg p-4 font-mono text-sm">
							{messages.length === 0 ? (
								<div className="text-[#f5f5f5]/50">No messages yet...</div>
							) : (
								messages.map((message, index) => (
									<div key={index} className="text-[#f5f5f5] mb-2 break-words">
										{message}
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 