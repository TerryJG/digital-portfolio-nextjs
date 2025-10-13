export type CategoryTypes = {
  _id: string;
  title: string;
  abbreviatedTitle: string;
  slug: string;
  primaryColor: string;
  accentColor: string;
  description: string;
  imgSrc: string;
  fallbackImgSrc: string;
  lastUpdated: string;
  isArchived: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BaseItemTypes = {
  _id: { $oid: string };
  dataFancybox: string;
  contentType: "image" | "video" | "programming";
  itemType: string;
  category: string;
  categoryId?: string;
  icons: string[];
  "data-date": string;
  isFeatured: boolean;
  isArchived: boolean;
  title: string;
  subtitle: string;
  abbreviatedTitle: string;
  description: string;
  details: string[];
  imgSrc: string;
  imgSrcAlt: string;
  fallbackImgSrc: string;
};

export type ImageMediaItemTypes = BaseItemTypes & {};

export type VideoMediaItemTypes = BaseItemTypes & {
  videoPreview: string;
  videoSrc: string;
  fallbackVideoSrc: string;
};

export type ProgrammingItemTypes = BaseItemTypes & {
  href: string;
};

export type ProjectItem = ImageMediaItemTypes | VideoMediaItemTypes | ProgrammingItemTypes;