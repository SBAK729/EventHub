import { NextRequest, NextResponse } from "next/server";
import { getEventsByUser } from "@/lib/actions/event.actions";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params; // ✅ await the params
    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;

    const events = await getEventsByUser({ userId, page, limit });

    if (!events) {
      return NextResponse.json({ error: "No events found" }, { status: 404 });
    }

    return NextResponse.json(events);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
