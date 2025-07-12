import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { streamID: string } }) {
  const { streamID } = params;
  return NextResponse.json(
		{
			type: "stream_status",
			hasActiveStream: true, 
			streamID: streamID ? streamID : "otplol_", // TODO: remove this
		},
		{ status: 200 }
	);
}