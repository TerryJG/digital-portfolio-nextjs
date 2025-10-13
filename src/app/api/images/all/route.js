import { NextResponse } from 'next/server';
import connectDB from '../../lib/connectDB';
import ImageDB from '../../lib/models/imageSchema';

/**
 * @route GET /api/images/all
 * Get all images regardless of archived status
 */
export async function GET() {
  try {
    await connectDB();
    const imageItems = await ImageDB.find({}).sort({ "data-date": -1, _id: -1 });
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