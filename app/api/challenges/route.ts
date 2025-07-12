import { createChallenge, getChallenges } from '@/lib/challenges/actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	try {
		const result = await getChallenges();

		if (result.error) {
			return NextResponse.json(
				{ error: result.error },
				{ status: 400 }
			);
		}

		return NextResponse.json(result.data);
	} catch (error) {
		console.error('Error fetching challenges:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const result = await createChallenge(body);

		if (result.error) {
			return NextResponse.json(
				{ error: result.error },
				{ status: 400 }
			);
		}

		return NextResponse.json(result.data);
	} catch (error) {
		console.error('Error creating challenge:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
} 