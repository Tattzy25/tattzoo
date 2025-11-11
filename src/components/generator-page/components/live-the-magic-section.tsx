import React from 'react';
import { TattooGallery } from '../../shared/TattooGallery';
import { sectionHeadings } from '../../../data/content';
import styles from '../../GeneratorPage.module.css';

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
      <div className="w-full px-4 md:px-8 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
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

        <TattooGallery
          designs={galleryDesigns.slice(0, 15)}
          displayCount={15}
          onLoadMore={() => {}}
          hasMore={false}
          columns={3}
        />

        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={onViewAll}
            className={"px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg " + styles.viewAllButton}
          >
            View All Designs
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveTheMagicSection;