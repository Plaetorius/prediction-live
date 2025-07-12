"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface Stream {
	id: string;
	twitch_stream_id: string;
	game_id: string;
}

interface StreamSelectorProps {
	value: string;
	onValueChange: (value: string) => void;
	placeholder?: string;
}

export default function StreamSelector({ value, onValueChange, placeholder = "Select a stream" }: StreamSelectorProps) {
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
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger>
					<SelectValue placeholder="Loading streams..." />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="loading" disabled>Loading...</SelectItem>
				</SelectContent>
			</Select>
		);
	}

	if (error) {
		return (
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger>
					<SelectValue placeholder="Error loading streams" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="error" disabled>Error: {error}</SelectItem>
				</SelectContent>
			</Select>
		);
	}

	if (streams.length === 0) {
		return (
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger>
					<SelectValue placeholder="No streams available" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="no-streams" disabled>No streams found</SelectItem>
				</SelectContent>
			</Select>
		);
	}

	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className="backdrop-blur-xl bg-[#f5f5f5]/10 border-[#f5f5f5]/20 text-[#f5f5f5] placeholder-[#f5f5f5]/50 focus:border-[#FF0052] focus:ring-[#FF0052]/20">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent className="backdrop-blur-xl bg-[#0B0518]/95 border border-[#f5f5f5]/20">
				<SelectItem value="select" className="text-[#f5f5f5] focus:bg-[#FF0052]/20 focus:text-[#FF0052]">Select a stream</SelectItem>
				{streams.map((stream) => (
					<SelectItem key={stream.id} value={stream.id} className="text-[#f5f5f5] focus:bg-[#FF0052]/20 focus:text-[#FF0052]">
						{stream.twitch_stream_id} ({stream.game_id})
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
} 