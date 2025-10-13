import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../lib/connectDB';
import ImageDB from '../../lib/models/imageSchema';

/**
 * @route GET /api/image/:id
 * Get single image by id
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

    const image = await ImageDB.findById(id);
    if (!image) {
      return NextResponse.json({
        isStatusOK: false,
        error: "Not Found",
        message: "Could not find image",
      }, { status: 404 });
    }

    return NextResponse.json({
      isStatusOK: true,
      contentData: image,
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}