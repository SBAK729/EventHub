import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/index";
import Event from "@/lib/database/models/event.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const events = await Event.find({})
      .populate("category") 
      .populate({
        path: "organizer",
        select: "firstName lastName", 
      });

    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
