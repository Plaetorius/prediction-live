import { createClient } from "@/lib/supabase/server";

export async function createChallenge(formData: FormData) {
	const supabase = await createClient();

	const { data, error } = await supabase.from("challenges").insert({
		title: formData.get("title"),
		teamA: formData.get("teamA"),
		teamB: formData.get("teamB"),
		tokenA: formData.get("tokenA"),
		tokenB: formData.get("tokenB"),
	}).select().single();

	if (error) {
		console.error(error);
		return { error: error.message };
	}

	return { data };
}