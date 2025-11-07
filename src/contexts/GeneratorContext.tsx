import { createContext, useContext, useState, ReactNode } from 'react';
import { generateMockTattooImage, generateMockVariations } from '../utils/mockDataGenerator';
import { saveGenerationToHistory, saveRecentPrompt } from '../utils/localStorageManager';
import type { ModelType } from '../components/shared/ModelPicker';
import { useLicense } from './LicenseContext';

export interface GeneratorSelections {
  // Carousel selections
  style: string | null;
  placement: string | null;
  size: string | null;
  color: string | null;
  mood: string | null;
  
  // Text inputs (stored when user clicks Save)
  textInputs: {
    [key: string]: string; // key is the generator type, value is the saved text
  };
  
  // Images (for TaTTTy AI)
  images: File[];
}

interface GeneratorContextType {
  // Selection state
  selections: GeneratorSelections;
  updateStyle: (style: string | null) => void;
  updatePlacement: (placement: string | null) => void;
  updateSize: (size: string | null) => void;
  updateColor: (color: string | null) => void;
  updateMood: (mood: string | null) => void;
  saveTextInput: (generatorType: string, text: string) => void;
  updateImages: (images: File[]) => void;
  clearAll: () => void;
  getSelections: () => GeneratorSelections;
  
  // Generation state
  isGenerating: boolean;
  generatedDesigns: string[];
  generationError: string | null;
  
  // Model selection
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  
  // Generate function - THE MAIN EVENT HANDLER
  handleGenerate: () => Promise<void>;
  
  // Variations
  generateVariations: (count: number) => Promise<void>;
}

const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

const initialSelections: GeneratorSelections = {
  style: null,
  placement: null,
  size: null,
  color: null,
  mood: null,
  textInputs: {},
  images: [],
};

