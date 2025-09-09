// app/api/event/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectToDatabase} from '@/lib/database/index';
import Event from '@/lib/database/models/event.model';

// GET /api/allevents
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const events = await Event.find({});
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
