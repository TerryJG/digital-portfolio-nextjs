import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../lib/connectDB';
import VideoDB from '../../lib/models/videoSchema';

/**
 * @route /api/videos/[id]
 * Get single video item by id
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

    const video = await VideoDB.findById(id);
    if (!video) {
      return NextResponse.json({
        isStatusOK: false,
        error: "Not Found",
        message: "Could not find video",
      }, { status: 404 });
    }

    return NextResponse.json({
      isStatusOK: true,
      contentData: video,
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}