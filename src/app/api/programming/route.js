import { NextResponse } from 'next/server';
import connectDB from '../lib/connectDB';
import ProgrammingDB from '../lib/models/programmingSchema';

/**
 * @route /api/programming
 * Get all non-archived programming items
 */
export async function GET() {
  try {
    await connectDB();
    const programmingItems = await ProgrammingDB.find({ isArchived: false }).sort({ "data-date": -1, _id: -1 });
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