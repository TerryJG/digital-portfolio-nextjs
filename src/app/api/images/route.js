import { NextResponse } from 'next/server';
import connectDB from '../lib/connectDB';
import ImageDB from '../lib/models/imageSchema';

/**
 * @route GET /api/images
 * Get all non-archived images
 */
export async function GET() {
  try {
    await connectDB();
    const imageItems = await ImageDB.find({ isArchived: false }).sort({ "data-date": -1, _id: -1 });
    return NextResponse.json({
      isStatusOK: true,
      returnedCount: imageItems.length,
      contentData: imageItems,
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}