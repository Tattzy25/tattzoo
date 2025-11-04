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
  SkintonePicker,
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
import heroBackground from 'figma:asset/f1e905eeec2209fc44a6e8116683d1e15b57433e.png';
import { 
  galleryDesigns,
  tattooStyles,
  tattooPlacements,
  homePageStats,
  sectionHeadings
} from '../data';

interface GeneratorPageProps {
  onNavigate: (page: string) => void;
}

export function GeneratorPage({ onNavigate }: GeneratorPageProps) {
  const generator = useGenerator();
  
  // Use gallery designs from data folder
  const allGalleryDesigns = galleryDesigns;
  
  // TODO: When connecting to database, replace PLACEHOLDER_MOODS and PLACEHOLDER_ASPECT_RATIOS with state:
  // const [moods, setMoods] = useState<Mood[]>([]);
  // const [aspectRatios, setAspectRatios] = useState<AspectRatioOption[]>([]);
  // useEffect(() => {
  //   fetchMoodsFromDatabase().then(setMoods);
  //   fetchAspectRatiosFromDatabase().then(setAspectRatios);
  // }, []);
  // Then pass these as props instead of the PLACEHOLDER constants
  
  const [story, setStory] = useState('');
  const [style, setStyle] = useState('traditional');
  const [complexity, setComplexity] = useState([50]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null); // Store the single generated image
  // Default fallbacks: Style='Traditional', Color='Black & Grey' for TaTTTy AI generator
  const [selectedColorPreference, setSelectedColorPreferenceState] = useState<string>('Black & Grey');
  const [selectedStyle, setSelectedStyleState] = useState<string>('Traditional');
  const [selectedSize, setSelectedSizeState] = useState<string | null>(null);
  const [selectedPlacement, setSelectedPlacementState] = useState<string | null>(null);
  const [selectedMood, setSelectedMoodState] = useState<string>('happy');
  const [selectedSkintone, setSelectedSkintoneState] = useState<string>('#D7BD96'); // Default to Medium Tan
  const [moodSearchQuery, setMoodSearchQuery] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatioState] = useState<string>('1:1'); // Default to square (1:1)
  const [isGalleryOverlayOpen, setIsGalleryOverlayOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Wrapper functions with logging
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
  
  const setSelectedSkintone = (skintone: string) => {
    console.log('👤 Skintone selected:', skintone);
    setSelectedSkintoneState(skintone);
  };
  
  const setSelectedAspectRatio = (ratio: string | null) => {
    console.log('📐 Aspect ratio selected:', ratio);
    setSelectedAspectRatioState(ratio || '1:1');
  };
  
  // Log initial defaults on mount
  useEffect(() => {
    console.log('✅ Initial defaults set:');
    console.log('  - Style:', selectedStyle);
    console.log('  - Color:', selectedColorPreference);
    console.log('  - Mood:', selectedMood);
    console.log('  - Skintone:', selectedSkintone);
    console.log('  - Aspect Ratio:', selectedAspectRatio);
    console.log('  - Model:', generator.selectedModel);
  }, []);
  
  // Sync local state with generator context
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
    generator.updateSkintone(selectedSkintone);
  }, [selectedSkintone]);

  // Restore saved generator state on mount
  useEffect(() => {
    const savedState = getGeneratorState();
    if (savedState) {
      // Restore all generator state
      setSelectedStyle(savedState.selectedStyle);
      setSelectedPlacement(savedState.selectedPlacement);
      setSelectedSize(savedState.selectedSize);
      setSelectedColorPreference(savedState.selectedColorPreference);
      setSelectedMood(savedState.selectedMood);
      setSelectedSkintone(savedState.selectedSkintone);
      
      // Clear saved state after restoring
      clearGeneratorState();
      
      console.log('Your design is being generated! All your selections have been restored');
      
      // Trigger generation
      setTimeout(() => {
        handleGenerate();
      }, 500);
    }
  }, []);

  const handleGenerate = async () => {
    // VALIDATION - TaTTTy AI requirements
    const savedData = sessionDataStore.getSourceCardData();
    
    // TATTTY Requirements:
    // - Question 1: REQUIRED, minimum 50 characters
    // - Question 2: REQUIRED, minimum 50 characters
    // - Style: REQUIRED (fallback to Traditional)
    // - Color: REQUIRED (fallback to Black & Grey)
    // - Mood: REQUIRED (fallback to Happy)
    
    const q1Answer = savedData?.question1?.answer || '';
    const q2Answer = savedData?.question2?.answer || '';
    
    if (q1Answer.trim().length < 50 || q2Answer.trim().length < 50) {
      console.error('❌ TATTTY requires both questions with minimum 50 characters each');
      setValidationError('Click Submit First!');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }
    
    // Clear validation error if it was set
    setValidationError(null);
    
    // Apply defaults for TaTTTy generator
    const finalStyle = selectedStyle || 'Traditional';
    const finalColor = selectedColorPreference || 'Black & Grey';
    const finalMood = selectedMood || 'happy';
    
    // Store options in session (questions already stored via SourceCard)
    sessionDataStore.setOptions({
      style: finalStyle,
      color: finalColor,
      mood: finalMood,
      placement: selectedPlacement,
      size: selectedSize,
      skintone: selectedSkintone,
      aspectRatio: selectedAspectRatio,
      model: generator.selectedModel
    });
    
    // Log what will be used for generation
    console.log('🎨 Generating tattoo with:', {
      // THE CORE CONTENT (with full question/answer context)
      question1: savedData?.question1,
      question2: savedData?.question2,
      images: savedData?.images?.length || 0,
      
      // OPTIONS
      style: finalStyle,
      color: finalColor,
      mood: finalMood,
      placement: selectedPlacement || 'Not specified',
      size: selectedSize || 'Not specified',
      skintone: selectedSkintone,
      aspectRatio: selectedAspectRatio,
      model: generator.selectedModel
    });
    
    setGenerating(true);
    
    // Simulate AI generation with realistic delay and potential failure
    setTimeout(() => {
      // Simulate 10% chance of failure to test error logging
      const shouldFail = Math.random() < 0.1;
      
      if (shouldFail) {
        setGenerating(false);
        setGenerated(false);
        setGeneratedImage(null);
        // TODO: Show user-friendly error popup here (not toast)
        console.error('Generation timed out. Please try again.');
      } else {
        setGenerating(false);
        setGenerated(true);
        
        // TODO: Replace with actual generated image URL from backend
        // CRITICAL: Backend MUST return PNG with transparent background (no white/colored background)
        // See /IMAGE_TRANSPARENCY_REQUIREMENTS.md for complete requirements
        // For now, generate a mock transparent PNG data URL for testing AR functionality
        // When backend is connected: setGeneratedImage(response.imageDataUrl);
        
        // Create a transparent PNG tattoo mock (tribal-style design)
        const mockCanvas = document.createElement('canvas');
        mockCanvas.width = 512;
        mockCanvas.height = 512;
        const ctx = mockCanvas.getContext('2d');
        if (ctx) {
          // Draw a tribal/tattoo-style design with transparent background
          ctx.fillStyle = '#000000';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 8;
          
          // Draw a simple tribal heart/spade shape
          ctx.beginPath();
          ctx.moveTo(256, 400);
          // Left curve
          ctx.bezierCurveTo(150, 350, 100, 250, 150, 150);
          ctx.bezierCurveTo(180, 100, 230, 100, 256, 140);
          // Right curve
          ctx.bezierCurveTo(282, 100, 332, 100, 362, 150);
          ctx.bezierCurveTo(412, 250, 362, 350, 256, 400);
          ctx.closePath();
          ctx.fill();
          
          // Add some tribal details
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

  // Use styles and placements from data folder
  const styles = tattooStyles;
  const placements = tattooPlacements;

  // TODO: Replace PLACEHOLDER_MOODS with database call when backend is connected
  // Example: const [moods, setMoods] = useState<Mood[]>([]);
  // useEffect(() => { fetchMoodsFromDatabase().then(setMoods); }, []);
  
  // Filter moods based on mood search query
  const filteredMoods = PLACEHOLDER_MOODS.filter(mood =>
    mood.label.toLowerCase().includes(moodSearchQuery.toLowerCase())
  );



  const getMoodTitle = () => {
    return 'Set Your Mood';
  };

  return (
    <>
      <div className="w-full overflow-x-hidden">
        {/* Full Edge-to-Edge Hero Section */}
        <section className="relative min-h-[60vh] md:min-h-[75vh] lg:min-h-[calc(90vh+55px)] flex items-center justify-center overflow-hidden rounded-b-[40px] md:rounded-b-[70px] lg:rounded-b-[100px] border-b-4" style={{ borderColor: '#57f1d6', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)' }}>
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

        {/* Main Content Area with Sidebar - Sticky Independent Scrolling */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-4 sm:gap-6 md:gap-8 py-12 sm:py-16 md:py-20 lg:py-0 bg-background">
          {/* Left Panel - Independent Scrolling */}
          <div 
            className="space-y-8 md:space-y-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:pt-[120px] pb-12 px-4 md:px-6 lg:pl-2.5 lg:pr-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {/* Your Story | Your Pain | Into Ink */}
            <div>
              <div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 lg:gap-12 items-center justify-items-center justify-center">
                  <StyledPhrase line1="Your" line2="Story" />
                  <StyledPhrase line1="Your" line2="Pain" />
                  <StyledPhrase line1="Into" line2="Ink" />
                </div>
              </div>

              {/* Stats Section */}
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

            {/* Live the Magic Gallery Section */}
            <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <div className="w-full px-4 md:px-8 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
                <div className="text-center space-y-3 sm:space-y-4">
                  <h2 
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white"
                    style={{ 
                      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', 
                      letterSpacing: '4px' 
                    }}
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
                
                {/* View All Button */}
                <div className="flex justify-center mt-6 sm:mt-8">
                  <Button
                    onClick={() => setIsGalleryOverlayOpen(true)}
                    className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
                    style={{
                      backgroundColor: '#57f1d6',
                      color: '#0C0C0D',
                      borderRadius: '12px',
                      boxShadow: '0 0 30px rgba(87, 241, 214, 0.4)',
                    }}
                  >
                    View All Designs
                  </Button>
                </div>
              </div>
            </div>

            {/* How It Works Timeline */}
            <div className="mt-[70px] md:mt-[90px]">
              <HowItWorksTimeline />
            </div>

            {/* Social Proof Section */}
            <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <SocialProof />
            </div>

            {/* Pricing Section */}
            <div className="mt-[130px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <Pricing onNavigate={onNavigate} />
            </div>

            {/* Carousel Panel Section */}
            <div className="mt-[180px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <CarouselPanel
                styles={styles}
                placements={placements}
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

            {/* Mood & Skintone Section - Mobile First, Responsive */}
            <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px] space-y-6 md:space-y-8">
              {/* Mood & Skintone Grid - Stacked on mobile, Side by side on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] sm:gap-[80px] md:gap-[100px] lg:gap-8 pt-4 md:pt-6">
                {/* Mood Selector */}
                <div>
                  <MoodSelector
                    moods={filteredMoods}
                    selectedMood={selectedMood}
                    onSelectMood={setSelectedMood}
                    title={getMoodTitle()}
                  />
                </div>

                {/* Skintone Picker */}
                <div>
                  <SkintonePicker
                    selectedSkintone={selectedSkintone}
                    onSelectSkintone={setSelectedSkintone}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload & Questions Cards - Side by side */}
            <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] sm:gap-[80px] md:gap-[100px] lg:gap-12 items-start">
                {/* Questions Card - SourceCard for TATTTY */}
                <div className="flex flex-col order-2 lg:order-1">
                  {/* External Title */}
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', letterSpacing: '4px' }}>
                    {sectionHeadings.yourStory.title.split('\n').map((line, i) => (
                      <span key={i} className="text-[48px]">
                        {line}
                        {i < sectionHeadings.yourStory.title.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </h2>
                  <SourceCard />
                </div>
                
                {/* AspectRatio Card */}
                <div className="flex flex-col order-1 lg:order-2">
                  {/* External Title */}
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', letterSpacing: '4px' }}>
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

            {/* Model Quality Selector */}
            <div className="mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', letterSpacing: '4px' }}>
                {sectionHeadings.chooseYourVibe.title}
              </h2>
              <div className="max-w-2xl mx-auto px-4">
                <ModelPicker
                  selectedModel={generator.selectedModel}
                  onModelChange={generator.setSelectedModel}
                />
              </div>
            </div>

            {/* Generator Page Generate Button */}
            <div className="flex flex-col items-center pt-[80px] sm:pt-[100px] md:pt-[120px] pr-[0px] pb-[0px] pl-[0px] mt-[0px] mr-[0px] mb-[10px] ml-[0px]">
              <Gen1Results 
                onClick={handleGenerate}
                isGenerating={generating}
                errorMessage={validationError}
              />
            </div>

            {/* Results Card - Always Visible (with integrated Generate button) */}
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

            {/* Try It On Button - Only show if generated AND not currently generating */}
            {generated && generatedImage && !generating && (
              <div className="mt-6 sm:mt-8 md:mt-12 pb-8 md:pb-12">
                <TryItOnButton 
                  imageDataUrl={generatedImage}
                />
              </div>
            )}

            {/* Footer - Desktop Only (Left Side Only) */}
            <div className="hidden lg:block mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
              <div className="relative overflow-hidden rounded-t-[40px] border-t-4" style={{ borderColor: '#57f1d6', boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.8)' }}>
                <Footer onNavigate={onNavigate} />
              </div>
            </div>

          </div>

          {/* Right Sidebar - Independently Scrollable on Desktop, Part of Page Flow on Mobile */}
          <GeneratorSidebar>
          </GeneratorSidebar>
        </div>

        {/* Footer - Mobile Only (Full Width, After All Content) */}
        <div className="lg:hidden w-full" style={{ marginTop: '80px' }}>
          <div className="relative overflow-hidden rounded-t-[32px] sm:rounded-t-[40px] border-t-4 w-full" style={{ borderColor: '#57f1d6', boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.8)' }}>
            <Footer onNavigate={onNavigate} />
          </div>
        </div>
      </div>
      
      {/* Full Screen Gallery Overlay - Rendered at root level to cover everything */}
      <FullScreenGalleryOverlay
        isOpen={isGalleryOverlayOpen}
        onClose={() => setIsGalleryOverlayOpen(false)}
        designs={allGalleryDesigns}
      />
    </>
  );
}
