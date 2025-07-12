"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestWebSocketPage() {
	const [messages, setMessages] = useState<string[]>([]);
	const [streamId, setStreamId] = useState('test-stream');
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

	const clearMessages = () => {
		setMessages([]);
	};

	useEffect(() => {
		return () => {
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
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-4 items-end">
							<div className="flex-1">
								<Label htmlFor="streamId" className="text-[#f5f5f5]">Stream ID</Label>
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