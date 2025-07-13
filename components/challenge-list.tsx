"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trophy, Clock, Crown, Sparkles, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

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
	closing_at?: string;
	stream_id?: string;
	winner_option_id?: string;
	challenge_options: ChallengeOption[];
}

export default function ChallengeList() {
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
	const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
	const [isSelectingWinner, setIsSelectingWinner] = useState(false);
	const [celebratingChallengeId, setCelebratingChallengeId] = useState<string | null>(null);

	useEffect(() => {
		const fetchChallenges = async () => {
			try {
				setLoading(true);
				console.log('🔍 Frontend: Fetching challenges from /api/challenges...');
				
				const response = await fetch('/api/challenges');
				console.log('📡 Frontend: Response status:', response.status, response.statusText);
				console.log('📡 Frontend: Response headers:', Object.fromEntries(response.headers.entries()));
				
				if (!response.ok) {
					const errorText = await response.text();
					console.error('❌ Frontend: API error response:', errorText);
					throw new Error(`Failed to fetch challenges: ${response.status} ${response.statusText}`);
				}
				
				const data = await response.json();
				console.log('📊 Frontend: Fetched challenges data:', data);
				console.log('📊 Frontend: Data type:', typeof data);
				console.log('📊 Frontend: Is array:', Array.isArray(data));
				console.log('📊 Frontend: Data length:', Array.isArray(data) ? data.length : 'N/A');
				
				if (Array.isArray(data) && data.length > 0) {
					console.log('📊 Frontend: First challenge sample:', data[0]);
				}
				
				setChallenges(data || []);
			} catch (err) {
				console.error('❌ Frontend: Error fetching challenges:', err);
				setError(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		};

		fetchChallenges();
	}, []);

	const debugRefresh = async () => {
		console.log('🔄 Manual refresh triggered');
		setError(null);
		const fetchChallenges = async () => {
			try {
				setLoading(true);
				console.log('🔍 Debug: Fetching challenges from /api/challenges...');
				
				const response = await fetch('/api/challenges', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					cache: 'no-cache'
				});
				
				console.log('📡 Debug: Response status:', response.status, response.statusText);
				console.log('📡 Debug: Response headers:', Object.fromEntries(response.headers.entries()));
				
				if (!response.ok) {
					const errorText = await response.text();
					console.error('❌ Debug: API error response:', errorText);
					throw new Error(`Failed to fetch challenges: ${response.status} ${response.statusText}`);
				}
				
				const data = await response.json();
				console.log('📊 Debug: Raw response data:', data);
				console.log('📊 Debug: Data structure analysis:', {
					type: typeof data,
					isArray: Array.isArray(data),
					length: Array.isArray(data) ? data.length : 'N/A',
					keys: typeof data === 'object' ? Object.keys(data) : 'N/A'
				});
				
				setChallenges(data || []);
				toast.success(`Refreshed! Found ${Array.isArray(data) ? data.length : 0} challenges`);
			} catch (err) {
				console.error('❌ Debug: Error fetching challenges:', err);
				setError(err instanceof Error ? err.message : 'Unknown error');
				toast.error(`Debug refresh failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
			} finally {
				setLoading(false);
			}
		};

		await fetchChallenges();
	};

	const handlePickWinner = (challenge: Challenge) => {
		setSelectedChallenge(challenge);
		setIsWinnerModalOpen(true);
	};

	const selectWinner = async (optionId: string) => {
		if (!selectedChallenge) return;

		setIsSelectingWinner(true);
		
		try {
			const response = await fetch(`/api/challenges/${selectedChallenge.id}/winner`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					winnerOptionId: optionId,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				toast.error(`Failed to select winner: ${result.error}`, {
					description: "Please try again or check the console for more details",
					duration: 4000,
				});
			} else {
				const winnerOption = selectedChallenge.challenge_options.find(opt => opt.id === optionId);
				
				// Show success toast with celebration
				toast.success(`🎉 Winner Selected!`, {
					description: `${winnerOption?.display_name || 'Unknown'} is the winner! 🏆`,
					duration: 5000,
					action: {
						label: "View Details",
						onClick: () => console.log("Winner details:", winnerOption)
					}
				});
				
				// Trigger celebration animation
				setCelebratingChallengeId(selectedChallenge.id);
				setTimeout(() => setCelebratingChallengeId(null), 3000);
				
				// Update the challenge state locally with celebration
				setChallenges(prev => prev.map(challenge => 
					challenge.id === selectedChallenge.id 
						? { ...challenge, state: 'resolved', winner_option_id: optionId }
						: challenge
				));
				
				// Create confetti effect
				createConfettiEffect();
				
				// Play success sound
				playSuccessSound();
				
				setIsWinnerModalOpen(false);
				setSelectedChallenge(null);
				
				console.log('🏆 Winner selected successfully:', {
					challengeId: selectedChallenge.id,
					challengeTitle: selectedChallenge.title,
					winnerId: optionId,
					winnerName: winnerOption?.display_name,
					timestamp: new Date().toISOString()
				});
			}
		} catch (error) {
			toast.error("An unexpected error occurred", {
				description: "Please check your connection and try again",
				duration: 4000,
			});
			console.error('Winner selection error:', error);
		} finally {
			setIsSelectingWinner(false);
		}
	};

	const createConfettiEffect = () => {
		// Create multiple confetti elements
		for (let i = 0; i < 50; i++) {
			const confetti = document.createElement('div');
			confetti.className = 'confetti-piece';
			confetti.style.cssText = `
				position: fixed;
				width: 10px;
				height: 10px;
				background: ${['#FF0052', '#FFD700', '#00FF52', '#0052FF', '#FF5200'][Math.floor(Math.random() * 5)]};
				left: ${Math.random() * 100}vw;
				top: -10px;
				z-index: 10000;
				pointer-events: none;
				animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
				transform: rotate(${Math.random() * 360}deg);
			`;
			document.body.appendChild(confetti);
			
			setTimeout(() => confetti.remove(), 5000);
		}
	};

	const playSuccessSound = () => {
		// Create a success sound effect
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			
			// Success melody: C-E-G-C (major chord arpeggio)
			const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5-E5-G5-C6
			let time = audioContext.currentTime;
			
			frequencies.forEach((freq) => {
				const osc = audioContext.createOscillator();
				const gain = audioContext.createGain();
				
				osc.connect(gain);
				gain.connect(audioContext.destination);
				
				osc.frequency.setValueAtTime(freq, time);
				osc.type = 'sine';
				
				gain.gain.setValueAtTime(0, time);
				gain.gain.linearRampToValueAtTime(0.1, time + 0.01);
				gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
				
				osc.start(time);
				osc.stop(time + 0.2);
				
				time += 0.15;
			});
		} catch (error) {
			console.log('Could not play success sound:', error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="flex items-center gap-2 text-muted-foreground">
					<div className="w-4 h-4 border-2 border-[#FF0052] border-t-transparent rounded-full animate-spin"></div>
					Loading challenges...
				</div>
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
				return 'bg-green-500/20 text-green-400 border-green-500/50';
			case 'closed':
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
			case 'resolved':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
			default:
				return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
		}
	};

	return (
		<>
			{/* Debug Controls */}
			<div className="mb-6 p-4 bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-2xl">
				<div className="flex items-center justify-between gap-4">
					<div className="text-sm text-[#f5f5f5]/70">
						Debug: Found {challenges.length} challenges | Status: {loading ? 'Loading...' : error ? `Error: ${error}` : 'Ready'}
					</div>
					<Button
						onClick={debugRefresh}
						variant="outline"
						size="sm"
						disabled={loading}
						className="bg-transparent border-[#f5f5f5]/20 text-[#f5f5f5] hover:bg-[#FF0052] hover:border-[#FF0052] hover:text-white"
					>
						🔄 Debug Refresh
					</Button>
				</div>
			</div>
			
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{challenges.map((challenge) => {
					const winnerOption = challenge.winner_option_id 
						? challenge.challenge_options.find(opt => opt.id === challenge.winner_option_id)
						: null;
					
					const isCelebrating = celebratingChallengeId === challenge.id;

					return (
						<Card 
							key={challenge.id} 
							className={`backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-2xl hover:shadow-lg hover:shadow-[#FF0052]/10 transition-all duration-300 transform hover:scale-105 ${
								isCelebrating 
									? 'animate-pulse ring-4 ring-yellow-500/50 shadow-lg shadow-yellow-500/20' 
									: ''
							}`}
						>
							<CardHeader className="pb-4">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg text-[#f5f5f5] flex items-center gap-2">
											{challenge.title}
											{isCelebrating && (
												<Sparkles className="h-5 w-5 text-yellow-500 animate-bounce" />
											)}
										</CardTitle>
										<CardDescription className="mt-1 text-[#f5f5f5]/70">
											{challenge.event_type}
										</CardDescription>
									</div>
									<Badge className={`${getStateColor(challenge.state)} border border-[#f5f5f5]/20`}>
										{challenge.state === 'resolved' && winnerOption ? '🏆 Resolved' : challenge.state}
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center gap-2 text-sm text-[#f5f5f5]/70">
										<Trophy className="h-4 w-4 text-[#FF0052]" />
										<span>{challenge.challenge_options.length} options</span>
									</div>
									
									{challenge.closing_at && (
										<div className="flex items-center gap-2 text-sm text-[#f5f5f5]/70">
											<Clock className="h-4 w-4 text-[#FF0052]" />
											<span>Closes: {new Date(challenge.closing_at).toLocaleDateString()} at {new Date(challenge.closing_at).toLocaleTimeString()}</span>
										</div>
									)}

									{winnerOption && (
										<div className={`flex items-center gap-2 text-sm text-[#f5f5f5] p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 ${
											isCelebrating ? 'animate-bounce' : ''
										}`}>
											<Crown className="h-4 w-4 text-yellow-500" />
											<span className="font-semibold">Winner: {winnerOption.display_name} 🎉</span>
										</div>
									)}
									
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
											<div className="text-xs text-[#f5f5f5]/50 text-center">
												+{challenge.challenge_options.length - 3} more options
											</div>
										)}
									</div>
									
									<div className="flex gap-2 pt-2">
										<Button
											variant="outline"
											size="sm"
											className="flex-1 bg-transparent border-[#f5f5f5]/20 text-[#f5f5f5] hover:bg-[#f5f5f5]/10 hover:border-[#f5f5f5]/40"
										>
											<Eye className="h-4 w-4 mr-1" />
											View
										</Button>
										
										{challenge.state === 'open' && (
											<Button
												onClick={() => handlePickWinner(challenge)}
												size="sm"
												className="flex-1 bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] hover:from-[#ff4d7d] hover:to-[#FF0052] text-white font-medium transition-all duration-300 transform hover:scale-105"
											>
												<Crown className="h-4 w-4 mr-1" />
												Pick Winner
											</Button>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Winner Selection Modal */}
			<Dialog open={isWinnerModalOpen} onOpenChange={setIsWinnerModalOpen}>
				<DialogContent className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/20 rounded-2xl max-w-md">
					<DialogHeader>
						<DialogTitle className="text-xl text-[#f5f5f5] flex items-center gap-2">
							<Crown className="h-5 w-5 text-yellow-500" />
							Select Winner
						</DialogTitle>
						<DialogDescription className="text-[#f5f5f5]/70">
							Choose the winning option for &quot;{selectedChallenge?.title}&quot;
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3 pt-4">
						{selectedChallenge?.challenge_options.map((option) => (
							<Button
								key={option.id}
								onClick={() => selectWinner(option.id)}
								disabled={isSelectingWinner}
								className="w-full h-auto p-4 bg-transparent border border-[#f5f5f5]/20 text-[#f5f5f5] hover:bg-[#FF0052] hover:border-[#FF0052] hover:text-white transition-all duration-300 justify-start text-left"
							>
								<div className="flex items-center gap-3 w-full">
									<div className="p-2 rounded-lg bg-[#FF0052]/20">
										<Trophy className="h-4 w-4 text-[#FF0052]" />
									</div>
									<div className="flex-1">
										<div className="font-medium">{option.display_name}</div>
										<div className="text-sm opacity-75">{option.token_name}</div>
									</div>
									{isSelectingWinner && (
										<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
									)}
								</div>
							</Button>
						))}
						
						{isSelectingWinner && (
							<div className="text-center text-sm text-[#f5f5f5]/70 flex items-center justify-center gap-2 py-2">
								<CheckCircle className="h-4 w-4 animate-pulse" />
								Selecting winner...
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* CSS for confetti animation */}
			<style jsx global>{`
				@keyframes confetti-fall {
					0% {
						transform: translateY(-10px) rotate(0deg);
						opacity: 1;
					}
					100% {
						transform: translateY(100vh) rotate(720deg);
						opacity: 0;
					}
				}
				
				.confetti-piece {
					border-radius: 2px;
				}
			`}</style>
		</>
	);
} 