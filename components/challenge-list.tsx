"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Users, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChallengeOption {
	id: string;
	option_key: string;
	display_name: string;
	token_name: string;
}

interface Challenge {
	id: string;
	title: string;
	event_type: string;
	state: string;
	started_at: string;
	created_at: string;
	challenge_options: ChallengeOption[];
}

export default function ChallengeList() {
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchChallenges = async () => {
			try {
				const response = await fetch('/api/challenges');
				if (!response.ok) {
					throw new Error('Failed to fetch challenges');
				}
				const data = await response.json();
				console.log('Challenges data:', data); // Debug log
				setChallenges(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setLoading(false);
			}
		};

		fetchChallenges();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-muted-foreground">Loading challenges...</div>
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

	if (challenges.length === 0) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-muted-foreground">No challenges found</div>
			</div>
		);
	}

	const getStateColor = (state: string) => {
		switch (state) {
			case 'open':
				return 'bg-green-100 text-green-800';
			case 'closed':
				return 'bg-yellow-100 text-yellow-800';
			case 'resolved':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{challenges.map((challenge) => (
				<Card key={challenge.id} className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-2xl hover:shadow-lg hover:shadow-[#FF0052]/10 transition-all duration-300 transform hover:scale-105">
					<CardHeader className="pb-4">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<CardTitle className="text-lg text-[#f5f5f5]">{challenge.title}</CardTitle>
								<CardDescription className="mt-1 text-[#f5f5f5]/70">
									{challenge.event_type}
								</CardDescription>
							</div>
							<Badge className={`${getStateColor(challenge.state)} border border-[#f5f5f5]/20`}>
								{challenge.state}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm text-[#f5f5f5]/70">
								<Trophy className="h-4 w-4 text-[#FF0052]" />
								<span>{challenge.challenge_options.length} options</span>
							</div>
							
							<div className="space-y-2">
								{challenge.challenge_options.slice(0, 3).map((option) => (
									<div key={option.id} className="flex items-center justify-between text-sm">
										<span className="font-medium text-[#f5f5f5]">{option.display_name}</span>
										<span className="text-[#FF0052] font-semibold">
											{option.token_name || 'N/A'}
										</span>
									</div>
								))}
								{challenge.challenge_options.length > 3 && (
									<div className="text-xs text-[#f5f5f5]/50">
										+{challenge.challenge_options.length - 3} more options
									</div>
								)}
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
									<Users className="h-4 w-4 mr-1" />
									Predict
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
} 