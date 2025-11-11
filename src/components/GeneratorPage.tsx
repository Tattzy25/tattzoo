import AIImageGeneratorBlock from './creative-tim/blocks/ai-image-generator-01';
import { SourceCard } from './shared/SourceCard';
import { TryItOnButton } from './try-it-on/TryItOnButton';
import { useGenerator } from '../contexts/GeneratorContext';
import { useLicense } from '../contexts/LicenseContext';
import GalleryOverlay from "./shared/GalleryOverlay";
import ImageGallery from "./creative-tim/blocks/product-listing-filters-01";
import { ModelPicker } from "./shared/ModelPicker";
import { ResultsCard } from './shared/ResultsCard';
import { HowItWorksTimeline } from './HowItWorksTimeline';
import { SocialProof } from '../sections/SocialProof/SocialProof';
import { Pricing } from '../sections/Pricing/Pricing';
import { Footer } from './Footer';
import {
  galleryDesigns,
  tattooStyles,
  tattooPlacements,
  tattooSizes,
  colorPreferences,
  sectionHeadings
} from '../data';
import styles from './GeneratorPage.module.css';

// Import modular components and hooks
import {
  GeneratorPageProps
} from './generator-page/types';
import {
  useGeneratorState,
  useGeneration
} from './generator-page/hooks';
import {
  HeroSection,
  IntroSection,
  LiveTheMagicSection,
  GeneratorControlsSection
} from './generator-page/components';export function GeneratorPage({ onNavigate }: GeneratorPageProps) {
  const generator = useGenerator();
  const license = useLicense();

  const allGalleryDesigns = galleryDesigns;

  // Use the custom hooks for state management
  const {
    selectedStyle,
    selectedColorPreference,
    selectedMood,
    selectedPlacement,
    selectedSize,
    selectedAspectRatio,
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
    setGenerating,
    setGenerated,
    setGeneratedImage,
    setIsGalleryOverlayOpen,
    setValidationError,
  } = useGeneratorState();

  const { handleGenerate } = useGeneration({
    license,
    selectedStyle,
    selectedColorPreference,
    selectedMood,
    selectedPlacement,
    selectedSize,
    selectedAspectRatio,
    generator,
    setGenerating,
    setGenerated,
    setGeneratedImage,
    setValidationError,
  });

  return (
    <>
      <div className="w-full overflow-x-hidden">
        <HeroSection />

        <div className="w-full bg-background">
          <div 
            className="w-full space-y-8 md:space-y-10 pb-12 px-4 md:px-6">
            
            <IntroSection />

            <LiveTheMagicSection
              galleryDesigns={allGalleryDesigns}
              onViewAll={() => setIsGalleryOverlayOpen(true)}
            />

            {/* Inline gallery (Mixedbread-backed), no filters, 4 cols x ~5 rows initially */}
            <div className="mt-12">
              <ImageGallery showFilters={false} />
            </div>

            <div className="mt-[70px] md:mt-[90px]">
              <HowItWorksTimeline />
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

            <div className="mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px] pb-8 md:pb-12">
              <ResultsCard
                designs={generated && generatedImage ? [generatedImage] : []}
                isGenerating={generating}
                aspectRatio="16/9"
                maxWidth="6xl"
                onGenerate={handleGenerate}
                onNavigate={onNavigate}
              />
            </div>

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
