import { GenerationParams } from '../types';

export const createGenerationFormData = (params: GenerationParams): FormData => {
  const formData = new FormData();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return formData;
};

export const getMoodTitle = (): string => {
  return 'Set Your Mood';
};

export const filterMoods = (moods: any[], searchQuery: string) => {
  return moods.filter(mood =>
    mood.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const logGenerationParams = (params: Partial<GenerationParams>) => {
  console.log('🎨 Generating tattoo with:', params);
};

export const logSelection = (type: string, value: any) => {
  const emojis: Record<string, string> = {
    style: '🎨',
    color: '🎨',
    placement: '📍',
    size: '📏',
    mood: '😊',
    aspectRatio: '📐',
  };

  console.log(`${emojis[type] || '📝'} ${type} selected:`, value);
};