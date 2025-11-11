import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { buildTattooFilters, chunkToDesignLike, searchMixedbread } from '../../data/mixedbread';

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
  const [styleSearchQuery, setStyleSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ [key in FilterType]: string[] }>({
    trending: [],
    popular: [],
    style: [],
    color: [],
    size: [],
    vibe: [],
    gender: [],
    top10: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [remoteDesigns, setRemoteDesigns] = useState<Design[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);


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
    setRemoteDesigns(null);
    setError(null);
  };
  
  // Filter style options based on mini search
  const filteredStyleOptions = filterOptions.style.filter(style =>
    style.toLowerCase().includes(styleSearchQuery.toLowerCase())
  );

  // Reset orientation when closing lightbox
  const handleCloseLightbox = () => {
    setLightboxImage(null);
  };

  // Build Mixedbread filters from selection
  const mbFilters = useMemo(() =>
    buildTattooFilters({
      style: activeFilters.style,
      color: activeFilters.color,
      vibe: activeFilters.vibe,
      size: activeFilters.size,
      gender: activeFilters.gender,
      top10: activeFilters.top10,
    }), [activeFilters]
  );

  // Fetch Mixedbread results when open and filters/search change
  useEffect(() => {
    if (!isOpen) return;
    // Avoid hammering API on every keystroke: basic debounce
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        if (abortRef.current) abortRef.current.abort();
        const ctl = new AbortController();
        abortRef.current = ctl;

        const query = searchQuery.trim() || '*';
        const results = await searchMixedbread({ query, top_k: 24, filters: mbFilters }, ctl.signal);
        const mapped = results
          .map(chunkToDesignLike)
          .filter(Boolean) as Design[];
        setRemoteDesigns(mapped.length ? mapped : []);
        setDisplayCount(20);
      } catch (e: any) {
        // Fallback to local designs if backend not configured
        setRemoteDesigns(null);
        setError(e?.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [isOpen, searchQuery, mbFilters]);

  // Choose data source: remote if available, else local filtered by title
  const filteredDesigns = useMemo(() => {
    if (remoteDesigns) return remoteDesigns;
    return designs.filter(design => {
      const matchesSearch = searchQuery === '' ||
        design.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [remoteDesigns, designs, searchQuery]);

  // Navigate to previous image
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredDesigns.length - 1;
    setCurrentImageIndex(newIndex);
    setLightboxImage(filteredDesigns[newIndex].image);
  };

  // Navigate to next image
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentImageIndex < filteredDesigns.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setLightboxImage(filteredDesigns[newIndex].image);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredDesigns.length - 1;
        setCurrentImageIndex(newIndex);
        setLightboxImage(filteredDesigns[newIndex].image);
      } else if (e.key === 'ArrowRight') {
        const newIndex = currentImageIndex < filteredDesigns.length - 1 ? currentImageIndex + 1 : 0;
        setCurrentImageIndex(newIndex);
        setLightboxImage(filteredDesigns[newIndex].image);
      } else if (e.key === 'Escape') {
        handleCloseLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, currentImageIndex, filteredDesigns]);

  // Touch/swipe handlers removed; keyboard and buttons cover navigation.

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

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-full bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Explore Tattoo Designs</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b bg-white">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search designs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="whitespace-nowrap"
                >
                  Filters {hasActiveFilters && <span className="ml-1 text-blue-600">•</span>}
                </Button>
              </div>

              {/* Filter Panel */}
              {isFilterOpen && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(filterOptions).map(([category, options]) => (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="text-sm font-medium capitalize">
                          {category}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {category === 'style' ? (
                              <>
                                <Input
                                  type="text"
                                  placeholder="Search styles..."
                                  value={styleSearchQuery}
                                  onChange={(e) => setStyleSearchQuery(e.target.value)}
                                  className="mb-2"
                                />
                                {filteredStyleOptions.map((option) => (
                                  <Button
                                    key={option}
                                    variant={activeFilters[category as FilterType].includes(option) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleToggleFilter(category as FilterType, option)}
                                    className="text-xs"
                                  >
                                    {option}
                                  </Button>
                                ))}
                              </>
                            ) : (
                              options.map((option) => (
                                <Button
                                  key={option}
                                  variant={activeFilters[category as FilterType].includes(option) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleToggleFilter(category as FilterType, option)}
                                  className="text-xs"
                                >
                                  {option}
                                </Button>
                              ))
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="mt-4 text-red-600 hover:text-red-700"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Gallery Grid */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4"
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
              {loading && (
                <div className="text-center text-gray-500 py-6">Searching designs…</div>
              )}
              {error && !loading && (
                <div className="text-center text-red-600 py-4 text-sm">{error}</div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredDesigns.slice(0, displayCount).map((design, index) => (
                  <div
                    key={design.id}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      setLightboxImage(design.image);
                      setCurrentImageIndex(index);
                    }}
                  >
                    <img
                      src={design.image}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Load More Trigger */}
              {displayCount < filteredDesigns.length && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  <div className="text-gray-500">Loading more designs...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-black bg-opacity-95 flex items-center justify-center p-4"
          onClick={handleCloseLightbox}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <img
            src={lightboxImage}
            alt="Gallery design"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[95vw] max-h-[95vh] w-auto h-auto"
            style={{
              objectFit: 'contain',
            }}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}
    </>
  );
}
