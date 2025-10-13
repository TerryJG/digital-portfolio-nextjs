import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../lib/connectDB';
import Category from '../../lib/models/categorySchema';

/**
 * @route /api/categories/:id
 * Get single category item by id
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    let category;
    
    // Try to find by ObjectId first, then by slug
    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id);
    } else {
      // Treat it as a slug
      category = await Category.findOne({ slug: id, isArchived: false });
    }
    
    if (!category) {
      return NextResponse.json({
        isStatusOK: false,
        error: "Not Found",
        message: "Could not find category",
      }, { status: 404 });
    }
    
    return NextResponse.json({
      isStatusOK: true,
      categoryData: category,
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}