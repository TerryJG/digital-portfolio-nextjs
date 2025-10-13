import { useState, useEffect, useRef } from "react";
import { VideoMediaItemTypes, CategoryTypes } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { FaPlay } from "react-icons/fa6";
import { BsExclamationDiamond } from "react-icons/bs";
import { Fancybox } from "@fancyapps/ui";
import { fancyboxConfig } from "./fancybox.config";
import { getIconSrc } from "@/assets";
import Image from "next/image";

export const VideoItem = ({
  item,
  itemId,
  isVisible,
  dimensions,
  handleImageLoad,
}: {
  item: VideoMediaItemTypes;
  itemId: string;
  isVisible: boolean;
  dimensions?: { width: number; height: number };
  handleImageLoad: (itemId: string, img: HTMLImageElement) => void;
  categoryData?: CategoryTypes;
}) => {
  const [hovered, setHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const galleryType = item.dataFancybox || "video-gallery";

  useEffect(() => {
    if (containerRef) {
      Fancybox.bind(containerRef, "[data-fancybox]", fancyboxConfig.video);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        Fancybox.unbind(containerRef);
      };
    }
  }, [containerRef]);

  const handleMouseEnter = () => {
    if (!dimensions || !isVisible) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHovered(true);
    if (videoRef.current && !videoError) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    timeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }, 3000);
  };

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

  const videoItem = item as VideoMediaItemTypes;
  const videoUrl = videoItem.videoSrc?.replace("youtu.be/", "youtube.com/embed/");

  return (
    <div ref={setContainerRef as React.RefObject<HTMLDivElement> & ((instance: HTMLElement | null) => void)}>
      <a
        href={videoUrl}
        data-fancybox={galleryType}
        data-caption={addCaption()}
        className={`break-inside-avoid mb-8 relative group rounded-lg overflow-hidden block ${isVisible && dimensions ? "cursor-pointer" : ""}`}
        style={{ aspectRatio: "16/9" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        {/* Preload hidden image to grab its width and height dimensions */}
        <img id={itemId} className="hidden" src={item.imgSrc} alt={item.imgSrcAlt || item.title} onLoad={(e) => handleImageLoad(itemId, e.target as HTMLImageElement)} />
        {/* Skeleton */}
        <AnimatePresence>
          {dimensions && !isVisible && (
            <motion.div
              key="video-skeleton"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full">
              <Skeleton className="w-full h-full" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Thumbnail */}
        {dimensions && (
          <motion.img
            key="video-thumbnail"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible && !hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
            src={item.imgSrc}
            alt={item.imgSrcAlt || item.title}
          />
        )}
        {/* Video preview */}
        {dimensions &&
          isVisible &&
          (videoItem.videoPreview && !videoError ? (
            <motion.video
              key="video-preview"
              ref={videoRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
              src={videoItem.videoPreview}
              muted
              autoPlay
              loop
              playsInline
              onError={() => setVideoError(true)}
            />
          ) : (
            <motion.span
              key="video-fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center text-sm bg-neutral-800 rounded-lg shadow-lg text-white">
              <BsExclamationDiamond className="pe-1 size-6 text-amber-400" /> Failed to load video preview.
            </motion.span>
          ))}
        {/* Overlay */}
        {isVisible && dimensions && (
          <motion.div
            id="video-overlay-icon"
            className="absolute inset-0 flex items-start z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}>
            <div className="p-2 bg-neutral-800/80 rounded-br-md rounded-tl-lg flex gap-2">
              <FaPlay className="size-6 text-white" />
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
