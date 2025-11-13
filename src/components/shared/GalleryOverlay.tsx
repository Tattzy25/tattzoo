import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { X, Menu } from 'lucide-react';
import { ImageGallery } from '../generator-page/components/live-the-magic-section';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { tattooStyles, tattooPlacements, tattooSizes, colorPreferences } from '@/data/generator-options';
import { moods } from '@/data/moods';

type Props = {
  isOpen: boolean;
  onClose: () => void;
                                                                        };

export function GalleryOverlay({ isOpen, onClose }: Props) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const filterDefs = useMemo(
    () => ([
      { id: 'style', label: 'Style', options: ['All', ...tattooStyles] },
      { id: 'placement', label: 'Placement', options: ['All', ...tattooPlacements] },
      { id: 'size', label: 'Size', options: ['All', ...tattooSizes] },
      { id: 'color', label: 'Color', options: ['All', ...colorPreferences] },
      { id: 'mood', label: 'Mood', options: ['All', ...moods.map(m => m.label)] },
    ]),
    []
  );
  // Lock body scroll while overlay is open to prevent background layout shifts
  // and scroll chaining with the page. Restore on unmount.
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
  <div className="fixed inset-1 md:inset-2 lg:inset-2 z-50 bg-[#2a2a2a]/90 backdrop-blur-md flex flex-col rounded-[28px] border border-(--primary)/40 shadow-[0_0_0_1px_var(--primary),0_0_12px_4px_color-mix(in_oklch,var(--primary)_70%,transparent),0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFiltersOpen((v) => !v)}
            className="text-white hover:bg-white/10 md:hidden"
            aria-label="Toggle filters"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="text-white font-medium">Gallery</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10 h-11 w-11 rounded-full"
          aria-label="Close gallery"
        >
          <X className="h-7 w-7" />
        </Button>
      </div>

      {/* Content with sidebar layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (left) */}
        <aside
          className={`bg-card/80 backdrop-blur-md border-r border-white/10 w-72 shrink-0 overflow-y-auto overscroll-contain p-4 hidden md:block`}
          style={{ scrollbarGutter: 'stable both-edges' as any }}
        >
          <FiltersAccordion
            filterDefs={filterDefs}
            selected={selectedFilters}
            onChange={setSelectedFilters}
            onApply={undefined}
          />
        </aside>

        {/* Mobile slide-in panel */}
        {isFiltersOpen && (
          <div className="md:hidden absolute inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsFiltersOpen(false)}
              aria-hidden
            />
            <aside
              className="relative h-full w-[80%] max-w-80 bg-card/95 backdrop-blur-md border-r border-white/10 p-4 overflow-y-auto"
              style={{ scrollbarGutter: 'stable both-edges' as any }}
            >
              <FiltersAccordion
                filterDefs={filterDefs}
                selected={selectedFilters}
                onChange={setSelectedFilters}
                onApply={() => setIsFiltersOpen(false)}
              />
            </aside>
          </div>
        )}

        {/* Main gallery area */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4" style={{ scrollbarGutter: 'stable both-edges' as any }}>
          <ImageGallery
            galleryDesigns={[]}
            onViewAll={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default GalleryOverlay;

// Internal component: categorized accordion filter UI
function FiltersAccordion({
  filterDefs,
  selected,
  onChange,
  onApply,
}: {
  filterDefs: { id: string; label: string; options: string[] }[];
  selected: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  onApply?: () => void;
}) {
  return (
    <div className="text-foreground">
      <div className="sticky top-0 z-10 -mx-4 px-4 pb-2 mb-2 bg-card/80 backdrop-blur-md flex items-center justify-between">
        <h3 className="text-sm font-medium opacity-90">Filters</h3>
        <Button size="sm" className="brand-gradient text-white" onClick={onApply}>Apply</Button>
      </div>
      <Accordion type="multiple" className="w-full">
        {filterDefs.map((f) => (
          <AccordionItem key={f.id} value={f.id}>
            <AccordionTrigger className="text-sm">{f.label}</AccordionTrigger>
            <AccordionContent>
              <Select
                value={selected[f.id] ?? f.options[0]}
                onValueChange={(val) => onChange({ ...selected, [f.id]: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={f.label} />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-black/40 border border-white/10">
                  {f.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
