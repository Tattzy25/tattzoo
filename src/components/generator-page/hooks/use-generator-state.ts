import { useState, useEffect } from 'react';
import { useGenerator } from '../../../contexts/GeneratorContext';
import { useLicense } from '../../../contexts/LicenseContext';
import { getGeneratorState, clearGeneratorState } from '../../../utils/inputPersistence';
import { sessionDataStore } from '../../../services/submissionService';
import { DEFAULT_VALUES } from '../constants';
import { logSelection } from '../utilities';

export const useGeneratorState = () => {
  const generator = useGenerator();
  const license = useLicense();

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedColorPreference, setSelectedColorPreference] = useState<string>(DEFAULT_VALUES.COLOR);
  const [selectedStyle, setSelectedStyle] = useState<string>(DEFAULT_VALUES.STYLE);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>(DEFAULT_VALUES.MOOD);
  const [moodSearchQuery, setMoodSearchQuery] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>(DEFAULT_VALUES.ASPECT_RATIO);
  const [isGalleryOverlayOpen, setIsGalleryOverlayOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const setters = {
    setSelectedStyle: (style: string | null) => {
      logSelection('style', style);
      setSelectedStyle(style || DEFAULT_VALUES.STYLE);
    },

    setSelectedColorPreference: (color: string | null) => {
      logSelection('color', color);
      setSelectedColorPreference(color || DEFAULT_VALUES.COLOR);
    },

    setSelectedPlacement: (placement: string | null) => {
      logSelection('placement', placement);
      setSelectedPlacement(placement);
    },

    setSelectedSize: (size: string | null) => {
      logSelection('size', size);
      setSelectedSize(size);
    },

    setSelectedMood: (mood: string | null) => {
      logSelection('mood', mood);
      setSelectedMood(mood || DEFAULT_VALUES.MOOD);
    },

    setSelectedAspectRatio: (ratio: string | null) => {
      logSelection('aspectRatio', ratio);
      setSelectedAspectRatio(ratio || DEFAULT_VALUES.ASPECT_RATIO);
    },
  };

  // Effects for updating generator context
  useEffect(() => {
    console.log('✅ Initial defaults set:');
    console.log('  - Style:', selectedStyle);
    console.log('  - Color:', selectedColorPreference);
    console.log('  - Mood:', selectedMood);
    console.log('  - Aspect Ratio:', selectedAspectRatio);
    console.log('  - Model:', generator.selectedModel);
  }, []);

  // Restore saved state
  useEffect(() => {
    const savedState = getGeneratorState();
    if (savedState) {
      setters.setSelectedStyle(savedState.selectedStyle);
      setters.setSelectedPlacement(savedState.selectedPlacement);
      setters.setSelectedSize(savedState.selectedSize);
      setters.setSelectedColorPreference(savedState.selectedColorPreference);
      setters.setSelectedMood(savedState.selectedMood);

      clearGeneratorState();

      console.log('Your design is being generated! All your selections have been restored');
    }
  }, []);

  return {
    // State
    generating,
    generated,
    generatedImage,
    selectedColorPreference,
    selectedStyle,
    selectedSize,
    selectedPlacement,
    selectedMood,
    moodSearchQuery,
    selectedAspectRatio,
    isGalleryOverlayOpen,
    validationError,

    // Setters
    setGenerating,
    setGenerated,
    setGeneratedImage,
    setMoodSearchQuery,
    setIsGalleryOverlayOpen,
    setValidationError,

    // Context
    generator,
    license,

    // Helper setters
    ...setters,
  };
};