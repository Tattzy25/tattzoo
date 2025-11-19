import { GenerationService } from '../services/generation-service';
import { VALIDATION_MESSAGES, TIMEOUTS } from '../constants';
import { sessionDataStore } from '../../../services/submissionService';
import { saveGenerationToHistory, saveRecentPrompt } from '../../../utils/localStorageManager';

interface UseGenerationProps {
  license: any;
  selectedStyle: string;
  selectedColorPreference: string;
  selectedMood: string;
  selectedPlacement: string | null;
  selectedSize: string | null;
  selectedAspectRatio: string;
  generator: any;
  setGenerating: (generating: boolean) => void;
  setGenerated: (generated: boolean) => void;
  setGeneratedImage: (image: string | null) => void;
  setValidationError: (error: string | null) => void;
  onProgress?: (message: string, progress: number) => void;
}

export const useGeneration = ({
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
}: UseGenerationProps) => {

  const handleGenerate = async () => {
    const savedData = sessionDataStore.getSourceCardData();

    const q1Answer = savedData?.question1?.answer || '';
    const q2Answer = savedData?.question2?.answer || '';

    if (q1Answer.trim().length < 50 || q2Answer.trim().length < 50) {
      console.error('❌ TATTTY requires both questions with minimum 50 characters each');
      setValidationError(VALIDATION_MESSAGES.SUBMIT_FIRST);
      setTimeout(() => setValidationError(null), TIMEOUTS.VALIDATION_ERROR);
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
      placement: selectedPlacement || undefined,
      size: selectedSize || undefined,
      aspectRatio: selectedAspectRatio,
      model: generator.selectedModel
    });

    setGenerating(true);

    try {
      const result = await GenerationService.generateTattoo({
        question1: q1Answer,
        question2: q2Answer,
        tattoo_style: finalStyle,
        color_preference: finalColor,
        mood: finalMood,
        placement: selectedPlacement || '',
        size: selectedSize || '',
        aspect_ratio: selectedAspectRatio,
        model: generator.selectedModel,
        images: savedData?.images,
      }, onProgress);

      const imageUrl = result?.image_url || result?.url || result?.data_url || null;
      setGeneratedImage(typeof imageUrl === 'string' ? imageUrl : null);
      setGenerating(false);
      setGenerated(true);

      // Generation success; no license tracking required

      console.log('✅ Tattoo image generated successfully');

      const enhancedPrompt = typeof result?.enhanced_prompt === 'string' ? result.enhanced_prompt : `${q1Answer}\n\n${q2Answer}`;
      saveRecentPrompt(enhancedPrompt);
      saveGenerationToHistory({
        imageUrl: typeof imageUrl === 'string' ? imageUrl : '',
        prompt: enhancedPrompt,
        params: {
          style: finalStyle,
          color: finalColor,
          mood: finalMood,
          placement: selectedPlacement || '',
          size: selectedSize || '',
          aspectRatio: selectedAspectRatio,
          model: generator.selectedModel,
          fileId: result?.file_id,
          metadata: result?.metadata,
          filename: result?.filename,
        },
      });

    } catch (error) {
      console.error('❌ Image generation failed:', error);
      setGenerating(false);
      setGenerated(false);
      setGeneratedImage(null);

      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : VALIDATION_MESSAGES.GENERATION_FAILED;
      setValidationError(errorMessage);
      setTimeout(() => setValidationError(null), 5000);
    }
  };

  return { handleGenerate };
};