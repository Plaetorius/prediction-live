"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { List, PlusCircle, Video, Gamepad2, Zap } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import StreamList from '@/components/stream-list'

const createStreamSchema = z.object({
	twitchStreamId: z.string().min(1, "Twitch Stream ID is required"),
	gameId: z.string().min(1, "Game ID is required"),
});

type CreateStreamForm = z.infer<typeof createStreamSchema>;

export default function StreamsPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CreateStreamForm>({
		resolver: zodResolver(createStreamSchema),
		defaultValues: {
			twitchStreamId: "",
			gameId: "",
		}
	});

	const onSubmit = async (data: CreateStreamForm) => {
		setIsSubmitting(true);
		
		try {
			const response = await fetch('/api/streams', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();
			
			if (!response.ok) {
				toast.error(`Failed to create stream: ${result.error}`);
			} else {
				toast.success("Stream created successfully!");
				form.reset();
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0B0518] via-[#1a0f2e] to-[#0B0518]">
			{/* Advanced Particle System */}
			<div className="absolute inset-0">
				{/* Floating particles */}
				{[...Array(30)].map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-[#FF0052] rounded-full animate-pulse"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							animationDuration: `${2 + Math.random() * 2}s`,
						}}
					/>
				))}
				
				{/* Animated background orbs */}
				<div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse scale-150"></div>
				<div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000 scale-150"></div>
				
				{/* Matrix-style grid */}
				<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23FF0052%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 animate-pulse"></div>
			</div>

			<main className="relative z-10 min-h-screen">
				<div className="container mx-auto py-8 px-4">
					<div className="max-w-7xl mx-auto">
						{/* Hero Section */}
						<div className="text-center mb-12 transform-gpu animate-fade-in-up">
							<div className="relative mb-6">
								<h1 className="text-6xl md:text-8xl font-black text-[#f5f5f5] leading-none transform-gpu hover:scale-105 transition-transform duration-700">
									LIVE
									<span className="block text-[#FF0052] bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] bg-clip-text text-transparent animate-pulse">
										STREAMS
									</span>
								</h1>
								{/* Glow effect */}
								<div className="absolute inset-0 text-6xl md:text-8xl font-black text-[#FF0052]/20 blur-xl -z-10 animate-pulse">
									LIVE STREAMS
								</div>
							</div>
							
							<p className="text-xl md:text-2xl text-[#f5f5f5]/80 max-w-3xl mx-auto leading-relaxed font-light">
								Manage and monitor <span className="text-[#FF0052] font-bold">Twitch streams</span>. 
								Connect your favorite channels and create prediction challenges around live content.
							</p>
						</div>

						{/* Tabs with futuristic styling */}
						<Tabs defaultValue="list" className="space-y-8">
							<TabsList
								className="flex w-full max-w-md mx-auto rounded-full bg-[#1a0f2e] p-1 shadow-lg sticky top-4 z-20"
								role="tablist"
							>
								<TabsTrigger
									value="list"
									className={`
										flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all
										data-[state=active]:bg-[#FF0052] data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow
										data-[state=inactive]:bg-[#1a0f2e] data-[state=inactive]:text-[#f5f5f5]/90 hover:bg-[#2a183a]/40
										focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0052]
									`}
									aria-label="All Streams"
									tabIndex={0}
									title="View all streams"
								>
									<List className="h-5 w-5" />
									All Streams
								</TabsTrigger>
								<TabsTrigger
									value="create"
									className={`
										flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all
										data-[state=active]:bg-[#FF0052] data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow
										data-[state=inactive]:bg-[#1a0f2e] data-[state=inactive]:text-[#f5f5f5]/90 hover:bg-[#FF0052]/20
										focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0052]
									`}
									aria-label="Create Stream"
									tabIndex={0}
									title="Add a new stream"
								>
									<PlusCircle className="h-5 w-5" />
									Create Stream
								</TabsTrigger>
							</TabsList>

							<TabsContent value="list" className="space-y-6">
								<div className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-3xl p-8">
									<StreamList />
								</div>
							</TabsContent>

							<TabsContent value="create">
								<Card className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/20 rounded-3xl overflow-hidden">
									<CardHeader className="bg-gradient-to-r from-[#FF0052]/10 to-[#ff4d7d]/10 border-b border-[#f5f5f5]/10">
										<div className="flex items-center gap-3">
											<div className="p-3 bg-[#FF0052]/20 rounded-xl">
												<Video className="h-6 w-6 text-[#FF0052]" />
											</div>
											<div>
												<CardTitle className="text-2xl text-[#f5f5f5]">Add New Stream</CardTitle>
												<CardDescription className="text-[#f5f5f5]/70">
													Connect a Twitch stream to enable prediction challenges
												</CardDescription>
											</div>
										</div>
									</CardHeader>
									<CardContent className="p-8">
										<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div className="space-y-3">
													<Label htmlFor="twitchStreamId" className="text-[#f5f5f5] font-medium">Twitch Stream ID</Label>
													<Input
														id="twitchStreamId"
														{...form.register("twitchStreamId")}
														placeholder="Enter Twitch stream ID"
														className="backdrop-blur-xl bg-[#f5f5f5]/10 border-[#f5f5f5]/20 text-[#f5f5f5] placeholder-[#f5f5f5]/50 focus:border-[#FF0052] focus:ring-[#FF0052]/20"
													/>
													{form.formState.errors.twitchStreamId && (
														<p className="text-sm text-red-400">
															{form.formState.errors.twitchStreamId.message}
														</p>
													)}
												</div>

												<div className="space-y-3">
													<Label htmlFor="gameId" className="text-[#f5f5f5] font-medium">Game ID</Label>
													<Input
														id="gameId"
														{...form.register("gameId")}
														placeholder="Enter game ID"
														className="backdrop-blur-xl bg-[#f5f5f5]/10 border-[#f5f5f5]/20 text-[#f5f5f5] placeholder-[#f5f5f5]/50 focus:border-[#FF0052] focus:ring-[#FF0052]/20"
													/>
													{form.formState.errors.gameId && (
														<p className="text-sm text-red-400">
															{form.formState.errors.gameId.message}
														</p>
													)}
												</div>
											</div>

											{/* Stream Info Cards */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<Card className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-2xl p-6">
													<div className="flex items-center gap-3 mb-4">
														<div className="p-2 bg-[#FF0052]/20 rounded-lg">
															<Video className="h-5 w-5 text-[#FF0052]" />
														</div>
														<h3 className="font-semibold text-[#f5f5f5]">Stream Details</h3>
													</div>
													<p className="text-sm text-[#f5f5f5]/70">
														The Twitch Stream ID is the unique identifier for the channel you want to monitor. 
														This will be used to track live events and create prediction challenges.
													</p>
												</Card>

												<Card className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-2xl p-6">
													<div className="flex items-center gap-3 mb-4">
														<div className="p-2 bg-[#FF0052]/20 rounded-lg">
															<Gamepad2 className="h-5 w-5 text-[#FF0052]" />
														</div>
														<h3 className="font-semibold text-[#f5f5f5]">Game Information</h3>
													</div>
													<p className="text-sm text-[#f5f5f5]/70">
														The Game ID helps categorize the stream content and enables game-specific 
														prediction challenges and features.
													</p>
												</Card>
											</div>

											{/* Submit Button */}
											<div className="flex justify-end">
												<Button
													type="submit"
													disabled={isSubmitting}
													className="min-w-[200px] bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] hover:from-[#ff4d7d] hover:to-[#FF0052] text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													{isSubmitting ? (
														<div className="flex items-center gap-2">
															<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
															Creating...
														</div>
													) : (
														<div className="flex items-center gap-2">
															<Zap className="h-5 w-5" />
															Create Stream
														</div>
													)}
												</Button>
											</div>
										</form>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</main>

			<style jsx>{`
				@keyframes fade-in-up {
					from { 
						opacity: 0; 
						transform: translateY(30px); 
					}
					to { 
						opacity: 1; 
						transform: translateY(0); 
					}
				}
				
				.animate-fade-in-up {
					animation: fade-in-up 1.5s ease-out;
				}
				
				.transform-gpu {
					transform: translateZ(0);
				}
			`}</style>
		</div>
	);
} 