"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Divider } from "@/components/Divider";
import { featuredIcons } from "@/assets";
import Image from "next/image";
// import Link from "next/link";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import ProjectGallery from "@/components/ProjectGallery";

export default function LandingPage() {
  const [isProjectsInView, setIsProjectsInView] = useState(false);
  const pathname = usePathname();


  // When the component mounts...
  useEffect(() => {
    if (pathname === "/projects") {
      setIsProjectsInView(true); // Check if the user is on Nextjs /projects route
    }
  }, [pathname]);


  // If the user navigates using the back/next browser buttons instead of clicking on "Browse Projects"...
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname; // Check the current path using browser's pathname
      setIsProjectsInView(currentPath === "/projects");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);


  // When the "Browse Projects" button is clicked...
  const handleBrowseProjectsButton = () => {
    setIsProjectsInView(true);
    window.history.pushState({ page: "projects" }, "", "/projects");
  };

  const Name = () => {
    return <h1 className="text-xl sm:text-2xl font-bold"> Terrance Gibson</h1>;
  };

  const Overview = () => {
    return <p className="text-lg sm:text-xl">Video Editor. Graphic Designer. Web Developer.</p>;
  };

  const Address = () => {
    return (
      <address className="not-italic">
        <p className="text-md leading-5">Nassau, Bahamas</p>
        <a href="mailto:gibson.terrance.bs@gmail.com" className="text-md underline text-sky-600 hover:text-sky-700 transition-colors duration-200 break-all">
          gibson.terrance.b@gmail.com
        </a>
      </address>
    );
  };

  const FeaturedIcon = ({ icon, alt, className, twSize }: { icon: keyof typeof featuredIcons; alt?: string; className?: string; twSize?: string }) => {
    return <Image src={featuredIcons[icon]} alt={alt || icon} draggable={false} className={`${className} ${twSize ? twSize : "md:w-5 md:h-5 w-4 h-4"} inline align-text-top`} />;
  };

  const SkillsOverview = () => {
    return (
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
  };

  const NavButtons = () => {
    return (
      <div className="p-2 sm:p-4 rounded-md bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-600">
        <p className="text-md pb-2">My work focuses on creating unique digital experiences for clients using creative and technical software.</p>
        <span className="flex flex-wrap justify-center gap-2 pt-1">
          <Button className="text-sm" onClick={handleBrowseProjectsButton}>
            Browse Projects
            <FaExternalLinkSquareAlt />
          </Button>
          {/* <Button className="text-sm" asChild>
            <Link href="/resume">
              View Resume
              <FaExternalLinkSquareAlt />
            </Link>
          </Button> */}
        </span>
      </div>
    );
  };


  return (
    <section className="relative w-full min-h-screen font-primary overflow-hidden flex items-center justify-center">
      {/**
       * Project Gallery
       * This will always be in the background when the user visits the landing page.
       * If the user clicks on the "Browse Projects" button:
       * - The Landing page content will fade out and unmount
       * - The Project Gallery component will fade in and be interactive
       * The Project Gallery component has its own internal logic in the event that the user directly visits (domain.com)/projects
       */}
      <motion.div
        className="absolute inset-0 w-full h-full scroll scrollbar-custom"
        initial={false}
        animate={{
          opacity: isProjectsInView ? 1 : 0.35,
          filter: isProjectsInView ? "grayscale(0%) blur(0px)" : "grayscale(30%) blur(8px)",
          mixBlendMode: isProjectsInView ? "normal" : "soft-light",
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          opacity: { duration: 0.5 },
          filter: { duration: 0.3, delay: isProjectsInView ? 0.1 : 0 },
        }}>
        <ProjectGallery />
      </motion.div>


      {/**
       * Landing Page
       * Will fade either in and out depending on the isProjectsInView state
       */}
      <AnimatePresence mode="wait">
        {!isProjectsInView && (
          <>
            {/* Content */}
            <motion.div
              key="foreground-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
                delay: 0.1,
              }}
              className="relative z-10 flex flex-col items-center justify-center text-center md:max-w-4/5 lg:max-w-2/5 w-full px-2 sm:px-0">
              <Name />
              <Overview />
              <Divider margin spacing={0.25} />
              <Address />
              <Divider margin spacing={0.5} />
              <SkillsOverview />
              <Divider margin spacing={0.25} />
              <NavButtons />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
