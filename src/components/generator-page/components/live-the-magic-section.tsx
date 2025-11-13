import React, { useState } from 'react';
import { sectionHeadings } from '../../../data/content';
import styles from '../../GeneratorPage.module.css';
import ButtonDemo from '../../button-07';
import { GridBento } from '../../systaliko-ui/blocks/grid-bento';
import { X } from 'lucide-react';

export interface ImageGalleryProps {
  galleryDesigns: any[];
  onViewAll: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  galleryDesigns,
  onViewAll
}) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  return (
    <div className="mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
      <div className="w-full px-1.5 md:px-2.5 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2
            className={"text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white " + styles.titleShadow}
          >
            {sectionHeadings.liveTheMagic.title}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-[Roboto_Condensed] px-2">
            {sectionHeadings.liveTheMagic.description}
          </p>
        </div>

        {/* Gallery grid: Mobile-first responsive - stacks vertically on mobile, 2 columns on tablet+ */}
        <div className="space-y-2 w-full">
          {/* Row 1: Stacks vertically on mobile, side by side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <GridBento variant="fourCells" className="h-screen py-2 px-2 flex-1 place-content-center place-items-center">
                {galleryDesigns.slice(0, 4).map((design, index) => (
                <div key={index} className="overflow-hidden size-full rounded-xl shadow-xl bg-card cursor-pointer" onClick={() => setLightboxImage(design.image)}>
                    <img className="size-full object-cover" src={design.image} alt={design.title} />
                  </div>
                ))}
            </GridBento>
            <GridBento variant="fourCells" className="h-screen py-2 px-2 flex-1 place-content-center place-items-center">
                {galleryDesigns.slice(4, 8).map((design, index) => (
                <div key={index + 4} className="overflow-hidden size-full rounded-xl shadow-xl bg-card cursor-pointer" onClick={() => setLightboxImage(design.image)}>
                    <img className="size-full object-cover" src={design.image} alt={design.title} />
                  </div>
                ))}
            </GridBento>
          </div>
          
          {/* Row 2: Stacks vertically on mobile, side by side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <GridBento variant="fourCells" className="h-screen py-2 px-2 flex-1 place-content-center place-items-center">
                {galleryDesigns.slice(8, 12).map((design, index) => (
                <div key={index + 8} className="overflow-hidden size-full rounded-xl shadow-xl bg-card cursor-pointer" onClick={() => setLightboxImage(design.image)}>
                    <img className="size-full object-cover" src={design.image} alt={design.title} />
                  </div>
                ))}
            </GridBento>
            <GridBento variant="fourCells" className="h-screen py-2 px-2 flex-1 place-content-center place-items-center">
                {galleryDesigns.slice(12, 16).map((design, index) => (
                <div key={index + 12} className="overflow-hidden size-full rounded-xl shadow-xl bg-card cursor-pointer" onClick={() => setLightboxImage(design.image)}>
                    <img className="size-full object-cover" src={design.image} alt={design.title} />
                  </div>
                ))}
            </GridBento>
          </div>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
          <div onClick={onViewAll}>
            <ButtonDemo />
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="fixed top-4 right-4 z-60 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-colors"
            aria-label="Close image"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-full max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage}
              alt="Fullscreen view"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;