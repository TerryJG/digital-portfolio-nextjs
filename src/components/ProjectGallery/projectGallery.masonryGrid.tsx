import { ProjectItem, CategoryTypes, VideoMediaItemTypes, ProgrammingItemTypes } from "./types";
import { ImageItem } from "./item.image";
import { VideoItem } from "./item.video";
import { ProgrammingItem } from "./item.programming";
import Masonry from "react-masonry-css";

type MasonryGridProps = {
  items: ProjectItem[];
  revealedImages: Set<string>;
  imageDimensions: Map<string, { width: number; height: number }>;
  handleImageLoad: (id: string, img: HTMLImageElement) => void;
  categories: Map<string, CategoryTypes>;
};

export function MasonryGrid({ items, revealedImages, imageDimensions, handleImageLoad, categories }: MasonryGridProps) {
  return (
    <Masonry breakpointCols={{ default: 3, 1280: 3, 1024: 2, 640: 1 }} className="flex w-auto -ml-6 flex-grow" columnClassName="pl-6 bg-clip-padding">
      {items.map((item, index) => {
        const itemId = typeof item._id === "string" ? item._id : item._id.$oid;
        const isVisible = revealedImages.has(itemId);
        const dimensions = imageDimensions.get(itemId);
        const categoryData = categories.get(item.categoryId ?? "");

        if (item.contentType === "image") {
          return (
            <div key={`image-${itemId}-${index}`}>
              <ImageItem item={item} itemId={itemId} isVisible={isVisible} dimensions={dimensions} handleImageLoad={handleImageLoad} categoryData={categoryData} />
            </div>
          );
        }

        if (item.contentType === "video") {
          return (
            <div key={`video-${itemId}-${index}`}>
              <VideoItem
                item={item as VideoMediaItemTypes}
                itemId={itemId}
                isVisible={isVisible}
                dimensions={dimensions}
                handleImageLoad={handleImageLoad}
                categoryData={categoryData}
              />
            </div>
          );
        }

        if (item.contentType === "programming") {
          return (
            <div key={`programming-${itemId}-${index}`}>
              <ProgrammingItem
                item={item as ProgrammingItemTypes}
                itemId={itemId}
                isVisible={isVisible}
                dimensions={dimensions}
                handleImageLoad={handleImageLoad}
                categoryData={categoryData}
              />
            </div>
          );
        }

        return null;
      })}
    </Masonry>
  );
}
