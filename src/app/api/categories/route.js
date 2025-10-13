import { NextResponse } from 'next/server';
import connectDB from '../lib/connectDB';
import Category from '../lib/models/categorySchema';

/**
 * @route GET /api/categories
 * Get all non-archived categories
 */
export async function GET() {
  try {
    await connectDB();
    const categoryItems = await Category.find(
      { isArchived: false }, 
    );
    return NextResponse.json({
      isStatusOK: true,
      returnedCount: categoryItems.length,
      categoryData: categoryItems,
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}