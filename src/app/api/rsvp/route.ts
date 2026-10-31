import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const COLLECTION_NAME = 'rsvps';

/**
 * Ensure MongoDB indexes for RSVPs
 */
async function ensureRsvpIndexes(db: any) {
  try {
    const collection = db.collection(COLLECTION_NAME);
    await collection.createIndex({ createdAt: -1 }, { background: true });
    await collection.createIndex({ name: 1 }, { background: true });
  } catch (err) {
    // Index may already exist
  }
}

/**
 * GET: Fetch all confirmed wedding RSVPs from MongoDB
 */
export async function GET() {
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        source: 'local_fallback',
        count: 0,
        rsvps: [],
      });
    }

    const collection = db.collection(COLLECTION_NAME);
    await ensureRsvpIndexes(db);

    const rsvps = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      count: rsvps.length,
      rsvps,
    });
  } catch (error) {
    console.error('Error fetching RSVPs from MongoDB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}

/**
 * POST: Submit wedding RSVP with guest name and save directly to MongoDB
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Guest name is required to submit RSVP' },
        { status: 400 }
      );
    }

    const newRsvp = {
      id: body.id || `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      phone: String(body.phone || '').trim(),
      status: body.status === 'declined' ? 'declined' : 'attending',
      attendingCount: Math.max(1, Number(body.attendingCount || body.attendingPlusOnes || 1)),
      notes: String(body.notes || '').trim(),
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const db = await getDatabase();
    if (db) {
      const collection = db.collection(COLLECTION_NAME);
      await collection.insertOne({ ...newRsvp });
      console.log(` Saved RSVP for "${newRsvp.name}" (${newRsvp.status}) to MongoDB Atlas!`);
    }

    return NextResponse.json({
      success: true,
      source: db ? 'mongodb' : 'local',
      rsvp: newRsvp,
    });
  } catch (error) {
    console.error('Error saving RSVP to MongoDB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit wedding RSVP' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove RSVP by ID
 */
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'RSVP ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    if (db) {
      const collection = db.collection(COLLECTION_NAME);
      await collection.deleteOne({ id });
    }

    return NextResponse.json({ success: true, source: db ? 'mongodb' : 'local', deletedId: id });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete RSVP' }, { status: 500 });
  }
}
