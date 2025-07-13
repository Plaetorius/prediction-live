import { corsHeaders } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(request: NextRequest) {
	const origin = request.headers.get("origin") || undefined;
	return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ challengeId: string }> }) {
  const { challengeId } = await params;
	const origin = request.headers.get("origin") || undefined;

	try {
		// Create Supabase client
		const supabase = await createClient();
		
		// Get the current user
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		
		if (authError || !user) {
			console.error('❌ Authentication error:', authError);
			return NextResponse.json(
				{ error: 'Authentication required' }, 
				{ status: 401, headers: corsHeaders(origin) }
			);
		}

		// Parse request body
		const body = await request.json();
		const { option_id, amount, token_name } = body;

		// Validate required fields
		if (!option_id || !amount || !token_name) {
			return NextResponse.json(
				{ error: 'Missing required fields: option_id, amount, token_name' },
				{ status: 400, headers: corsHeaders(origin) }
			);
		}

		// Validate amount is positive
		if (amount <= 0) {
			return NextResponse.json(
				{ error: 'Amount must be positive' },
				{ status: 400, headers: corsHeaders(origin) }
			);
		}

		console.log('🎯 Creating prediction:', {
			challengeId,
			userId: user.id,
			optionId: option_id,
			amount,
			tokenName: token_name
		});

		// Insert prediction into database
		const { data: prediction, error: insertError } = await supabase
			.from('predictions')
			.insert({
				user_id: user.id,
				challenge_id: challengeId,
				option_id: option_id,
				token_name: token_name,
				amount: amount,
				status: 'pending'
			})
			.select('*')
			.single();

		if (insertError) {
			console.error('❌ Database error:', insertError);
			return NextResponse.json(
				{ error: 'Failed to create prediction', details: insertError.message },
				{ status: 500, headers: corsHeaders(origin) }
			);
		}

		console.log('✅ Prediction created successfully:', prediction.id);

		return NextResponse.json({
			success: true,
			prediction: {
				id: prediction.id,
				challengeId: prediction.challenge_id,
				optionId: prediction.option_id,
				amount: prediction.amount,
				tokenName: prediction.token_name,
				status: prediction.status,
				placedAt: prediction.placed_at
			}
		}, { 
			status: 201, 
			headers: corsHeaders(origin) 
		});

	} catch (error) {
		console.error('❌ Error creating prediction:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500, headers: corsHeaders(origin) }
		);
	}
}