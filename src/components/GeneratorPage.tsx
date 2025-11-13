import AIImageGeneratorBlock from './creative-tim/blocks/ai-image-generator-01';
// React import not needed with automatic JSX runtime
import { SourceCard } from './shared/SourceCard';
import { TryItOnButton } from './try-it-on/TryItOnButton';
import { useGenerator } from '../contexts/GeneratorContext';
// import { useLicense } from '../contexts/LicenseContext';
import GalleryOverlay from "./shared/GalleryOverlay";
import { ModelPicker } from "./shared/ModelPicker";
// Use the installed Timeline component instead of the old HowItWorksTimeline
import { Timeline } from './ui/timeline';

// Removed inline ResultsCard component per request to remove the block
import { SocialProof } from '../sections/SocialProof/SocialProof';
import { Pricing } from '../sections/Pricing/Pricing';
import { Footer } from './Footer';
import { Stats } from '../sections';
import {
  galleryDesigns,
  tattooStyles,
  tattooPlacements,
  tattooSizes,
  colorPreferences,
  sectionHeadings,
  timelineSteps
} from '../data';
import styles from './GeneratorPage.module.css';

// Import modular components and hooks
import {
  GeneratorPageProps
} from './generator-page/types';
import {
  useGeneratorState
} from './generator-page/hooks';
import {
  HeroSection,
  LiveTheMagicSection,
  GeneratorControlsSection
} from './generator-page/components';

export function GeneratorPage({ onNavigate }: GeneratorPageProps) {
  const generator = useGenerator();
  // Removed license usage since generation block was removed
  // const license = useLicense();

  const allGalleryDesigns = galleryDesigns;

  // Use the custom hooks for state management
  const {
    selectedStyle,
    selectedColorPreference,
    selectedMood,
    selectedPlacement,
    selectedSize,
    // selectedAspectRatio,
    moodSearchQuery,
    generating,
    generated,
    generatedImage,
    isGalleryOverlayOpen,
    setSelectedStyle,
    setSelectedColorPreference,
    setSelectedMood,
    setSelectedPlacement,
    setSelectedSize,
    // setGenerating,
    // setGenerated,
    // setGeneratedImage,
    setIsGalleryOverlayOpen,
    // setValidationError,
  } = useGeneratorState();

  // Removed generation handler since the Generated Designs block was removed

  return (
    <>
      <div className="w-full overflow-x-hidden">
        <HeroSection />
        {/* Restore the top phrases and stats row (no tour button) */}
        <div className="w-full px-1.5 md:px-2.5 mt-10 md:mt-14">
          <Stats />
        </div>

        <div className="w-full bg-background">
          <div 
            className="w-full space-y-8 md:space-y-10 pb-12 px-1.5 md:px-2.5">
            
            <LiveTheMagicSection
              galleryDesigns={allGalleryDesigns}
              onViewAll={() => setIsGalleryOverlayOpen(true)}
            />

            {/* Removed legacy inline gallery: LiveTheMagicSection now renders the new ImageGallery */}

            <div className="mt-[70px] md:mt-[90px] space-y-6">
              {/* External title for the timeline section */}
              <div className="flex justify-center">
                <h2 className={"text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-8 sm:mb-10 md:mb-12 lg:mb-16 tracking-[4px] px-2 " + styles.titleShadow}>
                  Started from the Bottom
                </h2>
              </div>
              {/** Map our existing timelineSteps into the installed Timeline's data shape */}
              <Timeline
                data={timelineSteps.map((step) => ({
                  title: step.title,
                  content: (
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="flex items-start gap-3">
                        <step.icon className="w-6 h-6 text-accent mt-1" />
                        <p className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ),
                }))}
              />
            </div>

            <div className="mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <SocialProof />
            </div>

            <div className="mt-[130px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <Pricing onNavigate={onNavigate} />
            </div>

            <GeneratorControlsSection
              tattooStyles={tattooStyles}
              tattooPlacements={tattooPlacements}
              tattooSizes={tattooSizes}
              colorPreferences={colorPreferences}
              selectedStyle={selectedStyle}
              selectedPlacement={selectedPlacement}
              selectedSize={selectedSize}
              selectedColorPreference={selectedColorPreference}
              selectedMood={selectedMood}
              moodSearchQuery={moodSearchQuery}
              onSelectStyle={setSelectedStyle}
              onSelectPlacement={setSelectedPlacement}
              onSelectSize={setSelectedSize}
              onSelectColorPreference={setSelectedColorPreference}
              onSelectMood={setSelectedMood}
            />

            <div className="mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <div className="grid grid-cols-1 gap-[60px] sm:gap-20 md:gap-[100px] lg:gap-12 items-start">
                <div className="flex flex-col">
                  <h2 className={"text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2 " + styles.titleShadow}>
                    {sectionHeadings.yourStory.title.split('\n').map((line, i) => (
                      <span key={i} className="text-[48px]">
                        {line}
                        {i < sectionHeadings.yourStory.title.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </h2>
                  <SourceCard />
                </div>
              </div>
            </div>

            <div className="mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <h2 className={"text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2 " + styles.titleShadow}>
                {sectionHeadings.chooseYourVibe.title}
              </h2>
              <div className="max-w-2xl mx-auto px-4">
                <ModelPicker
                  selectedModel={generator.selectedModel}
                  onModelChange={generator.setSelectedModel}
                />
              </div>
            </div>

            <div className="mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <AIImageGeneratorBlock />
            </div>

            {/* Removed the Generated Designs block before the footer per request */}

            {generated && generatedImage && !generating && (
              <div className="mt-6 sm:mt-8 md:mt-12 pb-8 md:pb-12">
                <TryItOnButton
                  imageDataUrl={generatedImage}
                />
              </div>
            )}

            <div className="hidden lg:block mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <div className={`relative overflow-hidden rounded-t-[40px] border-t-4 ${styles.footerTopShadow}`}>
                <Footer onNavigate={onNavigate} />
              </div>
            </div>

          </div>

        </div>

        <div className={`lg:hidden w-full ${styles.mobileFooterWrapper}`}>
          <div className={`relative overflow-hidden rounded-t-4xl sm:rounded-t-[40px] border-t-4 w-full ${styles.footerTopShadow}`}>
            <Footer onNavigate={onNavigate} />
          </div>
        </div>
      </div>
      
      <GalleryOverlay
        isOpen={isGalleryOverlayOpen}
        onClose={() => setIsGalleryOverlayOpen(false)}
      />

    </>
  );
}
