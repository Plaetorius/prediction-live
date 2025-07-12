import { createClient } from "@/lib/supabase/server";

export interface CreateStreamData {
	twitchStreamId: string;
	gameId: string;
}

export async function createStream(data: CreateStreamData) {
	const supabase = await createClient();

	const { data: stream, error } = await supabase
		.from("streams")
		.insert({
			twitch_stream_id: data.twitchStreamId,
			game_id: data.gameId,
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating stream:", error);
		return { error: error.message };
	}

	return { data: stream };
}

export async function getStreams() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("streams")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching streams:", error);
		return { error: error.message };
	}

	return { data };
} 