"use client";
import ProjectGallery from "@/components/ProjectGallery";

export default function ProjectsPage() {
  return (
    <section className="fixed inset-0 w-screen h-screen overflow-hidden bg-neutral-200 dark:bg-neutral-800">
      <div className="w-full h-full scroll scrollbar-custom">
        <ProjectGallery />
      </div>
    </section>
  );
}