import { Button } from '../ui/button';
import { X } from 'lucide-react';
import ImageGallery from '../creative-tim/blocks/product-listing-filters-01';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function GalleryOverlay({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="text-white font-medium">Gallery</div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ImageGallery
          showFilters={true}
          onLoadMore={() => {}}
        />
      </div>
    </div>
  );
}

export default GalleryOverlay;
