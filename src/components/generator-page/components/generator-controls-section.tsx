import React from 'react';
import { CarouselPanel } from '../../../sections/Generator';
import { MoodSelector } from '../../../sections/Generator';
import { moods } from '../../../data/moods';

interface GeneratorControlsSectionProps {
  tattooStyles: string[];
  tattooPlacements: string[];
  tattooSizes: string[];
  colorPreferences: string[];
  selectedStyle: string | null;
  selectedPlacement: string | null;
  selectedSize: string | null;
  selectedColorPreference: string | null;
  selectedMood: string | null;
  moodSearchQuery: string;
  onSelectStyle: (style: string | null) => void;
  onSelectPlacement: (placement: string | null) => void;
  onSelectSize: (size: string | null) => void;
  onSelectColorPreference: (color: string | null) => void;
  onSelectMood: (moodId: string | null) => void;
}

const GeneratorControlsSection: React.FC<GeneratorControlsSectionProps> = ({
  tattooStyles,
  tattooPlacements,
  tattooSizes,
  colorPreferences,
  selectedStyle,
  selectedPlacement,
  selectedSize,
  selectedColorPreference,
  selectedMood,
  moodSearchQuery,
  onSelectStyle,
  onSelectPlacement,
  onSelectSize,
  onSelectColorPreference,
  onSelectMood,
}) => {
  const filteredMoods = moods.filter(mood =>
    mood.label.toLowerCase().includes(moodSearchQuery.toLowerCase())
  );

  const getMoodTitle = () => {
    return 'Set Your Mood';
  };

  return (
    <>
      <div className="mt-[180px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
        <CarouselPanel
          styles={tattooStyles}
          placements={tattooPlacements}
          sizes={tattooSizes}
          colors={colorPreferences}
          selectedStyle={selectedStyle}
          selectedPlacement={selectedPlacement}
          selectedSize={selectedSize}
          selectedColorPreference={selectedColorPreference}
          onSelectStyle={onSelectStyle}
          onSelectPlacement={onSelectPlacement}
          onSelectSize={onSelectSize}
          onSelectColorPreference={onSelectColorPreference}
        />
      </div>

      <div className="mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px] space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] sm:gap-20 md:gap-[100px] lg:gap-8 pt-4 md:pt-6">
          <div>
            <MoodSelector
              moods={filteredMoods}
              selectedMood={selectedMood}
              onSelectMood={onSelectMood}
              title={getMoodTitle()}
            />
          </div>
          <div>
            {/* Removed SkinCheck component */}
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneratorControlsSection;
