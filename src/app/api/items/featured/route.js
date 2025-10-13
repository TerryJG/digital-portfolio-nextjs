import { NextResponse } from 'next/server';
import connectDB from '../../lib/connectDB';
import ImageDB from '../../lib/models/imageSchema';
import VideoDB from '../../lib/models/videoSchema';
import ProgrammingDB from '../../lib/models/programmingSchema';

/**
 * @route GET /api/items/featured
 * Get all featured, non-archived items from images, videos, and programming collections
 */
export async function GET() {
  try {
    await connectDB();

    const [imageItems, videoItems, programmingItems] = await Promise.all([
      ImageDB.find({ isArchived: false, isFeatured: true }).sort({ "data-date": -1, _id: -1 }),
      VideoDB.find({ isArchived: false, isFeatured: true }).sort({ "data-date": -1, _id: -1 }),
      ProgrammingDB.find({ isArchived: false, isFeatured: true }).sort({ "data-date": -1, _id: -1 })
    ]);

    const allFeaturedItems = [...imageItems, ...videoItems, ...programmingItems]; // Combine all items

    // Sort combined items by data-date and _id
    allFeaturedItems.sort((a, b) => {
      const dateA = new Date(a['data-date']);
      const dateB = new Date(b['data-date']);

      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }

      return b._id.toString().localeCompare(a._id.toString()); // If dates are equal, sort by _id descending
    });

    return NextResponse.json({
      isStatusOK: true,
      returnedCount: allFeaturedItems.length,
      imagesReturnedCount: imageItems.length,
      videosReturnedCount: videoItems.length,
      programmingReturnedCount: programmingItems.length,
      contentData: allFeaturedItems
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}