import { ProjectItem } from "@/components/ProjectGallery/types";

export const manualProjectEntries: ProjectItem[] = [
  {
    _id: { $oid: "manual-entry-1" },
    dataFancybox: "image-gallery",
    contentType: "programming",
    itemType: "Code",
    category: "projects",
    categoryId: "projects",
    icons: ["html", "css", "javascript"],
    "data-date": "2030-01-01T00:00:00.000Z",
    isFeatured: true,
    isArchived: false,
    title: "Codepen Projects",
    subtitle: "Codepen",
    abbreviatedTitle: "Codepen",
    description: "Codepen Projects",
    details: [""],
    href: "https://codepen.io/TerryJG",
    imgSrc: "https://tjg-portfolio-db.vercel.app/miscellaneous/images/codepen-metaimg.webp",
    imgSrcAlt: "Codepen Projects",
    fallbackImgSrc: "",
  },
];