import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get form data from incoming request
    const formData = await req.formData();

    // Forward DIRECTLY to external API (like their working code)
    const externalResponse = await fetch(
      "https://gateway-cus.gov.bw/document/upload/MESD_006_28_001",
      {
        method: "POST",
        headers: {
          Cookie: `JSESSIONID=E876F96891828C4B19EB513960B56E18`, // Use env variable or hardcode
        },
        body: formData, // Send directly, don't rebuild
      }
    );

    const textResponse = await externalResponse.text();

    if (!externalResponse.ok) {
      return NextResponse.json(
        { error: textResponse },
        { status: externalResponse.status }
      );
    }

    return NextResponse.json({
      message: "Upload successful",
      response: textResponse,
    });
  } catch (err: any) {
    console.error("Proxy upload error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}