export function GeneratorProvider({ children }: { children: ReactNode }) {
  // License context
  const { isVerified, canGenerate, trackGeneration, getRemainingGenerations, getResetTime } = useLicense();
  
  // Selection state
  const [selections, setSelections] = useState<GeneratorSelections>(initialSelections);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Model selection - Default to Quality model
  const [selectedModel, setSelectedModelState] = useState<ModelType>('sd3.5-large');
  
  const setSelectedModel = (model: ModelType) => {
    console.log('⚡ Model selected:', model);
    setSelectedModelState(model);
  };

  // Selection update functions
  const updateStyle = (style: string | null) => {
    console.log('🎨 Style selected:', style);
    setSelections(prev => ({ ...prev, style }));
  };

  const updatePlacement = (placement: string | null) => {
    console.log('📍 Placement selected:', placement);
    setSelections(prev => ({ ...prev, placement }));
  };

  const updateSize = (size: string | null) => {
    console.log('📏 Size selected:', size);
    setSelections(prev => ({ ...prev, size }));
  };

  const updateColor = (color: string | null) => {
    console.log('🎨 Color selected:', color);
    setSelections(prev => ({ ...prev, color }));
  };

  const updateMood = (mood: string | null) => {
    console.log('😊 Mood selected:', mood);
    setSelections(prev => ({ ...prev, mood }));
  };

  const saveTextInput = (generatorType: string, text: string) => {
    console.log(`💬 Text input saved for ${generatorType}:`, text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    setSelections(prev => ({
      ...prev,
      textInputs: {
        ...prev.textInputs,
        [generatorType]: text,
      },
    }));
  };

  const updateImages = (images: File[]) => {
    console.log(`📸 Images updated in GeneratorContext: ${images.length} file(s)`);
    setSelections(prev => ({ ...prev, images }));
  };

  const clearAll = () => {
    setSelections(initialSelections);
    setGeneratedDesigns([]);
    setGenerationError(null);
  };

  const getSelections = () => selections;

  /**
   * MAIN GENERATE HANDLER - Called when user clicks Generate button
   * 
   * This function:
   * 1. Collects all current UI input values & VALIDATES
   * 2. Sets loading state
   * 3. Calls mock generation function (NO BACKEND)
   * 4. Updates UI with results
   * 5. Handles errors gracefully
   */
  const handleGenerate = async () => {
    try {
      // 0. CHECK LICENSE VERIFICATION & RATE LIMIT
      if (!isVerified) {
        setGenerationError('🔒 Please enter your license key to generate designs.');
        return;
      }

      if (!canGenerate()) {
        const resetTime = getResetTime();
        const remaining = getRemainingGenerations();
        const timeLeft = resetTime ? Math.ceil((resetTime.getTime() - Date.now()) / 60000) : 0;
        
        setGenerationError(`⏳ Rate limit reached (${remaining}/3 remaining). Try again in ${timeLeft} minute${timeLeft !== 1 ? 's' : ''}.`);
        return;
      }
      
      // 1. COLLECT ALL INPUT VALUES & VALIDATE
      const prompt = selections.textInputs['tattty'] || '';
      
      // VALIDATION - TaTTTy AI Requirements:
      // - Text: REQUIRED, minimum 50 characters (combined Q1 + Q2)
      // - Style: REQUIRED (fallback to Traditional)
      // - Color: REQUIRED (fallback to Black & Grey)
      // - Mood: REQUIRED (fallback to Happy)
      // - Images: OPTIONAL
      
      if (prompt.trim().length < 50) {
        console.error('❌ TATTTY requires minimum 50 characters total');
        setGenerationError('Please enter at least 50 characters in your story.');
        return;
      }
      
      // 2. SET LOADING STATE
      setIsGenerating(true);
      setGenerationError(null);
      setGeneratedDesigns([]); // Clear previous results
      
      console.log('🎨 Generating tattoo design with selections:', {
        prompt,
        model: selectedModel,
        ...selections
      });
      
      // 3. CONSTRUCT COMPLETE PAYLOAD
      // Apply default fallbacks for TaTTTy AI generator
      const finalStyle = selections.style || 'Traditional';
      const finalColor = selections.color || 'Black & Grey';
      const finalMood = selections.mood || 'Happy';
      
      const generationParams = {
        prompt,
        model: selectedModel,
        style: finalStyle,
        placement: selections.placement,
        size: selections.size,
        color: finalColor,
        mood: finalMood,
        images: selections.images, // Send File[] objects directly, NOT base64
        generatorType: 'tattty'
      };
      
      // 4. SEND REQUEST (MOCK - NO BACKEND)
      // TODO: When connecting to real backend, use FormData:
      // import { buildFormData } from '../utils/formDataBuilder';
      // const formData = buildFormData(generationParams);
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   body: formData
      // });
      const generatedImageUrl = await generateMockTattooImage(generationParams);
      
      // 5. PROCESS RESPONSE & UPDATE STATE
      setGeneratedDesigns([generatedImageUrl]);
      
      // 6. SAVE TO HISTORY (LOCAL STORAGE)
      saveGenerationToHistory({
        imageUrl: generatedImageUrl,
        prompt,
        params: generationParams
      });
      
      // Save prompt to recent list
      if (prompt.trim()) {
        saveRecentPrompt(prompt);
      }
      
      // 6.5. TRACK GENERATION (LICENSE USAGE)
      trackGeneration();
      
      // 7. RESET LOADING STATE & SHOW SUCCESS
      setIsGenerating(false);
      console.log('✅ Design generated! Check out your new tattoo concept');
      console.log(`📊 Generations remaining this hour: ${getRemainingGenerations()}`);
      
    } catch (error) {
      // 8. ERROR HANDLING
      console.error('Generation failed:', error);
      setIsGenerating(false);
      setGenerationError(error instanceof Error ? error.message : 'Generation failed');
      // TODO: Show user-friendly error popup here (not toast)
    }
  };

  /**
   * Generate variations of current design
   */
  const generateVariations = async (count: number = 3) => {
    if (generatedDesigns.length === 0) {
      // TODO: Show user-friendly error popup here (not toast)
      console.error('Generate a design first');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const variations = await generateMockVariations(generatedDesigns[0], count);
      setGeneratedDesigns(variations);
      
      setIsGenerating(false);
      console.log(`Generated ${count} variations!`);
    } catch (error) {
      console.error('Variation generation failed:', error);
      setIsGenerating(false);
      // TODO: Show user-friendly error popup here (not toast)
    }
  };

  return (
    <GeneratorContext.Provider
      value={{
        // Selection state
        selections,
        updateStyle,
        updatePlacement,
        updateSize,
        updateColor,
        updateMood,
        saveTextInput,
        updateImages,
        clearAll,
        getSelections,
        
        // Generation state
        isGenerating,
        generatedDesigns,
        generationError,
        
        // Model selection
        selectedModel,
        setSelectedModel,
        
        // Generation functions
        handleGenerate,
        generateVariations,
      }}
    >
      {children}
    </GeneratorContext.Provider>
  );
}

export function useGenerator() {
  const context = useContext(GeneratorContext);
  if (context === undefined) {
    throw new Error('useGenerator must be used within a GeneratorProvider');
  }
  return context;
}
