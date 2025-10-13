import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../lib/connectDB';
import ProgrammingDB from '../../lib/models/programmingSchema';

/**
 * @route /api/programming/[id]
 * Get single programming item by id
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        isStatusOK: false,
        error: "Invalid ID",
        message: "Not a valid ID",
      }, { status: 404 });
    }

    const programmingItem = await ProgrammingDB.findById(id);

    if (!programmingItem) {
      return NextResponse.json({
        isStatusOK: false,
        error: "Not Found",
        message: "Could not find web project",
      }, { status: 404 });
    }

    return NextResponse.json({
      isStatusOK: true,
      contentData: programmingItem,
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}