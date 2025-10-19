"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ProjectItem, CategoryTypes } from "./types";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { FaGlobe, FaPlay, FaImage, FaPalette, FaVideo, FaCode } from "react-icons/fa6";
import { IconType } from "react-icons";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import ProjectGalleryInfoModal from "./projectGallery.infoModal";

type CategoryGroup = {
  id: string;
  slug: string;
  title: string;
  items: ProjectItem[];
};

type DefaultCategory = {
  key: string;
  label: string;
  icon: IconType;
  contentTypes: string[];
  itemTypeIcons?: Record<string, IconType>;
  iconPriority?: IconType[];
};

const DEFAULT_CATEGORIES: DefaultCategory[] = [
  {
    key: "images",
    label: "Images",
    icon: FaImage,
    contentTypes: ["image"],
  },
  {
    key: "videos",
    label: "Videos",
    icon: FaPlay,
    contentTypes: ["video"],
  },
  {
    key: "programming",
    label: "Programming",
    icon: FaCode,
    contentTypes: ["programming"],
    itemTypeIcons: {
      Website: FaGlobe,
      "Web Application": FaGlobe,
      Code: FaCode,
      Other: FaCode,
    },
    iconPriority: [FaGlobe, FaCode],
  },
];


function matchesDefaultCategory(item: ProjectItem, defaultCategory: DefaultCategory): boolean {
  return defaultCategory.contentTypes.includes(item.contentType || "");
}


function determineDefaultCategories(items: ProjectItem[]) {
  const result: Record<string, boolean> = {};
  DEFAULT_CATEGORIES.forEach((defaultCategory) => {
    result[defaultCategory.key] = items.some((item) => matchesDefaultCategory(item, defaultCategory));
  });
  return result;
}


function getPrimaryCategoryIcon(items: ProjectItem[], defaultCategoryKey: string): IconType {
  const defaultCategory = DEFAULT_CATEGORIES.find((dc) => dc.key === defaultCategoryKey);
  if (!defaultCategory) return FaCode;

  const uniqueIcons = new Set<IconType>();
  items
    .filter((item) => matchesDefaultCategory(item, defaultCategory))
    .forEach((item) => {
      if (item.itemType && defaultCategory.itemTypeIcons) {
        const itemTypeLower = item.itemType.toLowerCase();
        for (const [key, icon] of Object.entries(defaultCategory.itemTypeIcons)) {
          if (key.toLowerCase() === itemTypeLower) {
            uniqueIcons.add(icon);
            break;
          }
        }
      }
    });

  if (defaultCategory.iconPriority) {
    for (const priorityIcon of defaultCategory.iconPriority) {
      if (uniqueIcons.has(priorityIcon)) {
        return priorityIcon;
      }
    }
  }

  return defaultCategory.icon;
}


function DefaultCategoryIcons({ categories, items }: { categories: Record<string, boolean>; items: ProjectItem[] }) {
  return (
    <span className="flex items-center gap-1 pr-1 flex-shrink-0">
      {DEFAULT_CATEGORIES.map((dc) => {
        if (!categories[dc.key]) return null;
        const Icon = getPrimaryCategoryIcon(items, dc.key);
        return <Icon key={dc.key} className="size-3" />;
      })}
    </span>
  );
}


function getIconForItemType(itemType: string, defaultCategory: DefaultCategory): IconType {
  if (!defaultCategory.itemTypeIcons) return defaultCategory.icon;
  const itemTypeLower = itemType.toLowerCase();
  for (const [key, icon] of Object.entries(defaultCategory.itemTypeIcons)) {
    if (key.toLowerCase() === itemTypeLower) {
      return icon;
    }
  }
  return defaultCategory.icon;
}


function getUniqueItemTypes(items: ProjectItem[], defaultCategoryKey: string): Array<{ type: string; icon: IconType }> {
  const defaultCategory = DEFAULT_CATEGORIES.find((dc) => dc.key === defaultCategoryKey);
  if (!defaultCategory) return [];

  const uniqueTypes = Array.from(
    new Set(
      items
        .filter((item) => matchesDefaultCategory(item, defaultCategory))
        .map((item) => item.itemType)
        .filter(Boolean)
    )
  ) as string[];

  return uniqueTypes.map((type) => ({
    type,
    icon: getIconForItemType(type, defaultCategory),
  }));
}


