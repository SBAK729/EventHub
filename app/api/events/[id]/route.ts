import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/actions/event.actions";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const event = await getEventById(id);

    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// -----------------------------
// New POST handler for moderation
// -----------------------------
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    // Here you’d call your moderation logic (AI, n8n webhook, etc.)
    // For now, we just echo back what was sent.
    return NextResponse.json({
      message: `Moderation received for event ${id}`,
      data: body,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to process moderation request" },
      { status: 500 }
    );
  }
}

