import { NextResponse } from 'next/server';
import connectDB from '../../lib/connectDB';
import ImageDB from '../../lib/models/imageSchema';
import VideoDB from '../../lib/models/videoSchema';
import ProgrammingDB from '../../lib/models/programmingSchema';
import Category from '../../lib/models/categorySchema';

/**
 * @route /api/items/[slug] OR...
 *        /api/items/serene-saver (returns all items, regardless of contentType, along with its category information)
 *        /api/items/serene-saver?contentType=video (returns all items that matches the specified contentType, along with its category information)
 *        /api/items/serene-saver?itemType=Motion Graphics (returns all items that matches the specified itemType, along with its category information)
 *        /api/items/serene-saver?contentType=video&itemType=Motion Graphics (returns all items that matches the specified contentType and itemType, along with its category information)
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    const itemType = searchParams.get('itemType');

    const category = await Category.findOne({ slug, isArchived: false }); // Find category by slug
    
    if (!category) {
      return NextResponse.json({
        isStatusOK: false,
        error: "Not Found",
        message: "Category not found",
      }, { status: 404 });
    }

    // Build filter with category and optional itemType
    const filter = { category: slug, isArchived: false };
    if (itemType) {
      filter.itemType = itemType;
    }
    
    const [imageItems, videoItems, programmingItems] = await Promise.all([
      (!contentType || contentType === 'image') ? ImageDB.find(filter).sort({ "data-date": -1, _id: -1 }) : [],
      (!contentType || contentType === 'video') ? VideoDB.find(filter).sort({ "data-date": -1, _id: -1 }) : [],
      (!contentType || contentType === 'programming') ? ProgrammingDB.find(filter).sort({ "data-date": -1, _id: -1 }) : []
    ]);

    const items = [...imageItems, ...videoItems, ...programmingItems];

    // Sort combined items by data-date and _id
    items.sort((a, b) => {
      const dateA = new Date(a['data-date']);
      const dateB = new Date(b['data-date']);

      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }

      return b._id.toString().localeCompare(a._id.toString());
    });

    return NextResponse.json({
      isStatusOK: true,
      returnedCount: items.length,
      imagesReturnedCount: imageItems.length,
      videosReturnedCount: videoItems.length,
      programmingReturnedCount: programmingItems.length,
      categoryData: {
        _id: category._id,
        title: category.title,
        abbreviatedTitle: category.abbreviatedTitle,
        slug: category.slug,
        primaryColor: category.primaryColor,
        accentColor: category.accentColor,
        description: category.description,
        imgSrc: category.imgSrc,
        fallbackImgSrc: category.fallbackImgSrc,
        lastUpdated: category.lastUpdated
      },
      contentData: items
    });
  } catch (error) {
    return NextResponse.json({
      isStatusOK: false,
      error: "Server error",
      message: error.message,
    }, { status: 500 });
  }
}