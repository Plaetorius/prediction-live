import { corsHeaders } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(request: NextRequest) {
	const origin = request.headers.get("origin") || undefined;
	return NextResponse.json({}, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ streamId: string }> }) {
  const { streamId } = await params;
	const origin = request.headers.get("origin") || undefined;


	console.log("streamID", streamId);
	console.log("request", request);

	// TODO if Challenge happening while user connects, send it

	const response =NextResponse.json(
		{
			open: true, 
			streamId: streamId ? streamId : "otplol_", // TODO: remove this
		},
		{ status: 200, headers: corsHeaders(origin) }
	);

	console.log("response", response);

	return response;
}