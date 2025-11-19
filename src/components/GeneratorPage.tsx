import AIImageGeneratorBlock from './creative-tim/blocks/ai-image-generator-01'
import AI02 from './ai-02'
import { TryItOnButton } from './try-it-on/TryItOnButton'
import { useGenerator } from '../contexts/GeneratorContext'
import GalleryOverlay from './shared/GalleryOverlay'
import { ModelPicker } from './shared/ModelPicker'
import { Footer } from './Footer'
import { Button } from './ui/button'
import { tattooStyles, tattooPlacements, tattooSizes, colorPreferences, sectionHeadings } from '../data'
import styles from './GeneratorPage.module.css'
import { GeneratorPageProps } from './generator-page/types'
import { useGeneratorState } from './generator-page/hooks'
import { GeneratorControlsSection } from './generator-page/components'

export function GeneratorPage({ onNavigate }: GeneratorPageProps) {
  const generator = useGenerator();

  

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
        <div className="w-full bg-background">
          <div className="w-full space-y-8 md:space-y-10 pb-12 px-1.5 md:px-2.5">
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
                <div className="flex flex-col items-center justify-center">
                  <h2 className={"text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2 " + styles.titleShadow}>
                  {sectionHeadings.yourStory.title.split('\n').map((line, i) => (
                    <span key={i} className="text-[48px]">
                    {line}
                    {i < sectionHeadings.yourStory.title.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                  </h2>
                  <div className="flex justify-center w-full mt-[100px]">
                    <AI02 />
                  </div>
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

        <div className="fixed bottom-6 right-6 z-50 flex gap-3">
          <Button
            onClick={() => {
              const el = document.getElementById('primary-generate-button');
              if (el) (el as HTMLButtonElement).click();
            }}
            className="h-12 px-6 font-[Orbitron] text-[18px] brand-gradient text-background shadow-lg shadow-accent/25"
          >
            CREATE NOW
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('home')}
            className="h-12 px-6 font-[Orbitron] text-[18px]"
          >
            HOME
          </Button>
        </div>
      </div>
      
      <GalleryOverlay
        isOpen={isGalleryOverlayOpen}
        onClose={() => setIsGalleryOverlayOpen(false)}
      />

    </>
  );
}
