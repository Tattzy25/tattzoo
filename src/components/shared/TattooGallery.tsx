import { useState, useEffect } from 'react';
import { Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';

interface Design {
  id: string;
  title: string;
  image: string;
}

interface TattooGalleryProps {
  designs: Design[];
  displayCount: number;
  onLoadMore: () => void;
  hasMore: boolean;
  columns?: 2 | 3 | 4 | 5;
  title?: string;
}

export function TattooGallery({
  designs,
  displayCount,
  onLoadMore,
  hasMore,
  columns = 4,
  title,
}: TattooGalleryProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Load favorites from localStorage on mount
  useState(() => {
    const saved = localStorage.getItem('tattty_gallery_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  });

  const displayedDesigns = designs.slice(0, displayCount);

  const handleFavorite = (image: string, title: string) => {
    const isFavorited = favorites.includes(image);
    let newFavorites: string[];

    if (isFavorited) {
      newFavorites = favorites.filter(fav => fav !== image);
    } else {
      newFavorites = [...favorites, image];
    }

    setFavorites(newFavorites);
    localStorage.setItem('tattty_gallery_favorites', JSON.stringify(newFavorites));
  };

  // Navigate to previous image
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : displayedDesigns.length - 1;
    setCurrentImageIndex(newIndex);
    setLightboxImage(displayedDesigns[newIndex].image);
  };

  // Navigate to next image
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentImageIndex < displayedDesigns.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setLightboxImage(displayedDesigns[newIndex].image);
  };

  // Close lightbox
  const handleCloseLightbox = () => {
    setLightboxImage(null);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : displayedDesigns.length - 1;
        setCurrentImageIndex(newIndex);
        setLightboxImage(displayedDesigns[newIndex].image);
      } else if (e.key === 'ArrowRight') {
        const newIndex = currentImageIndex < displayedDesigns.length - 1 ? currentImageIndex + 1 : 0;
        setCurrentImageIndex(newIndex);
        setLightboxImage(displayedDesigns[newIndex].image);
      } else if (e.key === 'Escape') {
        handleCloseLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, currentImageIndex, displayedDesigns]);

  // Handle touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left = next image
      const newIndex = currentImageIndex < displayedDesigns.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      setLightboxImage(displayedDesigns[newIndex].image);
    }

    if (isRightSwipe) {
      // Swipe right = previous image
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : displayedDesigns.length - 1;
      setCurrentImageIndex(newIndex);
      setLightboxImage(displayedDesigns[newIndex].image);
    }
  };

  return (
    <div className="w-full space-y-6 pb-6">
      {/* Title */}
      {title && (
        <div className="w-full text-center mb-8" style={{ fontFamily: 'Rock Salt, cursive' }}>
          <div className="text-[40px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>GET</div>
          <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>INSPIRED</div>
        </div>
      )}
      
      {/* Gallery Grid */}
      <div className={`grid ${columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-2 md:grid-cols-3' : columns === 5 ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
        {displayedDesigns.map((design, index) => (
          <div
            key={design.id}
            className={`group relative aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all ${columns === 3 && index === displayedDesigns.length - 1 ? 'hidden md:block' : ''}`}
            style={{
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.9), 0 0 60px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Heart Icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFavorite(design.image, design.title);
              }}
              className="absolute top-2 right-2 z-10 p-2 rounded-full transition-all"
              style={{
                backgroundColor: favorites.includes(design.image) ? '#57f1d6' : 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Heart
                size={18}
                fill={favorites.includes(design.image) ? '#0C0C0D' : 'none'}
                style={{
                  color: favorites.includes(design.image) ? '#0C0C0D' : '#ffffff',
                }}
              />
            </button>

            {/* Image - Click to open lightbox */}
            <button 
              className="w-full h-full"
              onClick={() => {
                setCurrentImageIndex(index);
                setLightboxImage(design.image);
              }}
            >
              <ImageWithFallback
                src={design.image}
                alt={design.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-xs truncate w-full">{design.title}</span>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            className="px-8 py-4"
            style={{
              backgroundColor: '#57f1d6',
              color: '#0C0C0D',
            }}
          >
            Load More Designs ({displayCount} of {designs.length})
          </Button>
        </div>
      )}

      {/* No Results */}
      {designs.length === 0 && (
        <Card className="p-12 border-2 border-accent/20" style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
          borderRadius: '70px',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
        }}>
          <div className="text-center">
            <p className="text-muted-foreground">
              Oops! No designs found. Please try again with different keywords.
            </p>
          </div>
        </Card>
      )}

      {/* Enhanced Lightbox - Left Panel Only on Desktop */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 lg:right-[460px] z-[10001] bg-black/95 flex items-center justify-center group/lightbox"
          onClick={handleCloseLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 z-[10002] p-3 rounded-full transition-colors hover:bg-white/20"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <X size={24} style={{ color: '#ffffff' }} />
          </button>

          {/* Left Arrow */}
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[10002] p-2 md:p-3 rounded-full transition-all opacity-0 group-hover/lightbox:opacity-100 hover:bg-white/20"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <ChevronLeft size={28} className="md:w-8 md:h-8" style={{ color: '#ffffff' }} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[10002] p-2 md:p-3 rounded-full transition-all opacity-0 group-hover/lightbox:opacity-100 hover:bg-white/20"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <ChevronRight size={28} className="md:w-8 md:h-8" style={{ color: '#ffffff' }} />
          </button>

          {/* Image with Favorite Button */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage}
              alt="Gallery design"
              className="max-w-[95vw] max-h-[85vh] w-auto h-auto"
              style={{
                objectFit: 'contain',
              }}
            />
            
            {/* Favorite Button - Bottom Center */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <Button
                onClick={() => handleFavorite(lightboxImage, displayedDesigns[currentImageIndex]?.title || 'Gallery Design')}
                className="px-6 py-3 rounded-full"
                style={{
                  backgroundColor: favorites.includes(lightboxImage) ? '#57f1d6' : 'rgba(255, 255, 255, 0.15)',
                  color: favorites.includes(lightboxImage) ? '#0C0C0D' : '#ffffff',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Heart
                  size={18}
                  fill={favorites.includes(lightboxImage) ? '#0C0C0D' : 'none'}
                  className="mr-2"
                />
                {favorites.includes(lightboxImage) ? 'Saved' : 'Save to Favorites'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
