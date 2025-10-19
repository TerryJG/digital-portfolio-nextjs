"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { AnimatePresence } from "motion/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ProjectItem, CategoryTypes, VideoMediaItemTypes, ProgrammingItemTypes } from "./types";
import { ItemCategoryHeader } from "./projectGallery.categoryHeader";
import { IoRefreshCircleOutline as RefreshIcon } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { manualProjectEntries } from "@/app/constants/manualEntries";
import { ImageItem } from "./item.image";
import { VideoItem } from "./item.video";
import { ProgrammingItem } from "./item.programming";

type IsotopeInstance = {
  arrange: (options: { filter: string; transitionDuration: string }) => void;
  layout: () => void;
  destroy: () => void;
};

type IsotopeConstructor = new (element: HTMLElement, options: Record<string, unknown>) => IsotopeInstance;

function ProjectGalleryContent() {
  const [allItems, setAllItems] = useState<ProjectItem[]>([]);
  const [categories, setCategories] = useState<Map<string, CategoryTypes>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealedImages, setRevealedImages] = useState<Set<string>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<Map<string, { width: number; height: number }>>(new Map());
  const [isotopeReady, setIsotopeReady] = useState(false);
  const [Isotope, setIsotope] = useState<IsotopeConstructor | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isotopeRef = useRef<IsotopeInstance | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categorySlug = searchParams.get("category");
  const contentType = searchParams.get("contentType");
  const categoryData = categorySlug ? Array.from(categories.values()).find((cat) => cat.slug === categorySlug) : null;


  // Stops Next.js from throwing a 'window not defined' error
  useEffect(() => {
    import("isotope-layout").then((IsotopeModule) => {
      setIsotope(() => IsotopeModule.default as unknown as IsotopeConstructor);
    });
  }, []);


  useEffect(() => {
    if (categoryData) {
      document.title = `${categoryData.abbreviatedTitle} - Projects | Digital Portfolio`;
    } 
    
    else if (contentType) {
      const titles = { video: "Video Editing", image: "Graphic Design", programming: "Programming" };
      document.title = `${titles[contentType as keyof typeof titles] || "Projects"} - Projects | Digital Portfolio`;
    } 
    
    else {
      document.title = "Projects | Digital Portfolio";
    }
  }, [categoryData, contentType]);


  useEffect(() => {
    Promise.all([fetch("/api/categories").then((res) => res.json()), fetch("/api/items").then((res) => res.json())])
      .then(([categoriesResponse, itemsResponse]) => {
        const categoryMap = new Map<string, CategoryTypes>();
        (categoriesResponse?.categoryData || []).forEach((c: CategoryTypes) => {
          if (c?._id) categoryMap.set(c._id, c);
        });
        setCategories(categoryMap);
        setAllItems([...manualProjectEntries, ...(itemsResponse?.contentData || [])]);
        setLoading(false);
      })

      .catch((err) => {
        console.error("Error loading data:", err);
        setError(`Unable to load data: ${err}`);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (gridRef.current && allItems.length > 0 && !loading && Isotope) {
      if (isotopeRef.current) {
        isotopeRef.current.destroy();
      }

      setTimeout(() => {
        if (gridRef.current && Isotope) {
          isotopeRef.current = new Isotope(gridRef.current, {
            itemSelector: ".isotope-item",
            percentPosition: true,
            masonry: {
              columnWidth: ".isotope-sizer",
            },
            hiddenStyle: {
              opacity: 0,
            },
            visibleStyle: {
              opacity: 1,
            },
          });
          setIsotopeReady(true);
        }
      }, 50);
    }

    return () => {
      if (isotopeRef.current) {
        isotopeRef.current.destroy();
        isotopeRef.current = null;
      }
      setIsotopeReady(false);
    };
  }, [allItems, loading, Isotope]);


  useEffect(() => {
    if (isotopeRef.current && isotopeReady) {
      let filterValue = "*";

      if (categorySlug && contentType) {
        filterValue = `.category-${categorySlug}.content-${contentType}`;
      } else if (categorySlug) {
        filterValue = `.category-${categorySlug}`;
      } else if (contentType) {
        filterValue = `.content-${contentType}`;
      }

      isotopeRef.current.arrange({
        filter: filterValue,
        transitionDuration: "0.4s",
      });
    }
  }, [categorySlug, contentType, isotopeReady]);


  const handleImageLoad = (itemId: string, img: HTMLImageElement) => {
    setImageDimensions((prev) => new Map(prev).set(itemId, { width: img.naturalWidth, height: img.naturalHeight }));
    setTimeout(() => {
      setRevealedImages((prev) => new Set(prev).add(itemId));
      if (isotopeRef.current) isotopeRef.current.layout();
    }, 100);
  };


  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => (value ? params.set(key, value) : params.delete(key)));
    router.push(`${pathname}?${params.toString()}`);
  };


  if (loading || !Isotope) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader text="Loading gallery..." />
      </div>
    );
  }


  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-400 p-2 flex flex-col gap-2 sm:p-4 max-w-md bg-neutral-300/70 dark:bg-neutral-700/70 rounded-md shadow-md border border-neutral-600/10">
          <p>Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="rounded-sm">
            <span className="flex items-center gap-1">
              <RefreshIcon className="size-4" /> Retry
            </span>
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="px-20 pb-20 pt-10 min-h-screen flex flex-col relative">
      <AnimatePresence mode="wait">
        {categorySlug && categoryData && <ItemCategoryHeader key={categorySlug} category={categoryData} onBack={() => updateParams({ category: null, contentType: null })} />}
      </AnimatePresence>

      <div ref={gridRef} className="w-full pb-24" style={{ opacity: isotopeReady ? 1 : 0, transition: "opacity 0.3s" }}>
        <div className="isotope-sizer w-full sm:w-1/2 lg:w-1/3"></div>
        {allItems.map((item, index) => {
          const itemId = typeof item._id === "string" ? item._id : item._id.$oid;
          const isVisible = revealedImages.has(itemId);
          const dimensions = imageDimensions.get(itemId);
          const itemCategoryData = categories.get(item.categoryId ?? "");
          const itemCategorySlug = itemCategoryData?.slug || "";
          const classes = `isotope-item category-${itemCategorySlug} content-${item.contentType} w-full sm:w-1/2 lg:w-1/3 p-3`;

          if (item.contentType === "image") {
            return (
              <div key={`image-${itemId}-${index}`} className={classes}>
                <ImageItem item={item} itemId={itemId} isVisible={isVisible} dimensions={dimensions} handleImageLoad={handleImageLoad} categoryData={itemCategoryData} />
              </div>
            );
          }

          if (item.contentType === "video") {
            return (
              <div key={`video-${itemId}-${index}`} className={classes}>
                <VideoItem
                  item={item as VideoMediaItemTypes}
                  itemId={itemId}
                  isVisible={isVisible}
                  dimensions={dimensions}
                  handleImageLoad={handleImageLoad}
                  categoryData={itemCategoryData}
                />
              </div>
            );
          }

          if (item.contentType === "programming") {
            return (
              <div key={`programming-${itemId}-${index}`} className={classes}>
                <ProgrammingItem
                  item={item as ProgrammingItemTypes}
                  itemId={itemId}
                  isVisible={isVisible}
                  dimensions={dimensions}
                  handleImageLoad={handleImageLoad}
                  categoryData={itemCategoryData}
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}


export default function ProjectGallery() {
  return (
    <Suspense fallback={<Loader text="Loading gallery..." />}>
      <ProjectGalleryContent />
    </Suspense>
  );
}