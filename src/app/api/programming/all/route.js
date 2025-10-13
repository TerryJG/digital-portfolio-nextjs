import { NextResponse } from 'next/server';
import connectDB from '../../lib/connectDB';
import ProgrammingDB from '../../lib/models/programmingSchema';

/**
 * @route GET /api/programming/all
 * Get all programming items regardless of archived status
 */
export async function GET() {
  try {
    await connectDB();
    const programmingItems = await ProgrammingDB.find({}).sort({ "data-date": -1, _id: -1 });
    return NextResponse.json({
      isStatusOK: true,
      returnedCount: programmingItems.length,
      contentData: programmingItems,
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}