function renderCategoryMenuItems(
  categories: Record<string, boolean>,
  items: ProjectItem[],
  onCategoryAndContentSelect: (categorySlug: string, contentType: string) => void,
  categorySlug: string
) {
  const contentTypeMap: Record<string, string> = {
    images: "image",
    videos: "video",
    programming: "programming",
  };

  return DEFAULT_CATEGORIES.map((dc) => {
    if (!categories[dc.key]) return null;

    if (dc.key === "programming") {
      const itemTypes = getUniqueItemTypes(items, dc.key);
      if (itemTypes.length > 0) {
        return itemTypes.map(({ type, icon: Icon }) => (
          <MenubarItem key={type} onClick={() => onCategoryAndContentSelect(categorySlug, "programming")}>
            <Icon className="size-3 mr-2" />
            {type}
          </MenubarItem>
        ));
      }
    }

    return (
      <MenubarItem key={dc.key} onClick={() => onCategoryAndContentSelect(categorySlug, contentTypeMap[dc.key])}>
        <dc.icon className="size-3 mr-2" />
        {dc.label}
      </MenubarItem>
    );
  });
}


function ProjectMenu({
  category,
  onCategorySelect,
  onCategoryAndContentSelect,
}: {
  category: CategoryGroup;
  onCategorySelect: (categorySlug: string) => void;
  onCategoryAndContentSelect: (categorySlug: string, contentType: string) => void;
}) {
  const categories = determineDefaultCategories(category.items);
  return (
    <MenubarMenu>
      <MenubarTrigger className="flex items-center min-w-0">
        <DefaultCategoryIcons categories={categories} items={category.items} />
        <span className="truncate" title={category.title}>
          {category.title}
        </span>
      </MenubarTrigger>
      <MenubarContent>
        {renderCategoryMenuItems(categories, category.items, onCategoryAndContentSelect, category.slug)}
        <MenubarSeparator />
        <MenubarItem onClick={() => onCategorySelect(category.slug)}>
          View all items
          <MenubarShortcut>
            <DefaultCategoryIcons categories={categories} items={category.items} />
          </MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}


function MoreMenu({
  projectCategories,
  availableCategories,
  onCategorySelect,
  onCategoryAndContentSelect,
  allItemsForMenu,
}: {
  projectCategories: CategoryGroup[];
  availableCategories: Record<string, boolean>;
  onCategorySelect: (categorySlug: string) => void;
  onCategoryAndContentSelect: (categorySlug: string, contentType: string) => void;
  allItemsForMenu: ProjectItem[];
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger className="flex-shrink-0">More...</MenubarTrigger>
      <MenubarContent>
        {projectCategories.map((category) => {
          const categories = determineDefaultCategories(category.items);
          return (
            <MenubarSub key={category.id}>
              <MenubarSubTrigger className="flex items-center">
                <DefaultCategoryIcons categories={categories} items={category.items} />
                <span title={category.title}>{category.title}</span>
              </MenubarSubTrigger>
              <MenubarSubContent>
                {renderCategoryMenuItems(categories, category.items, onCategoryAndContentSelect, category.slug)}
                <MenubarSeparator />
                <MenubarItem onClick={() => onCategorySelect(category.slug)}>
                  View all items
                  <MenubarShortcut>
                    <DefaultCategoryIcons categories={categories} items={category.items} />
                  </MenubarShortcut>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          );
        })}
        <MenubarSeparator />
        <MenubarItem onClick={() => onCategorySelect("")}>
          View all items
          <MenubarShortcut>
            <DefaultCategoryIcons categories={availableCategories} items={allItemsForMenu} />
          </MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}


export default function ProjectGalleryMenu({
  categories,
  onCategorySelect,
  onContentTypeSelect,
}: {
  allItems: ProjectItem[];
  categories: Map<string, CategoryTypes>;
  onCategorySelect: (categorySlug: string) => void;
  onContentTypeSelect: (contentType: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [projectCategories, setProjectCategories] = useState<CategoryGroup[]>([]);
  const [allItemsForMenu, setAllItemsForMenu] = useState<ProjectItem[]>([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const isGalleryView = searchParams.get("view") === "gallery";

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((response) => {
        const items = response?.contentData || [];
        setAllItemsForMenu(items);
      })
      .catch((err) => console.error("Error loading items for menu:", err));
  }, []);

  useEffect(() => {
    if (allItemsForMenu.length === 0) return setProjectCategories([]);

    const categoryItemsMap = new Map<string, ProjectItem[]>();
    allItemsForMenu.forEach((item) => {
      if (item.categoryId) {
        if (!categoryItemsMap.has(item.categoryId)) categoryItemsMap.set(item.categoryId, []);
        categoryItemsMap.get(item.categoryId)!.push(item);
      }
    });

    const projects: CategoryGroup[] = [];
    categories.forEach((cat, id) => {
      const items = categoryItemsMap.get(id) || [];
      if (items.length > 0) {
        projects.push({
          id,
          slug: cat.slug,
          title: cat.abbreviatedTitle || "Unknown Category",
          items,
        });
      }
    });

    projects.sort((a, b) => {
      const dateA = new Date(categories.get(a.id)?.lastUpdated || "1970-01-01");
      const dateB = new Date(categories.get(b.id)?.lastUpdated || "1970-01-01");
      return dateB.getTime() - dateA.getTime();
    });

    setProjectCategories(projects);
  }, [allItemsForMenu, categories]);

  const handleCategoryAndContentSelect = (categorySlug: string, contentType: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", categorySlug);
    params.set("contentType", contentType);
    router.push(`${pathname}?${params.toString()}`);
  };

  const availableCategories = determineDefaultCategories(allItemsForMenu);

  return (
    <>
      <Menubar className="shadow-lg rounded-lg w-full">
        <div className="flex items-center justify-center gap-1 w-full overflow-x-auto">
          <MenubarMenu>
            <MenubarTrigger className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap" onClick={() => setIsInfoModalOpen(true)}>
              <FaInfoCircle />
            </MenubarTrigger>
          </MenubarMenu>
          {isGalleryView && (
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap" onClick={() => router.push("/")}>
                <FaHome className="size-3" /> Home
              </MenubarTrigger>
            </MenubarMenu>
          )}
          <MenubarMenu>
            <MenubarTrigger className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap" onClick={() => onContentTypeSelect("video")}>
              <FaVideo className="size-3" /> Video Editing
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap" onClick={() => onContentTypeSelect("image")}>
              <FaPalette className="size-3" /> Graphic Design
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap" onClick={() => onContentTypeSelect("programming")}>
              <FaCode className="size-3" /> Programming
            </MenubarTrigger>
          </MenubarMenu>
          {projectCategories.length > 0 && <span className="hidden lg:inline-block flex-shrink-0 mx-2">•</span>}
          {projectCategories.length > 0 && (
            <div className="hidden lg:block">
              <ProjectMenu category={projectCategories[0]} onCategorySelect={onCategorySelect} onCategoryAndContentSelect={handleCategoryAndContentSelect} />
            </div>
          )}
          {projectCategories.length > 1 && (
            <div className="hidden xl:block">
              <ProjectMenu category={projectCategories[1]} onCategorySelect={onCategorySelect} onCategoryAndContentSelect={handleCategoryAndContentSelect} />
            </div>
          )}
          {projectCategories.length > 2 && (
            <div className="hidden 2xl:block">
              <ProjectMenu category={projectCategories[2]} onCategorySelect={onCategorySelect} onCategoryAndContentSelect={handleCategoryAndContentSelect} />
            </div>
          )}
          {projectCategories.length > 0 && (
            <MoreMenu
              projectCategories={projectCategories.slice(0)}
              availableCategories={availableCategories}
              onCategorySelect={onCategorySelect}
              onCategoryAndContentSelect={handleCategoryAndContentSelect}
              allItemsForMenu={allItemsForMenu}
            />
          )}
        </div>
      </Menubar>

      <ProjectGalleryInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </>
  );
}
