
import { GridBento } from '@/components/systaliko-ui/blocks/grid-bento';
import { galleryImages } from '@/data/gallery';
import Image from 'next/image';

export default function GalleryPage() {
  const bentoItems = galleryImages.slice(0, 5);
  const additionalItems = galleryImages.slice(5);

  return (
    <div className="flex flex-col gap-4 p-4">
      <GridBento variant="default">
        {bentoItems.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg">
            <Image
              src={item.src}
              alt={item.alt}
              layout="fill"
              objectFit="cover"
              className="h-full w-full"
            />
          </div>
        ))}
      </GridBento>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {additionalItems.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg aspect-square relative">
            <Image
              src={item.src}
              alt={item.alt}
              layout="fill"
              objectFit="cover"
              className="h-full w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
