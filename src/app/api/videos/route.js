import { NextResponse } from 'next/server';
import connectDB from '../lib/connectDB';
import VideoDB from '../lib/models/videoSchema';

/**
 * @route /api/videos
 * Get all non-archived videos
 */
export async function GET() {
  try {
    await connectDB();
    const videoItems = await VideoDB.find({ isArchived: false }).sort({ "data-date": -1, _id: -1 });
    return NextResponse.json({
      isStatusOK: true,
      returnedCount: videoItems.length,
      contentData: videoItems,
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}