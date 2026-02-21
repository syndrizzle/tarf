import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ call_id: string }> },
) {
  try {
    const { call_id } = await params;
    const RETELL_API_KEY = process.env.RETELL_API_KEY || "";

    if (!RETELL_API_KEY) {
      console.error("Missing RETELL_API_KEY environment variable");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.retellai.com/v2/get-call/${call_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = response.statusText;
      }
      console.error("Error fetching call details:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch call details" },
        { status: 500 },
      );
    }

    const data = await response.json();

    const results = {
      summary: data.call_analysis?.call_summary,
      user_sentiment: data.call_analysis?.user_sentiment,
      transcript: data.transcript,
      call_status: data.call_status,
    };

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error fetching call details:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch call details" },
      { status: 500 },
    );
  }
}
