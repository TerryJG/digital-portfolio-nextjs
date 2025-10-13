"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ProjectItem, CategoryTypes } from "./types";
import { ItemCategoryHeader } from "./projectGallery.categoryHeader";
import { MasonryGrid } from "./projectGallery.masonryGrid";
import ProjectGalleryMenu from "./ProjectGalleryMenu";
import { IoRefreshCircleOutline as RefreshIcon } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { manualProjectEntries } from "@/app/constants/manualEntries";

function ProjectGalleryContent() {
  const [allItems, setAllItems] = useState<ProjectItem[]>([]);
  const [displayItems, setDisplayItems] = useState<ProjectItem[]>([]);
  const [categories, setCategories] = useState<Map<string, CategoryTypes>>(new Map());
  const [selectedCategoryData, setSelectedCategoryData] = useState<CategoryTypes | null>(null);
  const [displayCategoryData, setDisplayCategoryData] = useState<CategoryTypes | null>(null);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [revealedImages, setRevealedImages] = useState<Set<string>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<Map<string, { width: number; height: number }>>(new Map());
  const [previousCategorySlug, setPreviousCategorySlug] = useState<string | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const loaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedCategorySlug = searchParams.get("category");
  const selectedContentType = searchParams.get("contentType");

  useEffect(() => {
    if (selectedCategoryData) {
      document.title = `${selectedCategoryData.abbreviatedTitle} - Projects | Digital Portfolio`;
    } else if (selectedContentType) {
      const contentTypeTitle =
        selectedContentType === "video" ? "Video Editing" : selectedContentType === "image" ? "Graphic Design" : selectedContentType === "programming" ? "Programming" : "Projects";
      document.title = `${contentTypeTitle} - Projects | Digital Portfolio`;
    } else {
      document.title = "Projects | Digital Portfolio";
    }
  }, [selectedCategoryData, selectedContentType]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((categoriesResponse) => {
        const categoriesData = categoriesResponse?.categoryData || [];
        const categoryMap = new Map<string, CategoryTypes>();
        categoriesData.forEach((c: CategoryTypes) => {
          if (c?._id) {
            categoryMap.set(c._id, c);
          }
        });
        setCategories(categoryMap);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  useEffect(() => {
    if (isFilterLoading) {
      loaderTimeoutRef.current = setTimeout(() => {
        setShowLoader(true);
      }, 400);
    } else {
      if (loaderTimeoutRef.current) {
        clearTimeout(loaderTimeoutRef.current);
      }
      setShowLoader(false);
    }

    return () => {
      if (loaderTimeoutRef.current) {
        clearTimeout(loaderTimeoutRef.current);
      }
    };
  }, [isFilterLoading]);

  // Load items based on filters
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);

        const categoryChanged = selectedCategorySlug !== previousCategorySlug;

        if (categoryChanged) {
          setContentOpacity(0);
          await new Promise((resolve) => setTimeout(resolve, 300));

          setIsFilterLoading(true);

          if (selectedCategorySlug) {
            const categoryFromMap = Array.from(categories.values()).find((cat) => cat.slug === selectedCategorySlug);
            if (categoryFromMap) {
              setSelectedCategoryData(categoryFromMap);
            }
          } else {
            setSelectedCategoryData(null);
          }
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        let itemsUrl = "/api/items";
        if (selectedCategorySlug) {
          itemsUrl = `/api/items/${selectedCategorySlug}`;

          const itemsResponse = await fetch(itemsUrl).then((res) => res.json());

          if (!itemsResponse.isStatusOK) {
            throw new Error(itemsResponse.message || "Failed to load items");
          }

          const fetchedItems = itemsResponse?.contentData || [];

          // Filter manual entries by categoryId matching the selected category
          const filteredManualEntries = manualProjectEntries.filter((entry) => entry.categoryId === itemsResponse.categoryData?._id);

          setAllItems([...filteredManualEntries, ...fetchedItems]);

          if (itemsResponse?.categoryData) {
            setSelectedCategoryData(itemsResponse.categoryData);
          }

          setPreviousCategorySlug(selectedCategorySlug);

          if ((itemsResponse?.contentData || []).length === 0 && filteredManualEntries.length === 0) {
            setError("No data found.");
          }
        } else {
          // Load all items
          const allItemsResponse = await fetch("/api/items").then((res) => res.json());
          const fetchedItems = allItemsResponse?.contentData || [];

          // Load all manual entries when no category is selected
          setAllItems([...manualProjectEntries, ...fetchedItems]);

          setSelectedCategoryData(null);
          setPreviousCategorySlug(null);
        }

        if (categoryChanged) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(`Unable to load data: ${err}`);
      } finally {
        setIsFilterLoading(false);

        setTimeout(() => {
          setContentOpacity(1);
        }, 100);
      }
    };
    loadData();
  }, [selectedCategorySlug, selectedContentType, categories, previousCategorySlug]);

  useEffect(() => {
    if (!isFilterLoading) {
      setDisplayItems(allItems);
      setDisplayCategoryData(selectedCategoryData);
    }
  }, [isFilterLoading, allItems, selectedCategoryData]);

  const filteredItems = selectedContentType ? displayItems.filter((item) => item.contentType === selectedContentType) : displayItems;

  const handleImageLoad = (itemId: string, img: HTMLImageElement) => {
    setImageDimensions((prev) => new Map(prev).set(itemId, { width: img.naturalWidth, height: img.naturalHeight }));
    setTimeout(() => setRevealedImages((prev) => new Set(prev).add(itemId)), 500);
  };

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => (value ? params.set(key, value) : params.delete(key)));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategorySelect = (categorySlug: string) => updateParams({ category: categorySlug || null, contentType: null });
  const handleContentTypeSelect = (contentType: string) => updateParams({ category: null, contentType: contentType || null });
  const handleBackToAll = () => updateParams({ category: null, contentType: null });

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

  const loadingTitle =
    selectedCategoryData?.abbreviatedTitle ||
    (selectedContentType === "video" ? "Video" : selectedContentType === "image" ? "Image" : selectedContentType === "programming" ? "Programming" : "");
  const accentColor = selectedCategoryData?.accentColor || "#99a1af";

  return (
    <div className="px-20 pb-20 pt-10 min-h-screen flex flex-col relative">
      {/* Wrap content in motion.div with opacity control */}
      <motion.div animate={{ opacity: contentOpacity }} transition={{ duration: 0.3 }}>
        <AnimatePresence mode="wait">
          {selectedCategorySlug && displayCategoryData && <ItemCategoryHeader key={selectedCategorySlug} category={displayCategoryData} onBack={handleBackToAll} />}
        </AnimatePresence>

        <MasonryGrid items={filteredItems} revealedImages={revealedImages} imageDimensions={imageDimensions} handleImageLoad={handleImageLoad} categories={categories} />
      </motion.div>

      {/* Loading overlay with blur - shows only when switching categories */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-md bg-neutral-300/60">
            <Loader
              className="p-2 bg-neutral-300/60 rounded-md border border-neutral-700/15"
              textClassName="text-neutral-500"
              spinnerStyles={{ borderColor: accentColor }}
              text={`Loading ${loadingTitle} items...`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pathname === "/projects" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200, duration: 0.6 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto w-[1440px] max-w-[80%]">
            <ProjectGalleryMenu allItems={allItems} categories={categories} onCategorySelect={handleCategorySelect} onContentTypeSelect={handleContentTypeSelect} />
          </motion.div>
        )}
      </AnimatePresence>
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
