import { NextResponse } from 'next/server';
import connectDB from '../../lib/models/imageSchema';
import ImageDB from '../../lib/connectDB';

/**
 * @route GET /api/image/featured
 * Get all featured, non-archived images
 */
export async function GET() {
  try {
    await connectDB();
    const imageItems = await ImageDB.find({ isArchived: false, isFeatured: true }).sort({ "data-date": -1, _id: -1 });
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