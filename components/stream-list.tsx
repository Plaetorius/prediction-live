"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Play, Clock, Gamepad2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Stream {
	id: string;
	twitch_stream_id: string;
	game_id: string;
	started_at: string;
	ended_at: string | null;
	created_at: string;
}

export default function StreamList() {
	const [streams, setStreams] = useState<Stream[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStreams = async () => {
			try {
				const response = await fetch('/api/streams');
				if (!response.ok) {
					throw new Error('Failed to fetch streams');
				}
				const data = await response.json();
				setStreams(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setLoading(false);
			}
		};

		fetchStreams();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-muted-foreground">Loading streams...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-red-500">Error: {error}</div>
			</div>
		);
	}

	if (streams.length === 0) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-muted-foreground">No streams found</div>
			</div>
		);
	}

	const getStatusColor = (endedAt: string | null) => {
		return endedAt ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800';
	};

	const getStatusText = (endedAt: string | null) => {
		return endedAt ? 'Ended' : 'Live';
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{streams.map((stream) => (
				<Card key={stream.id} className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-2xl hover:shadow-lg hover:shadow-[#FF0052]/10 transition-all duration-300 transform hover:scale-105">
					<CardHeader className="pb-4">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<CardTitle className="text-lg text-[#f5f5f5]">{stream.twitch_stream_id}</CardTitle>
								<CardDescription className="mt-1 text-[#f5f5f5]/70">
									{stream.game_id}
								</CardDescription>
							</div>
							<Badge className={`${getStatusColor(stream.ended_at)} border border-[#f5f5f5]/20`}>
								{getStatusText(stream.ended_at)}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm text-[#f5f5f5]/70">
								<Clock className="h-4 w-4 text-[#FF0052]" />
								<span>Started: {formatDate(stream.started_at)}</span>
							</div>
							
							{stream.ended_at && (
								<div className="flex items-center gap-2 text-sm text-[#f5f5f5]/70">
									<Clock className="h-4 w-4 text-[#FF0052]" />
									<span>Ended: {formatDate(stream.ended_at)}</span>
								</div>
							)}

							<div className="flex items-center gap-2 text-sm text-[#f5f5f5]/70">
								<Gamepad2 className="h-4 w-4 text-[#FF0052]" />
								<span>Game: {stream.game_id}</span>
							</div>

							<div className="flex gap-2 pt-3">
								<Button
									variant="outline"
									size="sm"
									className="flex-1 border-[#FF0052] text-[#FF0052] bg-transparent hover:bg-[#FF0052] hover:text-white hover:border-[#FF0052] transition-all duration-200"
								>
									<Eye className="h-4 w-4 mr-1" />
									View
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="flex-1 border-[#FF0052] text-[#FF0052] bg-transparent hover:bg-[#FF0052] hover:text-white hover:border-[#FF0052] transition-all duration-200"
								>
									<Play className="h-4 w-4 mr-1" />
									Watch
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
} 