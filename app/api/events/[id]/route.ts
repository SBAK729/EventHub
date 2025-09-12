import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/actions/event.actions";

// -----------------------------
// GET handler
// -----------------------------
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ must await here
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
// POST handler for moderation
// -----------------------------
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ await here too
    const body = await req.json();

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
