import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Heart, 
  RefreshCw, 
  Plus, 
  Zap,
  Smile,
  Moon,
  Waves,
  HeartHandshake,
  Sparkle,
  Flame,
  Minus,
  RefreshCw as RefreshIcon,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { 
  MoodSelector,
  CarouselPanel,
} from '../sections/Generator';
import { Mood } from '../types/mood';
import { PLACEHOLDER_MOODS, PLACEHOLDER_ASPECT_RATIOS } from '../utils/mockDataGenerator';
import { GeneratorSidebar } from './Sidebar/GeneratorSidebar';
import { ResultsCard } from './shared/ResultsCard';
import { Gen1Results } from './shared/gen-1-results';
import { SourceCard } from './shared/SourceCard';
import { AspectRatio } from './AspectRatio';
import { TryItOnButton } from './try-it-on/TryItOnButton';
import { 
  saveGeneratorState,
  getGeneratorState,
  clearGeneratorState 
} from '../utils/inputPersistence';
import { useGenerator } from '../contexts/GeneratorContext';
import { SelectionChip } from './shared/SelectionChip';
import { TattooGallery } from './shared/TattooGallery';
import { FullScreenGalleryOverlay } from './shared/FullScreenGalleryOverlay';
import { ModelPicker } from './shared/ModelPicker';
import { HowItWorksTimeline } from './HowItWorksTimeline';
import { SocialProof } from '../sections/SocialProof/SocialProof';
import { Pricing } from '../sections/Pricing/Pricing';
import { Footer } from './Footer';
import { StyledPhrase } from './shared/StyledPhrase';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { TattooImageCard } from './shared/TattooImageCard';
import { sessionDataStore } from '../services/submissionService';
import { 
  galleryDesigns,
  tattooStyles,
  tattooPlacements,
  homePageStats,
  sectionHeadings
} from '../data';
import styles from './GeneratorPage.module.css';

interface GeneratorPageProps {
  onNavigate: (page: string) => void;
}

