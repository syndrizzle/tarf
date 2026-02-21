import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone_number } = body;

    const RETELL_API_KEY = process.env.RETELL_API_KEY || "";
    const AGENT_ID = process.env.AGENT_ID || "";
    const FROM_PHONE_NUMBER = process.env.FROM_PHONE_NUMBER || "";

    if (!RETELL_API_KEY || !AGENT_ID || !FROM_PHONE_NUMBER) {
      console.error("Missing required environment variables:");
      if (!RETELL_API_KEY) console.error("- RETELL_API_KEY");
      if (!AGENT_ID) console.error("- AGENT_ID");
      if (!FROM_PHONE_NUMBER) console.error("- FROM_PHONE_NUMBER");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://api.retellai.com/v2/create-phone-call",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_number: FROM_PHONE_NUMBER,
          to_number: phone_number,
          override_agent_id: AGENT_ID,
          retell_llm_dynamic_variables: {},
        }),
      },
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = response.statusText;
      }
      console.error("Error creating call:", errorData);
      return NextResponse.json(
        { error: "Failed to create call" },
        { status: 500 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data.call_id);
  } catch (error: any) {
    console.error("Error creating call:", error.message);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 },
    );
  }
}
