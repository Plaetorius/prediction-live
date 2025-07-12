import { corsHeaders } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(request: NextRequest) {
	const origin = request.headers.get("origin") || undefined;
	return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ challengeId: string }> }) {
  const { challengeId } = await params;
	const origin = request.headers.get("origin") || undefined;

  return NextResponse.json({ challengeId }, { status: 200, headers: corsHeaders(origin) });
}