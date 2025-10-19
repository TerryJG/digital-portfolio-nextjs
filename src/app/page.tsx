"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Divider } from "@/components/Divider";
import { featuredIcons } from "@/assets";
import Image from "next/image";
// import Link from "next/link";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectGalleryMenu from "@/components/ProjectGallery/ProjectGalleryMenu";
import { ProjectItem, CategoryTypes } from "@/components/ProjectGallery/types";

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showGallery, setShowGallery] = useState(false);
  const [allItems, setAllItems] = useState<ProjectItem[]>([]);
  const [categories, setCategories] = useState<Map<string, CategoryTypes>>(new Map());

  // When the component mounts...
  useEffect(() => {
    const view = searchParams.get("view");
    setShowGallery(view === "gallery");
  }, [searchParams]);

  // Load data for menubar...
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((res) => res.json()),
      fetch("/api/items").then((res) => res.json()),
    ])
      .then(([categoriesResponse, itemsResponse]) => {
        const categoryMap = new Map<string, CategoryTypes>();
        (categoriesResponse?.categoryData || []).forEach((c: CategoryTypes) => {
          if (c?._id) categoryMap.set(c._id, c);
        });
        setCategories(categoryMap);
        setAllItems(itemsResponse?.contentData || []);
      })
      .catch((err) => console.error("Error loading data for menu:", err));
  }, []);


  const handleBrowseProjects = () => {
    router.push("/?view=gallery");
  };


  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => (value ? params.set(key, value) : params.delete(key)));
    router.push(`/?${params.toString()}`);
  };


  const Name = () => <h1 className="text-xl sm:text-2xl font-bold">Terrance Gibson</h1>;
  const Overview = () => <p className="text-lg sm:text-xl">Video Editor. Graphic Designer. Web Developer.</p>;


  const Address = () => (
    <address className="not-italic">
      <p className="text-md leading-5">Nassau, Bahamas</p>
      <a href="mailto:gibson.terrance.bs@gmail.com" className="text-md underline text-sky-600 hover:text-sky-700 transition-colors duration-200 break-all">
        gibson.terrance.b@gmail.com
      </a>
    </address>
  );


  const FeaturedIcon = ({ icon, alt, className, twSize }: { icon: keyof typeof featuredIcons; alt?: string; className?: string; twSize?: string }) => (
    <Image src={featuredIcons[icon]} alt={alt || icon} draggable={false} className={`${className} ${twSize || "md:w-5 md:h-5 w-4 h-4"} inline align-text-top`} />
  );


  const SkillsOverview = () => (
    <div className="[&_p]:leading-6">
      <p className="text-md">
        Experienced in using Adobe Creative Suite including: <FeaturedIcon icon="adobePremiere" alt="Adobe Premiere Pro" /> Adobe Premiere Pro,{" "}
        <FeaturedIcon icon="adobeAfterEffects" alt="Adobe After Effects" /> Adobe After Effects, and <FeaturedIcon icon="adobePhotoshop" alt="Adobe Photoshop" /> Adobe Photoshop.
      </p>
      <Divider margin spacing={0.5} />
      <p className="text-md">
        Proficient hands-on experience with <FeaturedIcon icon="windows" alt="Windows" /> Windows and <FeaturedIcon icon="linux" alt="Linux" /> Linux, with technical knowledge of
        web technologies such as{" "}
        <span className="dark:hidden">
          <FeaturedIcon icon="html" alt="HTML" />
        </span>
        <span className="hidden dark:inline">
          <FeaturedIcon icon="htmlDark" alt="HTML" />
        </span>{" "}
        HTML,{" "}
        <span className="dark:hidden">
          <FeaturedIcon icon="css" alt="CSS" />
        </span>
        <span className="hidden dark:inline">
          <FeaturedIcon icon="cssDark" alt="CSS" />
        </span>{" "}
        CSS, <FeaturedIcon icon="javascript" alt="Javascript" /> Javascript, and <FeaturedIcon icon="react" alt="React" /> React.
      </p>
    </div>
  );


  const NavButtons = () => (
    <div className="p-2 sm:p-4 rounded-md bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-600">
      <p className="text-md pb-2">My work focuses on creating unique digital experiences for clients using creative and technical software.</p>
      <span className="flex flex-wrap justify-center gap-2 pt-1">
        <Button className="text-sm" onClick={handleBrowseProjects}>
          Browse Projects
          <FaExternalLinkSquareAlt />
        </Button>
      </span>
    </div>
  );


  return (
    <section className="relative w-full min-h-screen font-primary overflow-hidden">
      {/**
       * Project Gallery
       * This will always be in the background when the user visits the landing page.
       * If the user clicks on the "Browse Projects" button:
       * - The Landing page content will fade out and unmount
       * - The Project Gallery component will fade in and be interactive
       * The Project Gallery component has its own internal logic in the event that the user directly visits (domain.com)/projects
       */}
      <motion.div
        className="fixed inset-0 w-full h-full overflow-y-auto scrollbar-custom"
        initial={false}
        animate={{
          opacity: showGallery ? 1 : 0.35,
          filter: showGallery ? "grayscale(0%) blur(0px)" : "grayscale(30%) blur(8px)",
          mixBlendMode: showGallery ? "normal" : "soft-light",
          pointerEvents: showGallery ? "auto" : "none",
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          opacity: { duration: 0.5 },
          filter: { duration: 0.3, delay: showGallery ? 0.1 : 0 },
        }}>
        <ProjectGallery />
      </motion.div>


      {/**
       * Landing Page
       * Will fade either in and out depending on the isProjectsInView state
       */}
      <AnimatePresence mode="wait">
        {!showGallery && (
          <motion.div
            key="foreground-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
            className="relative z-10 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center md:max-w-4/5 lg:max-w-2/5 w-full px-2 sm:px-0">
              <Name />
              <Overview />
              <Divider margin spacing={0.25} />
              <Address />
              <Divider margin spacing={0.5} />
              <SkillsOverview />
              <Divider margin spacing={0.25} />
              <NavButtons />
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showGallery && allItems.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200, duration: 0.6 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[1440px] max-w-[80%]">
            <ProjectGalleryMenu
              allItems={allItems}
              categories={categories}
              onCategorySelect={(slug) => updateParams({ category: slug || null, contentType: null })}
              onContentTypeSelect={(type) => updateParams({ category: null, contentType: type || null })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}