export function GeneratorPage({ onNavigate }: GeneratorPageProps) {
  const generator = useGenerator();
  
  const heroBackground: string = '/images/hero-background.jpg';
  const allGalleryDesigns = galleryDesigns;
  
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedColorPreference, setSelectedColorPreferenceState] = useState<string>('Black & Grey');
  const [selectedStyle, setSelectedStyleState] = useState<string>('Traditional');
  const [selectedSize, setSelectedSizeState] = useState<string | null>(null);
  const [selectedPlacement, setSelectedPlacementState] = useState<string | null>(null);
  const [selectedMood, setSelectedMoodState] = useState<string>('happy');
  const [moodSearchQuery, setMoodSearchQuery] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatioState] = useState<string>('1:1');
  const [isGalleryOverlayOpen, setIsGalleryOverlayOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const setSelectedStyle = (style: string | null) => {
    console.log('🎨 Style selected:', style);
    setSelectedStyleState(style || 'Traditional');
  };
  
  const setSelectedColorPreference = (color: string | null) => {
    console.log('🎨 Color selected:', color);
    setSelectedColorPreferenceState(color || 'Black & Grey');
  };
  
  const setSelectedPlacement = (placement: string | null) => {
    console.log('📍 Placement selected:', placement);
    setSelectedPlacementState(placement);
  };
  
  const setSelectedSize = (size: string | null) => {
    console.log('📏 Size selected:', size);
    setSelectedSizeState(size);
  };
  
  const setSelectedMood = (mood: string | null) => {
    console.log('😊 Mood selected:', mood);
    setSelectedMoodState(mood || 'happy');
  };
  
  const setSelectedAspectRatio = (ratio: string | null) => {
    console.log('📐 Aspect ratio selected:', ratio);
    setSelectedAspectRatioState(ratio || '1:1');
  };
  
  useEffect(() => {
    console.log('✅ Initial defaults set:');
    console.log('  - Style:', selectedStyle);
    console.log('  - Color:', selectedColorPreference);
    console.log('  - Mood:', selectedMood);
    console.log('  - Aspect Ratio:', selectedAspectRatio);
    console.log('  - Model:', generator.selectedModel);
  }, []);
  
  useEffect(() => {
    generator.updateStyle(selectedStyle);
  }, [selectedStyle]);
  
  useEffect(() => {
    generator.updatePlacement(selectedPlacement);
  }, [selectedPlacement]);
  
  useEffect(() => {
    generator.updateSize(selectedSize);
  }, [selectedSize]);
  
  useEffect(() => {
    generator.updateColor(selectedColorPreference);
  }, [selectedColorPreference]);
  
  useEffect(() => {
    generator.updateMood(selectedMood);
  }, [selectedMood]);
  
  useEffect(() => {
    const savedState = getGeneratorState();
    if (savedState) {
      setSelectedStyle(savedState.selectedStyle);
      setSelectedPlacement(savedState.selectedPlacement);
      setSelectedSize(savedState.selectedSize);
      setSelectedColorPreference(savedState.selectedColorPreference);
      setSelectedMood(savedState.selectedMood);
      
      clearGeneratorState();
      
      console.log('Your design is being generated! All your selections have been restored');
      
      setTimeout(() => {
        handleGenerate();
      }, 500);
    }
  }, []);

  const handleGenerate = async () => {
    const savedData = sessionDataStore.getSourceCardData();
    
    const q1Answer = savedData?.question1?.answer || '';
    const q2Answer = savedData?.question2?.answer || '';
    
    if (q1Answer.trim().length < 50 || q2Answer.trim().length < 50) {
      console.error('❌ TATTTY requires both questions with minimum 50 characters each');
      setValidationError('Click Submit First!');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }
    
    setValidationError(null);
    
    const finalStyle = selectedStyle || 'Traditional';
    const finalColor = selectedColorPreference || 'Black & Grey';
    const finalMood = selectedMood || 'happy';
    
    sessionDataStore.setOptions({
      style: finalStyle,
      color: finalColor,
      mood: finalMood,
      placement: selectedPlacement,
      size: selectedSize,
      aspectRatio: selectedAspectRatio,
      model: generator.selectedModel
    });
    
    console.log('🎨 Generating tattoo with:', {
      question1: savedData?.question1,
      question2: savedData?.question2,
      images: savedData?.images?.length || 0,
      style: finalStyle,
      color: finalColor,
      mood: finalMood,
      placement: selectedPlacement || 'Not specified',
      size: selectedSize || 'Not specified',
      aspectRatio: selectedAspectRatio,
      model: generator.selectedModel
    });
    
    setGenerating(true);
    
    setTimeout(() => {
      const shouldFail = Math.random() < 0.1;
      
      if (shouldFail) {
        setGenerating(false);
        setGenerated(false);
        setGeneratedImage(null);
        console.error('Generation timed out. Please try again.');
      } else {
        setGenerating(false);
        setGenerated(true);
        
        const mockCanvas = document.createElement('canvas');
        mockCanvas.width = 512;
        mockCanvas.height = 512;
        const ctx = mockCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(256, 400);
          ctx.bezierCurveTo(150, 350, 100, 250, 150, 150);
          ctx.bezierCurveTo(180, 100, 230, 100, 256, 140);
          ctx.bezierCurveTo(282, 100, 332, 100, 362, 150);
          ctx.bezierCurveTo(412, 250, 362, 350, 256, 400);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(256, 200, 30, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }
        const mockDataUrl = mockCanvas.toDataURL('image/png');
        setGeneratedImage(mockDataUrl);
      }
    }, 3000);
  };

  const filteredMoods = PLACEHOLDER_MOODS.filter(mood =>
    mood.label.toLowerCase().includes(moodSearchQuery.toLowerCase())
  );

  const getMoodTitle = () => {
    return 'Set Your Mood';
  };

  const renderHeroSection = () => (
    <section
      className={
        "relative min-h-[60vh] md:min-h-[75vh] lg:min-h-[calc(90vh+55px)] flex items-center justify-center overflow-hidden rounded-b-[40px] md:rounded-b-[70px] lg:rounded-b-[100px] border-b-4 " +
        styles.heroBorderShadow
      }
    >
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="TaTTTy Generator" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(87,241,214,0.08),transparent_50%)] bg-[rgba(0,0,0,0.61)]"></div>
      
      <div className="relative z-10 w-full flex items-center justify-center min-h-[50vh] px-4">
        {/* Hero content */}
      </div>
    </section>
  );

  const renderIntroSection = () => (
    <div>
      <div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 lg:gap-12 items-center justify-items-center justify-center">
          <StyledPhrase line1="Your" line2="Story" />
          <StyledPhrase line1="Your" line2="Pain" />
          <StyledPhrase line1="Into" line2="Ink" />
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 lg:gap-12 px-2 sm:px-4">
          {homePageStats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-2 sm:gap-4 md:gap-8 lg:gap-12">
              {index > 0 && <div className="h-8 md:h-10 lg:h-12 w-[1px] bg-border"></div>}
              <div className="text-center">
                <div className="font-[Orbitron] text-accent mb-1 text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px]">{stat.value}</div>
                <div className="text-muted-foreground text-[16px] sm:text-[20px] md:text-[28px] lg:text-[36px]">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLiveTheMagicSection = () => (
    <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
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
          designs={allGalleryDesigns.slice(0, 15)}
          displayCount={15}
          onLoadMore={() => {}}
          hasMore={false}
          columns={3}
        />
        
        <div className="flex justify-center mt-6 sm:mt-8">
          <Button
            onClick={() => setIsGalleryOverlayOpen(true)}
            className={"px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg " + styles.viewAllButton}
          >
            View All Designs
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGeneratorControlsSection = () => (
    <>
      <div className="mt-[180px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
        <CarouselPanel
          styles={tattooStyles}
          placements={tattooPlacements}
          selectedStyle={selectedStyle}
          selectedPlacement={selectedPlacement}
          selectedSize={selectedSize}
          selectedColorPreference={selectedColorPreference}
          onSelectStyle={setSelectedStyle}
          onSelectPlacement={setSelectedPlacement}
          onSelectSize={setSelectedSize}
          onSelectColorPreference={setSelectedColorPreference}
        />
      </div>

      <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px] space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] sm:gap-[80px] md:gap-[100px] lg:gap-8 pt-4 md:pt-6">
          <div>
            <MoodSelector
              moods={filteredMoods}
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
              title={getMoodTitle()}
            />
          </div>
        </div>
      </div>

      <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] sm:gap-[80px] md:gap-[100px] lg:gap-12 items-start">
          <div className="flex flex-col order-2 lg:order-1">
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
          
          <div className="flex flex-col order-1 lg:order-2">
            <h2 className={"text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2 " + styles.titleShadow}>
              {sectionHeadings.aspectRatio.title}
            </h2>
            <AspectRatio 
              aspectRatios={PLACEHOLDER_ASPECT_RATIOS}
              selectedAspectRatio={selectedAspectRatio}
              onSelectAspectRatio={setSelectedAspectRatio}
            />
          </div>
        </div>
      </div>

      <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
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

      <div className="flex flex-col items-center pt-[80px] sm:pt-[100px] md:pt-[120px] pr-[0px] pb-[0px] pl-[0px] mt-[0px] mr-[0px] mb-[10px] ml-[0px]">
        <Gen1Results 
          onClick={handleGenerate}
          isGenerating={generating}
          errorMessage={validationError}
        />
      </div>
    </>
  );

  const renderResultsSection = () => (
    <>
      <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px] pb-8 md:pb-12">
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
    </>
  );

  return (
    <>
      <div className="w-full overflow-x-hidden">
        {renderHeroSection()}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-4 sm:gap-6 md:gap-8 py-12 sm:py-16 md:py-20 lg:py-0 bg-background">
          <div 
            className={`space-y-8 md:space-y-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:pt-[120px] pb-12 px-4 md:px-6 lg:pl-2.5 lg:pr-4 ${styles.leftPanelNoScrollbar}`}>
            
            {renderIntroSection()}

            {renderLiveTheMagicSection()}

            <div className="mt-[70px] md:mt-[90px]">
              <HowItWorksTimeline />
            </div>

            <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <SocialProof />
            </div>

            <div className="mt-[130px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <Pricing onNavigate={onNavigate} />
            </div>

            {renderGeneratorControlsSection()}

            {renderResultsSection()}

            <div className="hidden lg:block mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <div className={`relative overflow-hidden rounded-t-[40px] border-t-4 ${styles.footerTopShadow}`}>
                <Footer onNavigate={onNavigate} />
              </div>
            </div>

          </div>

          <GeneratorSidebar>
            <>
            </>
          </GeneratorSidebar>
        </div>

        <div className={`lg:hidden w-full ${styles.mobileFooterWrapper}`}>
          <div className={`relative overflow-hidden rounded-t-[32px] sm:rounded-t-[40px] border-t-4 w-full ${styles.footerTopShadow}`}>
            <Footer onNavigate={onNavigate} />
          </div>
        </div>
      </div>
      
      <FullScreenGalleryOverlay
        isOpen={isGalleryOverlayOpen}
        onClose={() => setIsGalleryOverlayOpen(false)}
        designs={allGalleryDesigns}
      />
    </>
  );
}