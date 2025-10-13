import { useState, useEffect } from "react";
import { CategoryTypes, ProjectItem } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { FaImage } from "react-icons/fa6";
import { BsExclamationDiamond } from "react-icons/bs";
import { Fancybox } from "@fancyapps/ui";
import { fancyboxConfig } from "./fancybox.config";
import { getIconSrc } from "@/assets/";
import Image from "next/image";

type ImageItemProps = {
  item: ProjectItem;
  itemId: string;
  isVisible: boolean;
  dimensions?: { width: number; height: number };
  handleImageLoad: (itemId: string, img: HTMLImageElement) => void;
  categoryData?: CategoryTypes;
};

export const ImageItem = ({ item, itemId, isVisible, dimensions, handleImageLoad }: ImageItemProps) => {
  const [imgError, setImgError] = useState(false);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const galleryType = item.dataFancybox || "image-gallery";

  useEffect(() => {
    if (containerRef) {
      Fancybox.bind(containerRef, "[data-fancybox]", fancyboxConfig.image);
      return () => {
        Fancybox.unbind(containerRef);
      };
    }
  }, [containerRef]);

  // If the img src is missing...
  if (!item.imgSrc || imgError) {
    return (
      <div className="relative bg-neutral-100 rounded-lg shadow-lg text-center p-6 min-h-[200px] flex flex-col justify-center break-inside-avoid mb-8">
        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
        <p className="text-neutral-600 text-sm">{item.description}</p>
        <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex text-sm items-center justify-center select-none rounded-lg text-neutral-800/30">
          <BsExclamationDiamond className="pe-1 size-6" /> Failed to load image
        </span>
        <div className="absolute inset-0 flex items-start z-10 pointer-events-none">
          <div className="p-2 bg-neutral-800/60 rounded-br-md rounded-tl-lg backdrop-blur-md">
            <FaImage className="size-6 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // Fancybox does not accept JSX; only string templates. This is the best workaround
  const addCaption = () => {
    const parts = [];

    if (item.icons && item.icons.length > 0) {
      const iconsHtml = item.icons
        .map((icon) => {
          const iconSrc = getIconSrc(icon);
          return iconSrc ? `<img src="${iconSrc}" alt="${icon}" class="inline w-5 h-5 align-text-top" />` : "";
        })
        .filter(Boolean)
        .join(" ");

      parts.push(`<p class="text-sm opacity-75">${item.itemType}${iconsHtml ? " • " + iconsHtml : ""}</p>`);
    }

    if (item.title) {
      parts.push(`<strong class="text-xl">${item.title}</strong>`);
    }

    if (item.description) {
      parts.push(`<p class="text-md -mt-1">${item.description}</p>`);
    }

    return parts.join("");
  };

  return (
    <div ref={setContainerRef as React.RefObject<HTMLDivElement> & ((instance: HTMLElement | null) => void)}>
      <a
        href={item.imgSrc}
        data-fancybox={galleryType}
        data-caption={addCaption()}
        className="break-inside-avoid mb-8 relative block cursor-pointer rounded-lg overflow-hidden"
        style={{ aspectRatio: dimensions ? `${dimensions.width}/${dimensions.height}` : "16/9" }}>
        {/* Preload hidden image to grab the image's width and height dimensions */}
        <img
          id={itemId}
          className="hidden"
          src={item.imgSrc}
          alt={item.imgSrcAlt || item.title}
          onLoad={(e) => handleImageLoad(itemId, e.target as HTMLImageElement)}
          onError={() => setImgError(true)}
        />
        {/* Skeleton */}
        <AnimatePresence>
          {dimensions && !isVisible && (
            <motion.div
              key="image-skeleton"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full">
              <Skeleton className="w-full h-full" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Rendered image */}
        {dimensions && (
          <motion.img
            key="image-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
            src={item.imgSrc}
            alt={item.imgSrcAlt || item.title}
            onError={() => setImgError(true)}
          />
        )}
        {/* Overlay */}
        {isVisible && dimensions && (
          <motion.div
            id="image-overlay-icon"
            className="absolute inset-0 flex items-start z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="p-2 bg-neutral-800/80 rounded-br-md rounded-tl-lg flex gap-2">
              <FaImage className="size-6 text-white" />
              {item.icons && item.icons.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {item.icons.map((icon, index) => {
                    const iconSrc = getIconSrc(icon);
                    return iconSrc ? <Image key={index} src={iconSrc} alt={icon} width={24} height={24} className="w-6 h-6" /> : null;
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </a>
    </div>
  );
};
