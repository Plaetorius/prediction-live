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

		// Parse request body
		const body = await request.json();
		const { option_id, amount, token_name, wallet_address } = body;

		// Validate required fields
		if (!option_id || !amount || !token_name || !wallet_address) {
			return NextResponse.json(
				{ error: 'Missing required fields: option_id, amount, token_name, wallet_address' },
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
			optionId: option_id,
			amount,
			tokenName: token_name,
			walletAddress: wallet_address
		});

		// Insert prediction into database
		const { data: prediction, error: insertError } = await supabase
			.from('predictions')
			.insert({
				challenge_id: challengeId,
				option_id: option_id,
				token_name: token_name,
				amount: amount,
				status: 'pending',
				wallet_address: wallet_address
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
				placedAt: prediction.placed_at,
				walletAddress: prediction.wallet_address
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