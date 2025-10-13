import { ProjectItem } from "@/components/ProjectGallery/types";

export function ItemMatchesFilter(item: ProjectItem, categoryId: string | null, contentType: string | null) {
  if (categoryId && item.categoryId !== categoryId) return false;
  if (!contentType) return true;

  const type = item.itemType?.toLowerCase() || "";
  switch (contentType) {
    case "video":
      return item.contentType === "video" || type.includes("video");
    case "image":
      return item.contentType === "image" || type.includes("graphic") || type.includes("design");
    case "programming":
      return item.contentType === "programming" || type.includes("programming") || type.includes("code") || type.includes("web") || type.includes("website") || type.includes("application");
    default:
      return item.contentType === contentType;
  }
}