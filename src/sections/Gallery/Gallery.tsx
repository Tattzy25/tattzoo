import { useState } from 'react';
import { Button } from '../../components/ui/button';
import GalleryOverlay from '../../components/shared/GalleryOverlay';
import { galleryDesigns, sectionHeadings } from '../../data';
import ImageGallery from '../../components/creative-tim/blocks/product-listing-filters-01';

export function Gallery() {
  const [isGalleryOverlayOpen, setIsGalleryOverlayOpen] = useState(false);
  const allGalleryDesigns = galleryDesigns;

  return (
    <>
      <div className="w-full px-1.5 md:px-2.5 space-y-12 md:space-y-16">
        <div className="text-center space-y-4">
          <h2 
            className="text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white"
            style={{ 
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', 
              letterSpacing: '4px' 
            }}
          >
            {sectionHeadings.liveTheMagic.title}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-[24px] font-[Roboto_Condensed]">
            {sectionHeadings.liveTheMagic.description}
          </p>
        </div>
        
        <ImageGallery
          showFilters={false}
          products={allGalleryDesigns.slice(0, 15).map(d => ({
            id: d.id,
            image: d.image,
            name: d.title,
            brand: 'TaTTTy',
            badge: null,
            metadata: {}
          }))}
          columnsClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        />
        
        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => setIsGalleryOverlayOpen(true)}
            className="px-8 py-6 text-lg"
            style={{
              backgroundColor: '#57f1d6',
              color: '#0C0C0D',
              borderRadius: '12px',
              boxShadow: '0 0 30px rgba(87, 241, 214, 0.4)',
            }}
          >
            View All Designs
          </Button>
        </div>
      </div>
      
      {/* Full Screen Gallery Overlay - Rendered at root level to cover everything */}
        <GalleryOverlay
          isOpen={isGalleryOverlayOpen}
          onClose={() => setIsGalleryOverlayOpen(false)}
        />
    </>
  );
}
