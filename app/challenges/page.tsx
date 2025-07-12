"use client";

import { Button } from '@/components/ui/button'
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const createChallengeForm = z.object({
  title: z.string().min(1, "Title is required"),
  streamId: z.string().min(1, "Stream ID is required"),
	eventType: z.string().min(1, "Event Type is required"),
  teamA: z.string().min(1, "Team A is required"),
  teamB: z.string().min(1, "Team B is required"),
  tokenA: z.string().min(1, "Token A is required"),
  tokenB: z.string().min(1, "Token B is required"),
});

type CreateChallengeForm = z.infer<typeof createChallengeForm>;

export default function ChallengesPage() {
	const form = useForm<CreateChallengeForm>({
		resolver: zodResolver(createChallengeForm),
		defaultValues: {
			title: "",
			streamId: "",
			eventType: "",
			teamA: "",
			teamB: "",
			tokenA: "",
			tokenB: "",
		}
	});

	const onSubmit = (data: CreateChallengeForm) => {
		console.log(data);
		form.reset();
	}

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h1 className='text-4xl font-bold'>Create Challenge</h1>
				<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-2 w-full max-w-md'>
					<Label>Title</Label>
					<Input {...form.register("title")} placeholder='Title' />
					<Label>Stream ID</Label>
					<Input {...form.register("streamId")} placeholder='Stream ID' />
					<Label>Event Type</Label>
					<Input {...form.register("eventType")} placeholder='Event Type' />
					<Label>Team A</Label>
					<Input {...form.register("teamA")} placeholder='Team A' />
					<Label>Team B</Label>
					<Input {...form.register("teamB")} placeholder='Team B' />
					<Label>Token A</Label>
					<Input {...form.register("tokenA")} placeholder='Token A' />
					<Label>Token B</Label>
					<Input {...form.register("tokenB")} placeholder='Token B' />
				</div>
				<Button type="submit">Create Challenge</Button>
			</form>
		</div>
	)
}
