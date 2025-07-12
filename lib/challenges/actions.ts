import { createClient } from "@/lib/supabase/server";

export interface CreateChallengeData {
	streamId: string;
	eventType: string;
	title: string;
	options: {
		optionKey: string;
		displayName: string;
		tokenName: string;
	}[];
}

interface ChallengeOption {
	id: string;
	challenge_id: string;
	option_key: string;
	display_name: string;
	token_name: string;
	created_at: string;
}

export async function createChallenge(data: CreateChallengeData) {
	const supabase = await createClient();

	// First, create the challenge
	const { data: challenge, error: challengeError } = await supabase
		.from("challenges")
		.insert({
			stream_id: data.streamId,
			event_type: data.eventType,
			title: data.title,
		})
		.select()
		.single();

	if (challengeError) {
		console.error("Error creating challenge:", challengeError);
		return { error: challengeError.message };
	}

	// Then, create the challenge options
	const optionsToInsert = data.options.map(option => ({
		challenge_id: challenge.id,
		option_key: option.optionKey,
		display_name: option.displayName,
		token_name: option.tokenName,
	}));

	const { data: options, error: optionsError } = await supabase
		.from("challenge_options")
		.insert(optionsToInsert)
		.select();

	if (optionsError) {
		console.error("Error creating challenge options:", optionsError);
		return { error: optionsError.message };
	}

	// Broadcast the new challenge via WebSocket
	try {
		await supabase
			.channel(`stream-${data.streamId}`)
			.send({
				type: 'broadcast',
				event: 'challenge:new',
				payload: {
					id: challenge.id,
					title: data.title,
					event_type: data.eventType,
					stream_id: data.streamId,
					options: options,
					timestamp: new Date().toISOString()
				}
			});
	} catch (broadcastError) {
		console.error("Error broadcasting challenge:", broadcastError);
		// Don't fail the entire operation if broadcasting fails
	}

	return { 
		data: { 
			challenge, 
			options 
		} 
	};
}

export async function getChallenges() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("challenges")
		.select(`
			*,
			challenge_options (*)
		`)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching challenges:", error);
		return { error: error.message };
	}

	// Clean challenge_options data to ensure consistent structure
	const cleanedData = data?.map(challenge => ({
		...challenge,
		challenge_options: challenge.challenge_options?.map((option: ChallengeOption) => ({
			id: option.id,
			challenge_id: option.challenge_id,
			option_key: option.option_key,
			display_name: option.display_name,
			token_name: option.token_name,
			created_at: option.created_at
		})) || []
	}));

	return { data: cleanedData };
}