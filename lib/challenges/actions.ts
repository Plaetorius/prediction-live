import { createClient } from "@/lib/supabase/server";

export interface CreateChallengeData {
	streamId: string;
	eventType: string;
	title: string;
	duration: number; // Duration in seconds
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

	// Compute closing_at based on duration (in seconds)
	const now = new Date();
	const closingAt = new Date(now.getTime() + data.duration * 1000);

	// First, create the challenge
	const { data: challenge, error: challengeError } = await supabase
		.from("challenges")
		.insert({
			stream_id: data.streamId,
			event_type: data.eventType,
			title: data.title,
			closing_at: closingAt.toISOString(),
		})
		.select('*')
		.single();

	if (challengeError) {
		console.error("Error creating challenge:", challengeError);
		return { error: challengeError.message };
	}

	console.log('✅ Challenge created with ID:', challenge.id);
	console.log('📊 Challenge data:', challenge);

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

	console.log('✅ Challenge options created:', options.length, 'options for challenge ID:', challenge.id);

	return { 
		data: { 
			challenge, 
			options 
		} 
	};
}

export async function getChallenges() {
	const supabase = await createClient();

	console.log('🔍 Fetching challenges from database...');

	const { data, error } = await supabase
		.from("challenges")
		.select(`
			*,
			challenge_options (*)
		`)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("❌ Error fetching challenges:", error);
		return { error: error.message };
	}

	console.log('📊 Raw challenges data from DB:', data);
	console.log('📈 Number of challenges found:', data?.length || 0);

	if (!data || data.length === 0) {
		console.log('⚠️ No challenges found in database');
		return { data: [] };
	}

	// Clean challenge_options data to ensure consistent structure
	const cleanedData = data?.map(challenge => {
		console.log(`🔧 Processing challenge ${challenge.id}:`, challenge.title);
		console.log(`📋 Challenge options for ${challenge.id}:`, challenge.challenge_options?.length || 0);
		
		return {
			...challenge,
			challenge_options: challenge.challenge_options?.map((option: ChallengeOption) => ({
				id: option.id,
				challenge_id: option.challenge_id,
				option_key: option.option_key,
				display_name: option.display_name,
				token_name: option.token_name,
				created_at: option.created_at
			})) || []
		};
	});

	console.log('✅ Cleaned challenges data:', cleanedData);
	console.log('📊 Final number of challenges:', cleanedData?.length || 0);

	return { data: cleanedData };
}