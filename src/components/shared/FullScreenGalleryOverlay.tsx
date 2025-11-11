import { useState, useEffect, useRef } from 'react';
import { X, Search, Heart, ChevronDown, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent } from '../ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

type FilterType = 'trending' | 'popular' | 'style' | 'color' | 'size' | 'vibe' | 'gender' | 'top10';

interface Design {
  id: string;
  title: string;
  image: string;
}

interface FullScreenGalleryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  designs: Design[];
}

export function FullScreenGalleryOverlay({
  isOpen,
  onClose,
  designs,
}: FullScreenGalleryOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(20);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Image aspect ratio detection
  const [imageOrientation, setImageOrientation] = useState<'portrait' | 'landscape' | null>(null);

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Extended filter options with realistic data
  const filterOptions = {
    trending: ['This Week', 'This Month', 'All Time'],
    popular: ['Most Liked', 'Most Saved', 'Most Shared', 'Editor\'s Pick'],
    style: [
      'Traditional', 'Realism', 'Watercolor', 'Minimalist', 'Geometric', 'Japanese',
      'Neo-Traditional', 'Tribal', 'Blackwork', 'Dotwork', 'Sketch', 'Abstract',
      'Portrait', 'Fine Line', 'Lettering', 'Ornamental', 'Celtic', 'Maori',
      'Biomechanical', 'New School', 'Trash Polka', 'Surrealism', 'Illustrative',
      'Chicano', 'Irezumi', 'Mandala', 'Sacred Geometry', 'Floral', 'Animal',
      'Skull', 'Religious', 'Nautical', 'Horror', 'Fantasy', 'Sci-Fi',
      'Pin-Up', 'American Traditional', 'Stick and Poke', 'Hand Poke', 'UV/Glow',
      'Cover-Up', 'Scar Cover', 'White Ink', 'Negative Space', 'Microrealism',
      '3D', 'Optical Illusion', 'Glitch', 'Gradient', 'Brush Stroke',
      'Comic Book', 'Anime/Manga', 'Pixel Art', 'Sticker Style', 'Graffiti',
      'Polynesian', 'Nordic', 'Egyptian', 'Aztec', 'Mayan', 'Native American',
      'Chinese', 'Korean', 'Thai', 'Indian', 'Persian', 'Art Nouveau',
      'Art Deco', 'Retro', 'Vintage', 'Modern', 'Contemporary',
    ],
    color: ['Black & Grey', 'Full Color', 'Blackwork', 'Single Color', 'Two-Tone', 'Pastel', 'Neon', 'Earth Tones'],
    size: ['Tiny (< 2")', 'Small (2-4")', 'Medium (4-8")', 'Large (8-12")', 'Extra Large (12"+)', 'Full Sleeve', 'Half Sleeve', 'Quarter Sleeve', 'Full Back', 'Half Back'],
    vibe: ['Dark', 'Bright', 'Weird', 'Classic', 'Edgy', 'Elegant', 'Playful', 'Serious', 'Mystical', 'Bold', 'Delicate', 'Aggressive'],
    gender: ['For Him', 'For Her', 'Unisex', 'Masculine', 'Feminine', 'Androgynous'],
    top10: ['Top 10 Overall', 'Top 10 This Week', 'Top 10 Animals', 'Top 10 Flowers', 'Top 10 Symbols', 'Top 10 Portraits', 'Top 10 Sleeves', 'Top 10 Small', 'Top 10 Color', 'Top 10 Black & Grey'],
  };

  const handleToggleFilter = (category: FilterType, value: string) => {
    setActiveFilters(prev => {
      const currentValues = prev[category];
      const isSelected = currentValues.includes(value);
      
      return {
        ...prev,
        [category]: isSelected 
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setStyleSearchQuery('');
    setActiveFilters({
      trending: [],
      popular: [],
      style: [],
      color: [],
      size: [],
      vibe: [],
      gender: [],
      top10: [],
    });
  };
  
  // Filter style options based on mini search
  const filteredStyleOptions = filterOptions.style.filter(style =>
    style.toLowerCase().includes(styleSearchQuery.toLowerCase())
  );

  const handleFavorite = (image: string, title: string) => {
    setFavorites(prev => 
      prev.includes(image) 
        ? prev.filter(fav => fav !== image)
        : [...prev, image]
    );
  };

  // Detect image orientation when loaded
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setImageOrientation(aspectRatio > 1 ? 'landscape' : 'portrait');
  };

  // Reset orientation when closing lightbox
  const handleCloseLightbox = () => {
    setLightboxImage(null);
    setImageOrientation(null);
  };

  // Filter designs based on search query
  const filteredDesigns = designs.filter(design => {
    const matchesSearch = searchQuery === '' || 
      design.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Navigate to previous image
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredDesigns.length - 1;
    setCurrentImageIndex(newIndex);
    setLightboxImage(filteredDesigns[newIndex].image);
    setImageOrientation(null);
  };

  // Navigate to next image
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentImageIndex < filteredDesigns.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setLightboxImage(filteredDesigns[newIndex].image);
    setImageOrientation(null);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredDesigns.length - 1;
        setCurrentImageIndex(newIndex);
        setLightboxImage(filteredDesigns[newIndex].image);
        setImageOrientation(null);
      } else if (e.key === 'ArrowRight') {
        const newIndex = currentImageIndex < filteredDesigns.length - 1 ? currentImageIndex + 1 : 0;
        setCurrentImageIndex(newIndex);
        setLightboxImage(filteredDesigns[newIndex].image);
        setImageOrientation(null);
      } else if (e.key === 'Escape') {
        handleCloseLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, currentImageIndex, filteredDesigns]);

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
      const newIndex = currentImageIndex < filteredDesigns.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      setLightboxImage(filteredDesigns[newIndex].image);
      setImageOrientation(null);
    }

    if (isRightSwipe) {
      // Swipe right = previous image
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredDesigns.length - 1;
      setCurrentImageIndex(newIndex);
      setLightboxImage(filteredDesigns[newIndex].image);
      setImageOrientation(null);
    }
  };

  const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0) || searchQuery.length > 0;

  // Infinite scroll
  useEffect(() => {
    if (!isOpen) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < filteredDesigns.length) {
          setDisplayCount(prev => Math.min(prev + 20, filteredDesigns.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isOpen, displayCount, filteredDesigns.length]);

  // Lock body scroll and hide overflow when overlay is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[9999] bg-[#0C0C0D]"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        {/* Sticky Header - Desktop Only */}
        <div className="hidden md:block sticky top-0 left-0 right-0 z-[10000] border-b border-white/10" style={{ backgroundColor: 'rgba(12, 12, 13, 0.95)' }}>
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl text-white" style={{ fontFamily: 'Orbitron' }}>
              COMMUNITY GALLERY
            </h2>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-white/20 transition-colors"
              style={{
                backgroundColor: '#57f1d6',
              }}
            >
              <X size={28} style={{ color: '#0C0C0D' }} />
            </button>
          </div>
        </div>

        {/* Mobile Close Button - Top Right */}
        <button
          onClick={onClose}
          className="md:hidden fixed top-4 right-4 z-[10000] p-3 rounded-full hover:bg-white/20 transition-colors"
          style={{
            backgroundColor: '#57f1d6',
          }}
        >
          <X size={24} style={{ color: '#0C0C0D' }} />
        </button>

        <div className="h-full flex flex-col pt-16 md:pt-20">
          {/* LEFT SIDEBAR - Filters */}
          <div 
            className={`
              fixed md:static inset-y-0 left-0 w-full md:w-80 
              border-r border-white/10 overflow-y-auto p-4 md:p-6 space-y-4
              transition-transform duration-300 ease-in-out z-[9998]
              ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
            style={{
              backgroundColor: 'rgba(12, 12, 13, 0.98)',
              paddingTop: '24px',
              marginTop: '0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl text-white font-[Akronim]" style={{ letterSpacing: '2px' }}>
                FILTERS
              </h3>
              
              {/* Close filters on mobile */}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} style={{ color: '#ffffff' }} />
              </button>
            </div>

            {/* Main Search Bar */}
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                size={18} 
              />
              <Input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 h-10"
                style={{
                  boxShadow: searchQuery ? '0 0 20px rgba(87, 241, 214, 0.3)' : 'none',
                }}
              />
            </div>

            {/* Clear All Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-white/60 hover:text-white w-full"
              >
                Clear All Filters
              </Button>
            )}

            {/* Accordion Filters */}
            <Accordion type="multiple" className="w-full space-y-2">
              {/* Trending */}
              <AccordionItem value="trending" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-[#57f1d6] py-3">
                  <span className="uppercase tracking-wider text-sm">Trending</span>
                  {activeFilters.trending.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#57f1d6] text-[#0C0C0D] rounded-full text-xs">
                      {activeFilters.trending.length}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.trending.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFilter('trending', option)}
                        className={`rounded-full border-2 transition-all ${
                          activeFilters.trending.includes(option)
                            ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D] shadow-[0_0_20px_rgba(87,241,214,0.5)]' 
                            : 'bg-transparent border-[#57f1d6]/50 text-white hover:border-[#57f1d6] hover:bg-[#57f1d6]/10'
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Popular */}
              <AccordionItem value="popular" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-[#57f1d6] py-3">
                  <span className="uppercase tracking-wider text-sm">Popular</span>
                  {activeFilters.popular.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#57f1d6] text-[#0C0C0D] rounded-full text-xs">
                      {activeFilters.popular.length}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.popular.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFilter('popular', option)}
                        className={`rounded-full border-2 transition-all ${
                          activeFilters.popular.includes(option)
                            ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D] shadow-[0_0_20px_rgba(87,241,214,0.5)]' 
                            : 'bg-transparent border-[#57f1d6]/50 text-white hover:border-[#57f1d6] hover:bg-[#57f1d6]/10'
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Style - WITH MINI SEARCH */}
              <AccordionItem value="style" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-[#57f1d6] py-3">
                  <span className="uppercase tracking-wider text-sm">Style</span>
                  {activeFilters.style.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#57f1d6] text-[#0C0C0D] rounded-full text-xs">
                      {activeFilters.style.length}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2 space-y-3">
                  {/* Mini Search for Style */}
                  <div className="relative">
                    <Search 
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" 
                      size={14} 
                    />
                    <Input
                      type="text"
                      placeholder="Search styles..."
                      value={styleSearchQuery}
                      onChange={(e) => setStyleSearchQuery(e.target.value)}
                      className="pl-8 bg-white/5 border-white/10 h-8 text-sm"
                    />
                  </div>
                  
                  {/* Style Options */}
                  <div 
                    className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    {filteredStyleOptions.length > 0 ? (
                      filteredStyleOptions.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFilter('style', option)}
                          className={`rounded-full border-2 transition-all ${
                            activeFilters.style.includes(option)
                              ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D] shadow-[0_0_20px_rgba(87,241,214,0.5)]' 
                              : 'bg-transparent border-[#57f1d6]/50 text-white hover:border-[#57f1d6] hover:bg-[#57f1d6]/10'
                          }`}
                        >
                          {option}
                        </Button>
                      ))
                    ) : (
                      <p className="text-white/40 text-sm">No styles found</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Color */}
              <AccordionItem value="color" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-[#57f1d6] py-3">
                  <span className="uppercase tracking-wider text-sm">Color</span>
                  {activeFilters.color.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#57f1d6] text-[#0C0C0D] rounded-full text-xs">
                      {activeFilters.color.length}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.color.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFilter('color', option)}
                        className={`rounded-full border-2 transition-all ${
                          activeFilters.color.includes(option)
                            ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D] shadow-[0_0_20px_rgba(87,241,214,0.5)]' 
                            : 'bg-transparent border-[#57f1d6]/50 text-white hover:border-[#57f1d6] hover:bg-[#57f1d6]/10'
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Size */}
              <AccordionItem value="size" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-[#57f1d6] py-3">
                  <span className="uppercase tracking-wider text-sm">Size</span>
                  {activeFilters.size.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#57f1d6] text-[#0C0C0D] rounded-full text-xs">
                      {activeFilters.size.length}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.size.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFilter('size', option)}
                        className={`rounded-full border-2 transition-all ${
                          activeFilters.size.includes(option)
                            ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D] shadow-[0_0_20px_rgba(87,241,214,0.5)]' 
                            : 'bg-transparent border-[#57f1d6]/50 text-white hover:border-[#57f1d6] hover:bg-[#57f1d6]/10'
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Vibe */}
              <AccordionItem value="vibe" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-[#57f1d6] py-3">
                  <span className="uppercase tracking-wider text-sm">Vibe</span>
                  {activeFilters.vibe.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#57f1d6] text-[#0C0C0D] rounded-full text-xs">
                      {activeFilters.vibe.length}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.vibe.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFilter('vibe', option)}
                        className={`rounded-full border-2 transition-all ${
                          activeFilters.vibe.includes(option)
                            ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D] shadow-[0_0_20px_rgba(87,241,214,0.5)]' 
                            : 'bg-transparent border-[#57f1d6]/50 text-white hover:border-[#57f1d6] hover:bg-[#57f1d6]/10'
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Gender */}
              <AccordionItem value="gender" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-[#57f1d6] py-3">
                  <span className="uppercase tracking-wider text-sm">For Him/Her</span>
                  {activeFilters.gender.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#57f1d6] text-[#0C0C0D] rounded-full text-xs">
                      {activeFilters.gender.length}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.gender.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFilter('gender', option)}
                        className={`rounded-full border-2 transition-all ${
                          activeFilters.gender.includes(option)
                            ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D] shadow-[0_0_20px_rgba(87,241,214,0.5)]' 
                            : 'bg-transparent border-[#57f1d6]/50 text-white hover:border-[#57f1d6] hover:bg-[#57f1d6]/10'
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Top 10 */}
              <AccordionItem value="top10" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-[#57f1d6] py-3">
                  <span className="uppercase tracking-wider text-sm">Top 10</span>
                  {activeFilters.top10.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#57f1d6] text-[#0C0C0D] rounded-full text-xs">
                      {activeFilters.top10.length}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.top10.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFilter('top10', option)}
                        className={`rounded-full border-2 transition-all ${
                          activeFilters.top10.includes(option)
                            ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D] shadow-[0_0_20px_rgba(87,241,214,0.5)]' 
                            : 'bg-transparent border-[#57f1d6]/50 text-white hover:border-[#57f1d6] hover:bg-[#57f1d6]/10'
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Mobile Overlay Backdrop - closes filter sidebar */}
          {isFilterOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-[9997]"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* RIGHT SIDE - Infinite Scroll Grid Gallery */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div>
              {/* Results Count */}
              <div className="mb-4 md:mb-6">
                <p className="text-white/60 text-sm md:text-base lg:text-lg">
                  Showing {Math.min(displayCount, filteredDesigns.length)} of {filteredDesigns.length} designs
                </p>
              </div>

              {/* Grid Gallery - 2 columns mobile, 3 tablet, 4 desktop, 5 XL */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {filteredDesigns.slice(0, displayCount).map((design, index) => (
                  <div
                    key={design.id}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      setLightboxImage(design.image);
                      setCurrentImageIndex(index);
                    }}
                    style={{
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <img
                      src={design.image}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Hover Overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 md:p-4"
                    >
                      <p className="text-white text-xs md:text-sm truncate">{design.title}</p>
                    </div>

                    {/* Glow Effect on Hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: 'inset 0 0 20px rgba(87, 241, 214, 0.4)',
                        border: '2px solid rgba(87, 241, 214, 0.6)',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Trigger */}
              {displayCount < filteredDesigns.length && (
                <div ref={loadMoreRef} className="h-16 md:h-20 flex items-center justify-center mt-6 md:mt-8">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#57f1d6] animate-pulse" />
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#57f1d6] animate-pulse delay-100" />
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#57f1d6] animate-pulse delay-200" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Dialog - Full Screen Image */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[10001] bg-black/95 flex items-center justify-center group/lightbox"
          onClick={handleCloseLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseLightbox}
            className="fixed top-4 right-4 z-[10002] p-3 rounded-full transition-colors hover:bg-white/20"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <X size={24} style={{ color: '#ffffff' }} />
          </button>

          {/* Left Arrow */}
          <button
            onClick={handlePrevImage}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-[10002] p-2 md:p-3 rounded-full transition-all opacity-0 group-hover/lightbox:opacity-100 hover:bg-white/20"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <ChevronLeft size={28} className="md:w-8 md:h-8" style={{ color: '#ffffff' }} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNextImage}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-[10002] p-2 md:p-3 rounded-full transition-all opacity-0 group-hover/lightbox:opacity-100 hover:bg-white/20"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <ChevronRight size={28} className="md:w-8 md:h-8" style={{ color: '#ffffff' }} />
          </button>

          <img
            src={lightboxImage}
            alt="Gallery design"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[95vw] max-h-[95vh] w-auto h-auto"
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </>
  );
}
