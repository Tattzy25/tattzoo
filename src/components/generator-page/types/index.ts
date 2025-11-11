export interface GeneratorPageProps {
  onNavigate: (page: string) => void;
}

export interface GeneratorState {
  selectedStyle: string;
  selectedPlacement: string | null;
  selectedSize: string | null;
  selectedColorPreference: string;
  selectedMood: string;
}

export interface GenerationParams {
  license_key: string;
  email: string;
  question1: string;
  question2: string;
  tattoo_style: string;
  color_preference: string;
  mood: string;
  placement: string;
  size: string;
  aspect_ratio: string;
  model: string;
  skin_tone_label?: string;
  skin_tone_hex?: string;
  skin_tone_rgb?: string;
}