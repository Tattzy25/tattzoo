import { Suspense, useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { SelectionChip } from '../../components/shared/SelectionChip';
import { Badge } from '../../components/ui/badge';
import { getCarouselPlaceholder } from '../../data/placeholder-images';

interface CarouselPanelProps {
  styles: string[];
  placements: string[];
  sizes: string[];
  colors: string[];
  selectedStyle: string | null;
  selectedPlacement: string | null;
  selectedSize: string | null;
  selectedColorPreference: string | null;
  onSelectStyle: (style: string | null) => void;
  onSelectPlacement: (placement: string | null) => void;
  onSelectSize: (size: string | null) => void;
  onSelectColorPreference: (color: string | null) => void;
}

export function CarouselPanel({
  styles,
  placements,
  sizes,
  colors,
  selectedStyle,
  selectedPlacement,
  selectedSize,
  selectedColorPreference,
  onSelectStyle,
  onSelectPlacement,
  onSelectSize,
  onSelectColorPreference,
}: CarouselPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter all items based on search query
  const filteredStyles = styles.filter(style =>
    style.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPlacements = placements.filter(placement =>
    placement.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredSizes = sizes.filter(size =>
    size.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredColors = colors.filter(color =>
    color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Style and Color are always required for TaTTTy AI
  const isStyleRequired = true;
  const isColorRequired = true;
  
  // REORDERED: Style, Color, Where, Size
  // TODO: This will be replaced with data from /data/generator-types.ts when connected to database
  const carouselData = [
    {
      label: 'Style',
      required: isStyleRequired, // Required only for 'tattty'
      items: filteredStyles.map(style => ({
        title: style,
        image: getCarouselPlaceholder('styles', style),
        id: style
      })),
      selectedItem: selectedStyle,
      onSelect: onSelectStyle,
    },
    {
      label: 'Color',
      required: isColorRequired, // Required only for 'tattty'
      items: filteredColors.map(color => ({
        title: color,
        image: getCarouselPlaceholder('colors', color),
        id: color
      })),
      selectedItem: selectedColorPreference,
      onSelect: onSelectColorPreference,
    },
    {
      label: 'Where',
      required: false,
      items: filteredPlacements.map(placement => ({
        title: placement,
        image: getCarouselPlaceholder('placements', placement),
        id: placement
      })),
      selectedItem: selectedPlacement,
      onSelect: onSelectPlacement,
    },
    {
      label: 'Size',
      required: false,
      items: filteredSizes.map(size => ({
        title: size,
        image: getCarouselPlaceholder('sizes', size),
        id: size
      })),
      selectedItem: selectedSize,
      onSelect: onSelectSize,
    },
  ];

  return (
    <div className="relative w-full">
      {/* Search Bar - Enhanced Design */}
      <div className="relative mb-12 md:mb-16 px-4 md:px-0">
        <div className="relative max-w-3xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-accent/60 group-hover:text-accent transition-colors z-10" size={22} />
            <Input
              type="text"
              placeholder="Search styles, colors, placements, sizes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 pr-24 h-[72px] bg-[#0C0C0D]/80 border-2 border-accent/30 hover:border-accent/50 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 !text-[20px] rounded-2xl font-[Orbitron] text-white placeholder:text-muted-foreground/60 transition-all duration-300 shadow-[0_0_30px_rgba(87,241,214,0.1)]"
            />
            {searchQuery && (
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-accent/20 border border-accent/40 rounded-lg">
                <span className="text-accent font-[Orbitron]">
                  {filteredStyles.length + filteredPlacements.length + filteredSizes.length + filteredColors.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Container - Minimal gaps between columns, spacious gaps between cards */}
      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-[2px] px-2 md:px-4">
        {carouselData.map((carousel, index) => (
          <div 
            key={index}
            className="relative flex flex-col"
            style={{
              minHeight: '600px',
              maxHeight: '75vh',
            }}
          >
            {/* Column Header */}
            <div className="flex flex-col items-center gap-3 mb-6 md:mb-8 sticky top-0 z-10 bg-[#0C0C0D]/98 backdrop-blur-xl py-4 px-2 rounded-xl border-2 border-white/10">
              <div className="relative flex flex-col items-center gap-2">
                <h3 className="font-[Orbitron] text-white tracking-[0.2em] uppercase text-[18px] md:text-[22px] lg:text-[26px] relative">
                  {carousel.label}
                  <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"></div>
                </h3>
                {/* Required/Optional Badge */}
                <Badge 
                  variant="outline" 
                  className={`
                    font-[Orbitron] text-[10px] md:text-[11px] tracking-wider uppercase px-2 py-0.5
                    ${carousel.required 
                      ? 'border-accent/60 text-accent bg-accent/10' 
                      : 'border-white/30 text-white/60 bg-white/5'
                    }
                  `}
                >
                  {carousel.required ? 'Required' : 'Optional'}
                </Badge>
              </div>
              {carousel.selectedItem && (
                <SelectionChip 
                  label={carousel.label} 
                  value={carousel.selectedItem}
                  onClear={() => carousel.onSelect(null)}
                />
              )}
            </div>
            
            {/* Scrollable Cards Area */}
            <div 
              className="overflow-y-auto overflow-x-visible flex-1 px-3 md:px-4 scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <Sparkles className="animate-spin text-accent" size={40} />
                </div>
              }>
                <div className="flex flex-col gap-8 md:gap-10 pb-4 pt-6 md:pt-8 items-center">
                  {carousel.items.map((item) => {
                    const isSelected = carousel.selectedItem === item.title;
                    return (
                      <div
                        key={item.id}
                        onClick={() => carousel.onSelect(item.title)}
                        className={`
                          relative aspect-square w-[78%] md:w-[85%] rounded-2xl md:rounded-3xl overflow-hidden 
                          cursor-pointer transition-all duration-300 ease-out
                          border-2 group select-none transform
                          ${isSelected 
                            ? 'border-accent shadow-[0_0_18px_rgba(87,241,214,0.75),0_0_30px_rgba(87,241,214,0.45)] scale-[1.02]' 
                            : 'border-accent/25 hover:border-accent/60 hover:scale-[1.01] active:scale-[0.98] shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                          }
                        `}
                        style={{
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                          background: isSelected 
                            ? 'linear-gradient(135deg, rgba(87,241,214,0.15), rgba(87,241,214,0.05))' 
                            : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                        }}
                      >
                        {/* Image */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`
                              w-full h-full object-cover pointer-events-none transition-all duration-500
                              ${isSelected ? 'scale-105 brightness-110' : 'group-hover:scale-105 group-hover:brightness-95'}
                            `}
                            draggable="false"
                          />
                        ) : (
                          <div className={`
                            w-full h-full flex items-center justify-center pointer-events-none transition-all duration-500
                            ${isSelected ? 'scale-105' : 'group-hover:scale-105'}
                          `}>
                            <div className="text-center">
                              <div className="text-accent/60 text-2xl font-bold mb-2">
                                {item.title.charAt(0)}
                              </div>
                              <div className="text-white/60 text-xs font-medium">
                                {item.title}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Gradient Overlay */}
                        <div 
                          className={`
                            absolute inset-0 transition-all duration-500
                            ${isSelected 
                              ? 'bg-linear-to-t from-accent/40 via-black/60 to-black/20' 
                              : 'bg-linear-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/80'
                            }
                          `}
                        />
                        
                        {/* Title */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end p-3 md:p-5 lg:p-6">
                          <h4 
                            className={`
                              text-white text-center font-[Rock_Salt] transition-all duration-300 leading-tight
                              ${isSelected ? 'text-accent scale-110' : 'group-hover:scale-105'}
                            `}
                            style={{
                              textShadow: isSelected 
                                ? '0 0 15px rgba(87,241,214,0.9), 0 0 30px rgba(87,241,214,0.5), 2px 2px 6px rgba(0,0,0,0.9)' 
                                : '2px 2px 6px rgba(0,0,0,0.9), -1px -1px 3px rgba(0,0,0,0.7)',
                              fontSize: 'clamp(11px, 2.2vw, 16px)',
                            }}
                          >
                            {item.title}
                          </h4>
                        </div>
                        
                        {/* Selection Glow Ring */}
                        {isSelected && (
                          <div 
                            className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none animate-pulse"
                            style={{
                              boxShadow: 'inset 0 0 30px rgba(87,241,214,0.3)',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </Suspense>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
