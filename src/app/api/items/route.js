import { NextResponse } from 'next/server';
import connectDB from '../lib/connectDB';
import ImageDB from '../lib/models/imageSchema';
import VideoDB from '../lib/models/videoSchema';
import ProgrammingDB from '../lib/models/programmingSchema';

/**
 * @route /api/items OR /api/items?contentType=(image, video, programming)
 * Get all non-archived items from images, videos, and programming collections
 */
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    const filter = { isArchived: false };

    const [imageItems, videoItems, programmingItems] = await Promise.all([
      (!contentType || contentType === 'image') ? ImageDB.find(filter).sort({ "data-date": -1, _id: -1 }) : [],
      (!contentType || contentType === 'video') ? VideoDB.find(filter).sort({ "data-date": -1, _id: -1 }) : [],
      (!contentType || contentType === 'programming') ? ProgrammingDB.find(filter).sort({ "data-date": -1, _id: -1 }) : []
    ]);

    const allItems = [...imageItems, ...videoItems, ...programmingItems];

    // Sort combined items by data-date and _id
    allItems.sort((a, b) => {
      const dateA = new Date(a['data-date']);
      const dateB = new Date(b['data-date']);

      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }

      return b._id.toString().localeCompare(a._id.toString());
    });

    return NextResponse.json({
      isStatusOK: true,
      returnedCount: allItems.length,
      imagesReturnedCount: imageItems.length,
      videosReturnedCount: videoItems.length,
      programmingReturnedCount: programmingItems.length,
      contentData: allItems
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}