import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { initialWeddingData } from '@/data/defaultWeddingData';
import { WishMessage } from '@/types/wedding';

export const dynamic = 'force-dynamic';

const COLLECTION_NAME = 'wishes';

/**
 * Ensure MongoDB indexes for super-fast queries:
 * 1. createdAt: -1 (for fast sorted timeline)
 * 2. approved: 1 (for fast filtering)
 */
async function ensureWishesIndexes(db: any) {
  try {
    const collection = db.collection(COLLECTION_NAME);
    await collection.createIndex({ createdAt: -1 }, { background: true });
    await collection.createIndex({ approved: 1 }, { background: true });
  } catch (err) {
    // Index may already exist or background indexing in progress
  }
}

/**
 * GET: Fetch all wishes & blessings.
 * Automatically seeds initial wishes into MongoDB if collection is empty on first run!
 */
export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase();

    if (!db) {
      // Fallback: Return code defaults if MongoDB is offline / not yet configured
      return NextResponse.json({
        success: true,
        source: 'fallback',
        wishes: initialWeddingData.wishes,
      });
    }

    const collection = db.collection(COLLECTION_NAME);
    await ensureWishesIndexes(db);

    // Fast lean projection: exclude MongoDB internal _id or map it cleanly
    const count = await collection.countDocuments();
    if (count === 0) {
      // Auto-seed initial demo wishes to MongoDB
      console.log('🌱 Seeding initial wedding wishes into MongoDB collection...');
      const seedDocs = initialWeddingData.wishes.map((w) => ({
        ...w,
        createdAt: w.createdAt || new Date().toISOString(),
      }));
      await collection.insertMany(seedDocs);
    }

    const url = new URL(req.url);
    const filterApproved = url.searchParams.get('approvedOnly') === 'true';
    const query = filterApproved ? { approved: true } : {};

    const wishes = await collection
      .find(query, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      count: wishes.length,
      wishes,
    });
  } catch (error) {
    console.error('Error fetching wishes from MongoDB:', error);
    return NextResponse.json({
      success: true,
      source: 'fallback_error',
      wishes: initialWeddingData.wishes,
    });
  }
}

/**
 * POST: Add a new wish / blessing.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const guestName = String(body.guestName || '').trim() || 'Well-wisher (የክብር እንግዳ)';
    const message = String(body.message || '').trim();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    const newWish: WishMessage = {
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      guestName,
      message,
      createdAt: new Date().toISOString(),
      likes: 0,
      approved: true, // Default visible; admin can hide/edit anytime
    };

    const db = await getDatabase();
    if (db) {
      const collection = db.collection(COLLECTION_NAME);
      await collection.insertOne({ ...newWish });
    }

    return NextResponse.json({
      success: true,
      source: db ? 'mongodb' : 'local',
      wish: newWish,
    });
  } catch (error) {
    console.error('Error inserting wish:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit wish' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Edit / update a wish (Admin can edit text, hide/approve, or increment likes).
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, guestName, message, approved, likes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Wish ID is required' },
        { status: 400 }
      );
    }

    const updateFields: Partial<WishMessage> = {};
    if (guestName !== undefined) updateFields.guestName = String(guestName).trim();
    if (message !== undefined) updateFields.message = String(message).trim();
    if (approved !== undefined) updateFields.approved = Boolean(approved);
    if (likes !== undefined) updateFields.likes = Number(likes);

    const db = await getDatabase();
    if (db) {
      const collection = db.collection(COLLECTION_NAME);
      await collection.updateOne({ id }, { $set: updateFields });
    }

    return NextResponse.json({
      success: true,
      source: db ? 'mongodb' : 'local',
      updated: { id, ...updateFields },
    });
  } catch (error) {
    console.error('Error updating wish:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update wish' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete a wish permanently.
 */
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Wish ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    if (db) {
      const collection = db.collection(COLLECTION_NAME);
      await collection.deleteOne({ id });
    }

    return NextResponse.json({
      success: true,
      source: db ? 'mongodb' : 'local',
      deletedId: id,
    });
  } catch (error) {
    console.error('Error deleting wish:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete wish' },
      { status: 500 }
    );
  }
}
