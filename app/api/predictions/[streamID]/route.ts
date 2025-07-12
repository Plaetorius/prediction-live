import { corsHeaders } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(request: NextRequest) {
	const origin = request.headers.get("origin") || undefined;
	return NextResponse.json({}, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ streamID: string }> }) {
  const { streamID } = await params;
	const origin = request.headers.get("origin") || undefined;


	console.log("streamID", streamID);
	console.log("request", request);

	const response =NextResponse.json(
		{
			type: "stream_status",
			hasActiveStream: true, 
			streamID: streamID ? streamID : "otplol_", // TODO: remove this
		},
		{ status: 200, headers: corsHeaders(origin) }
	);

	console.log("response", response);

	return response;
}