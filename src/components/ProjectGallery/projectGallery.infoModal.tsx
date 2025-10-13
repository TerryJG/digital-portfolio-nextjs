"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { icons } from "@/assets";
import Image from "next/image";

export default function ProjectGalleryInfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-neutral-700/70 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-800/70 border-none [&>button]:text-white">
          <DialogTitle className="hidden">Project Icon Legend</DialogTitle>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(icons).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <Image src={config.src.src} alt={config.displayName} width={32} height={32} className="w-8 h-8" />
                  <span className="text-xs text-slate-300">{config.displayName}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
