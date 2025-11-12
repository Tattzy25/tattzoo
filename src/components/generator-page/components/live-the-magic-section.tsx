import React from 'react';
// Switch to the newer gallery component used elsewhere
import ImageGallery from '../../creative-tim/blocks/product-listing-filters-01';
import { sectionHeadings } from '../../../data/content';
import styles from '../../GeneratorPage.module.css';
import ButtonDemo from '../../button-07';
import { GridBento } from '../../systaliko-ui/blocks/grid-bento';

interface LiveTheMagicSectionProps {
  galleryDesigns: any[];
  onViewAll: () => void;
}

const LiveTheMagicSection: React.FC<LiveTheMagicSectionProps> = ({
  galleryDesigns,
  onViewAll
}) => {
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

        {/* Use the GridBento component with fourCells variant - Two sets with more spacing between them */}
        <div className="flex flex-col lg:flex-row lg:gap-8 w-full">
          <GridBento variant="fourCells" className="h-screen py-12 px-6 flex-1 place-content-center place-items-center">
            {galleryDesigns.slice(0, 4).map((design, index) => (
              <div key={index} className="overflow-hidden size-full rounded-xl shadow-xl">
                <img className="size-full object-cover" src={design.image} alt={design.title} />
              </div>
            ))}
          </GridBento>
          
          <GridBento variant="fourCells" className="h-screen py-12 px-6 flex-1 place-content-center place-items-center">
            {galleryDesigns.slice(4, 8).map((design, index) => (
              <div key={index + 4} className="overflow-hidden size-full rounded-xl shadow-xl">
                <img className="size-full object-cover" src={design.image} alt={design.title} />
              </div>
            ))}
          </GridBento>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
          <div onClick={onViewAll}>
            <ButtonDemo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTheMagicSection;