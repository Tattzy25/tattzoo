import { useState, useEffect, useRef } from 'react';
import { Download, Bookmark, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { DiamondLoader } from './DiamondLoader';
import { shareContent, placeholders } from '../../data/content';

interface ResultsCardProps {
  // Core functionality
  designs?: string[];
  isGenerating?: boolean;
  
  // Customization options
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'square';
  maxWidth?: string;
  showTitle?: boolean;
  title?: string;
  className?: string;
  
  // Icon controls
  showIcons?: boolean;
  iconSize?: number;
  
  // Custom handlers (optional overrides)
  onDownload?: () => void;
  onSaveToFavorites?: () => void;
  onShareSocial?: () => void;
  onGenerate?: () => void;
  onNavigate?: (page: string) => void;
  
  // Post-generation editing options (EditPanel removed - kept for backward compatibility)
  showEditOptions?: boolean;
  onEditAction?: (action: string) => void | Promise<void>;
  onVariationsRequest?: (count: number) => void;
  onOpenEditor?: () => void;
}

export const ResultsCard = ({
  designs = [], 
  isGenerating = false,
  aspectRatio = '16/9',
  maxWidth = 'full',
  showTitle = true,
  title = 'Results card',
  className = '',
  showIcons = true,
  iconSize = 28,
  onDownload,
  onSaveToFavorites,
  onShareSocial,
  onGenerate,
  onNavigate,
  showEditOptions = true,
  onEditAction,
  onVariationsRequest,
  onOpenEditor,
}: ResultsCardProps) => {
  const hasGenerated = designs.length > 0 && !isGenerating;
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  
  // Current image derived from state
  const currentImage = hasGenerated ? designs[currentImageIndex] : null;

  // Reset index when designs change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [designs]);

  // Map aspect ratio to Tailwind class
  const aspectRatioMap = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    'square': 'aspect-square',
  };

  const aspectClass = aspectRatioMap[aspectRatio];
  const maxWidthClass = `max-w-${maxWidth}`;

  // Default handlers
  const handleDownload = onDownload || (async () => {
    if (!currentImage) return;
    
    try {
      // Fetch the image with no-cors mode to bypass CORS restrictions
      const response = await fetch(currentImage, { mode: 'cors' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tattty-design-${Date.now()}.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Downloaded tattoo design!');
    } catch (error) {
      // CORS blocked or fetch failed - try direct download attribute
      console.log('Fetch failed, trying direct download link...');
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `tattty-design-${Date.now()}.png`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    }
  });

  const handleSaveToFavorites = onSaveToFavorites || (() => {
    console.log('Saved to your favorites!');
  });

  const handleShareSocial = onShareSocial || (() => {
    if (!currentImage) return;
    
    // Check if Web Share API is available
    if (!navigator.share) {
      console.error('Web Share API not supported on this browser');
      return;
    }

    // Fetch and share - wrapped to preserve user gesture
    (async () => {
      try {
        const response = await fetch(currentImage);
        const blob = await response.blob();
        const file = new File([blob], 'tattty-design.png', { type: blob.type });
        
        const shareData = {
          text: shareContent.defaultText,
          files: [file],
        };
        
        // Share with native share sheet
        await navigator.share(shareData);
        console.log('Shared successfully!');
      } catch (err) {
        const error = err as Error;
        
        // User cancelled the share - this is expected behavior
        if (error.name === 'AbortError') {
          console.log('Share cancelled by user');
          return;
        }
        
        // Any other error - log it
        console.error('Share failed:', error);
      }
    })();
  });

  // Navigate to previous image
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : designs.length - 1));
  };

  // Navigate to next image
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < designs.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!hasGenerated || designs.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasGenerated, currentImageIndex, designs.length]);

  // Touch/swipe handling for mobile
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
      handleNextImage();
    }

    if (isRightSwipe) {
      handlePrevImage();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Loading State - Diamond Animation */}
      {isGenerating ? (
        <div className={`w-full ${aspectClass} ${maxWidthClass} mx-auto rounded-3xl overflow-hidden border-2 border-accent/20 relative flex items-center justify-center bg-background/50`}>
          <DiamondLoader 
            size={120}
            scale={1}
          />
        </div>
      ) : hasGenerated && currentImage ? (
        /* Generated Image with Actions */
        <div 
          className={`w-full ${aspectClass} ${maxWidthClass} mx-auto relative group`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-accent hover:border-accent/80 transition-all">
            <ImageWithFallback
              src={currentImage}
              alt="Generated tattoo design"
              className="w-full h-full object-cover object-center"
            />

            {/* Action Buttons Overlay - Desktop (hover) / Mobile (always visible) */}
            {showIcons && (
              <div className="absolute top-4 right-4 z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    {/* Download Button - Separate */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleDownload}
                          className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-white/10 transition-colors"
                          aria-label="Download"
                        >
                          <Download size={20} className="text-white" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Download</TooltipContent>
                    </Tooltip>

                    {/* Share Button - Separate */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleShareSocial}
                          className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-white/10 transition-colors"
                          aria-label="Share"
                        >
                          <Share2 size={20} className="text-white" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Share</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            )}

            {/* Navigation Arrows - Only show if multiple images */}
            {designs.length > 1 && (
              <>
                {/* Left Arrow - Desktop only (hover) */}
                <button
                  onClick={handlePrevImage}
                  className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 hover:bg-white/20"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} className="md:w-8 md:h-8" style={{ color: '#ffffff' }} />
                </button>

                {/* Right Arrow - Desktop only (hover) */}
                <button
                  onClick={handleNextImage}
                  className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 hover:bg-white/20"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={28} className="md:w-8 md:h-8" style={{ color: '#ffffff' }} />
                </button>

                {/* Image Counter - Bottom center */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                  {currentImageIndex + 1} / {designs.length}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Empty State - Placeholder */
        <div className={`w-full ${aspectClass} ${maxWidthClass} mx-auto rounded-3xl overflow-hidden border-2 border-border/30 relative flex items-center justify-center`}>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1640202430303-a71359ade259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXR0b28lMjBzbGVldmUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjIxNDQ1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Tattoo placeholder"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/30 flex items-center justify-center">
            <p className="text-white text-center px-8 whitespace-pre-line tracking-wide">
              {placeholders.resultsPlaceholder}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
