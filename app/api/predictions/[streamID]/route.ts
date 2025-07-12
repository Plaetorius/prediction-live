import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ streamID: string }> }) {
  const { streamID } = await params;

	console.log("streamID", streamID);
	console.log("request", request);

	const response =NextResponse.json(
		{
			type: "stream_status",
			hasActiveStream: true, 
			streamID: streamID ? streamID : "otplol_", // TODO: remove this
		},
		{ status: 200 } 
	);

	console.log("response", response);

	return response;
}