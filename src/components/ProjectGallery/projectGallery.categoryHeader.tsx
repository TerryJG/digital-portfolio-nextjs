import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CategoryTypes } from "./types";
import Image from "next/image";

export function ItemCategoryHeader({ category, onBack }: { category: CategoryTypes; onBack: () => void }) {
  return (
    <motion.div key={`category-${category._id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <section className="w-full h-full text-center">
        <header className="flex flex-col items-center gap-6 mb-6">
          <Image
            draggable={false}
            onContextMenu={(e) => e.stopPropagation()}
            src={category.imgSrc || category.fallbackImgSrc}
            alt={`${category.title} Banner`}
            className="h-40 w-auto mx-auto"
            width={160}
            height={160}
          />
          <span>
            <p className="max-w-[70%] mx-auto text-slate-600">{category.description}</p>
          </span>
        </header>
      </section>

      {/* Back Button */}
      <div className="mb-6 text-center">
        <Button onClick={onBack} variant="outline" className="mb-4 bg-gray-100 hover:bg-gray-100/70 text-neutral-600 hover:text-neutral-600/80">
          ← Back to All Projects
        </Button>
      </div>
    </motion.div>
  );
}
