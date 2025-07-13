"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, Plus, List, PlusCircle, Trophy, Target, Zap } from 'lucide-react'
import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import ChallengeList from '@/components/challenge-list'
import StreamSelector from '@/components/stream-selector'

const challengeOptionSchema = z.object({
	optionKey: z.string().min(1, "Option key is required"),
	displayName: z.string().min(1, "Display name is required"),
	tokenName: z.string().min(1, "Token name is required"),
});

const createChallengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
	streamId: z.string().min(1, "Stream is required").refine(val => val !== "select", {
		message: "Please select a valid stream"
	}),
	eventType: z.string().min(1, "Event Type is required"),
	options: z.array(challengeOptionSchema).min(2, "At least 2 options are required"),
});

type CreateChallengeForm = z.infer<typeof createChallengeSchema>;

export default function ChallengesPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CreateChallengeForm>({
		resolver: zodResolver(createChallengeSchema),
		defaultValues: {
			title: "",
			streamId: "select",
			eventType: "",
			options: [
				{ optionKey: "", displayName: "", tokenName: "" },
				{ optionKey: "", displayName: "", tokenName: "" }
			],
		}
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "options"
	});

	const onSubmit = async (data: CreateChallengeForm) => {
		setIsSubmitting(true);
		
		try {
			const response = await fetch('/api/challenges', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();
			
			if (!response.ok) {
				toast.error(`Failed to create challenge: ${result.error}`);
			} else {
				toast.success("Challenge created successfully!");
	}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const addOption = () => {
		append({ optionKey: "", displayName: "", tokenName: "" });
	};

	const removeOption = (index: number) => {
		if (fields.length > 2) {
			remove(index);
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
				<div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse scale-150"></div>
				<div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000 scale-150"></div>
				
				{/* Matrix-style grid */}
				<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23FF0052%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 animate-pulse"></div>
			</div>

			<main className="relative z-10 min-h-screen">
				<div className="container mx-auto py-6 sm:py-8 px-4">
					<div className="max-w-7xl mx-auto">
						{/* Hero Section */}
						<div className="text-center mb-8 sm:mb-12 transform-gpu animate-fade-in-up">
							<div className="relative mb-4 sm:mb-6">
								<h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-[#f5f5f5] leading-none transform-gpu hover:scale-105 transition-transform duration-700">
									PREDICTION
									<span className="block text-[#FF0052] bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] bg-clip-text text-transparent animate-pulse">
										CHALLENGES
									</span>
								</h1>
								{/* Glow effect */}
								<div className="absolute inset-0 text-4xl sm:text-6xl md:text-8xl font-black text-[#FF0052]/20 blur-xl -z-10 animate-pulse">
									PREDICTION CHALLENGES
								</div>
							</div>
							
							<p className="text-lg sm:text-xl md:text-2xl text-[#f5f5f5]/80 max-w-3xl mx-auto leading-relaxed font-light">
								Create and manage <span className="text-[#FF0052] font-bold">real-time prediction challenges</span>. 
								From epic battles to strategic decisions, let users predict outcomes and earn rewards.
							</p>
						</div>

						{/* Tabs with futuristic styling */}
						<Tabs defaultValue="list" className="space-y-6 sm:space-y-8">
							<TabsList
								className="flex w-full max-w-md mx-auto rounded-full bg-[#1a0f2e] p-1 shadow-lg sticky top-4 z-20"
								role="tablist"
							>
								<TabsTrigger
									value="list"
									className={`
										flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all text-sm sm:text-base
										data-[state=active]:bg-[#FF0052] data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow
										data-[state=inactive]:bg-[#1a0f2e] data-[state=inactive]:text-[#f5f5f5]/90 hover:bg-[#2a183a]/40
										focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0052]
									`}
									aria-label="All Challenges"
									tabIndex={0}
									title="View all challenges"
								>
									<List className="h-4 w-4 sm:h-5 sm:w-5" />
									<span className="hidden sm:inline">All Challenges</span>
									<span className="sm:hidden">All</span>
								</TabsTrigger>
								<TabsTrigger
									value="create"
									className={`
										flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all text-sm sm:text-base
										data-[state=active]:bg-[#FF0052] data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow
										data-[state=inactive]:bg-[#1a0f2e] data-[state=inactive]:text-[#f5f5f5]/90 hover:bg-[#FF0052]/20
										focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0052]
									`}
									aria-label="Create Challenge"
									tabIndex={0}
									title="Create a new challenge"
								>
									<PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
									<span className="hidden sm:inline">Create Challenge</span>
									<span className="sm:hidden">Create</span>
								</TabsTrigger>
							</TabsList>

							<TabsContent value="list" className="space-y-6">
								<div className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-3xl p-4 sm:p-6 lg:p-8">
									<ChallengeList />
								</div>
							</TabsContent>

							<TabsContent value="create">
								<Card className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/20 rounded-3xl overflow-hidden">
									<CardHeader className="border-b border-[#f5f5f5]/10 p-4 sm:p-6">
										<div className="flex items-center gap-3">
											<div className="p-2 sm:p-3 rounded-xl">
												<Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF0052]" />
											</div>
											<div>
												<CardTitle className="text-xl sm:text-2xl text-[#f5f5f5]">Create New Challenge</CardTitle>
												<CardDescription className="text-[#f5f5f5]/70 text-sm sm:text-base">
													Design an exciting prediction challenge with multiple outcomes
												</CardDescription>
											</div>
										</div>
									</CardHeader>
									<CardContent className="p-4 sm:p-6 lg:p-8">
										<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
											{/* Basic Challenge Information */}
											<div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
												<div className="space-y-3">
													<Label htmlFor="title" className="text-[#f5f5f5] font-medium text-sm sm:text-base">Challenge Title</Label>
													<Input
														id="title"
														{...form.register("title")}
														placeholder="Enter an exciting title"
														className="backdrop-blur-xl bg-[#f5f5f5]/10 border-[#f5f5f5]/20 text-[#f5f5f5] placeholder-[#f5f5f5]/50 focus:border-[#FF0052] focus:ring-[#FF0052]/20 h-11 sm:h-10"
													/>
													{form.formState.errors.title && (
														<p className="text-sm text-red-400">
															{form.formState.errors.title.message}
														</p>
													)}
												</div>

												<div className="space-y-3">
													<Label htmlFor="streamId" className="text-[#f5f5f5] font-medium text-sm sm:text-base">Select Stream</Label>
													<StreamSelector
														value={form.watch("streamId")}
														onValueChange={(value) => form.setValue("streamId", value)}
														placeholder="Choose a stream"
													/>
													{form.formState.errors.streamId && (
														<p className="text-sm text-red-400">
															{form.formState.errors.streamId.message}
														</p>
													)}
												</div>

												<div className="space-y-3">
													<Label htmlFor="eventType" className="text-[#f5f5f5] font-medium text-sm sm:text-base">Event Type</Label>
													<Input
														id="eventType"
														{...form.register("eventType")}
														placeholder="e.g., match, tournament"
														className="backdrop-blur-xl bg-[#f5f5f5]/10 border-[#f5f5f5]/20 text-[#f5f5f5] placeholder-[#f5f5f5]/50 focus:border-[#FF0052] focus:ring-[#FF0052]/20 h-11 sm:h-10"
													/>
													{form.formState.errors.eventType && (
														<p className="text-sm text-red-400">
															{form.formState.errors.eventType.message}
														</p>
													)}
												</div>
											</div>

											<Separator className="bg-[#f5f5f5]/20" />

											{/* Challenge Options */}
											<div className="space-y-4 sm:space-y-6">
												<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
													<div className="flex items-center gap-3">
														<div className="p-2 bg-[#FF0052]/20 rounded-lg">
															<Target className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF0052]" />
														</div>
														<div>
															<h3 className="text-lg sm:text-xl font-semibold text-[#f5f5f5]">Challenge Options</h3>
															<p className="text-xs sm:text-sm text-[#f5f5f5]/70">
																Define the available outcomes for this challenge
															</p>
														</div>
													</div>
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={addOption}
														className="flex bg-transparent items-center gap-2 border-[#f5f5f5]/20 text-[#f5f5f5] hover:bg-[#FF0052] hover:border-[#FF0052] hover:text-white transition-all duration-300 h-10 sm:h-9"
													>
														<Plus className="h-4 w-4" />
														Add Option
													</Button>
												</div>

												<div className="space-y-4">
													{fields.map((field, index) => (
														<Card key={field.id} className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-2xl p-4 sm:p-6">
															<div className="flex items-center justify-between mb-4">
																<div className="flex items-center gap-3">
																	<div className="p-2 bg-[#FF0052]/20 rounded-lg">
																		<Zap className="h-3 w-3 sm:h-4 sm:w-4 text-[#FF0052]" />
																	</div>
																	<h4 className="font-medium text-[#f5f5f5] text-sm sm:text-base">Option {index + 1}</h4>
																</div>
																{fields.length > 2 && (
																	<Button
																		type="button"
																		variant="ghost"
																		size="sm"
																		onClick={() => removeOption(index)}
																		className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-300 h-8 w-8 p-0"
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																)}
															</div>

															<div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4">
																<div className="space-y-2">
																	<Label htmlFor={`options.${index}.optionKey`} className="text-[#f5f5f5] text-xs sm:text-sm">
																		Option Key
																	</Label>
																	<Input
																		id={`options.${index}.optionKey`}
																		{...form.register(`options.${index}.optionKey`)}
																		placeholder="e.g., team_a, winner"
																		className="backdrop-blur-xl bg-[#f5f5f5]/10 border-[#f5f5f5]/20 text-[#f5f5f5] placeholder-[#f5f5f5]/50 focus:border-[#FF0052] focus:ring-[#FF0052]/20 h-10 sm:h-9 text-sm"
																	/>
																	{form.formState.errors.options?.[index]?.optionKey && (
																		<p className="text-xs text-red-400">
																			{form.formState.errors.options[index]?.optionKey?.message}
																		</p>
																	)}
																</div>

																<div className="space-y-2">
																	<Label htmlFor={`options.${index}.displayName`} className="text-[#f5f5f5] text-xs sm:text-sm">
																		Display Name
																	</Label>
																	<Input
																		id={`options.${index}.displayName`}
																		{...form.register(`options.${index}.displayName`)}
																		placeholder="e.g., Team A, Winner"
																		className="backdrop-blur-xl bg-[#f5f5f5]/10 border-[#f5f5f5]/20 text-[#f5f5f5] placeholder-[#f5f5f5]/50 focus:border-[#FF0052] focus:ring-[#FF0052]/20 h-10 sm:h-9 text-sm"
																	/>
																	{form.formState.errors.options?.[index]?.displayName && (
																		<p className="text-xs text-red-400">
																			{form.formState.errors.options[index]?.displayName?.message}
																		</p>
																	)}
																</div>

																<div className="space-y-2">
																	<Label htmlFor={`options.${index}.tokenName`} className="text-[#f5f5f5] text-xs sm:text-sm">
																		Token Name
																	</Label>
																	<Input
																		id={`options.${index}.tokenName`}
																		{...form.register(`options.${index}.tokenName`)}
																		placeholder="e.g., TEAM_A, WINNER"
																		className="backdrop-blur-xl bg-[#f5f5f5]/10 border-[#f5f5f5]/20 text-[#f5f5f5] placeholder-[#f5f5f5]/50 focus:border-[#FF0052] focus:ring-[#FF0052]/20 h-10 sm:h-9 text-sm"
																	/>
																	{form.formState.errors.options?.[index]?.tokenName && (
																		<p className="text-xs text-red-400">
																			{form.formState.errors.options[index]?.tokenName?.message}
																		</p>
																	)}
																</div>
															</div>
														</Card>
													))}
												</div>

												{form.formState.errors.options && (
													<p className="text-sm text-red-400">
														{form.formState.errors.options.message}
													</p>
												)}
											</div>

											<Separator className="bg-[#f5f5f5]/20" />

											{/* Submit Button */}
											<div className="flex justify-center sm:justify-end">
												<Button
													type="submit"
													disabled={isSubmitting}
													className="w-full sm:w-auto sm:min-w-[200px] bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] hover:from-[#ff4d7d] hover:to-[#FF0052] text-white font-semibold py-3 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed h-12 sm:h-11"
												>
													{isSubmitting ? (
														<div className="flex items-center justify-center gap-2">
															<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
															Creating...
														</div>
													) : (
														<div className="flex items-center justify-center gap-2">
															<Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
															Create Challenge
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
