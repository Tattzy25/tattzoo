// Utilities for persisting user input across auth flows

interface SourceCardInput {
  inputTitle: string;
  questionTitle: string;
  timestamp: number;
}

interface GeneratorState {
  selectedStyle: string | null;
  selectedPlacement: string | null;
  selectedSize: string | null;
  selectedColorPreference: string | null;
  selectedMood: string | null;
  selectedSkintone: number;
  timestamp: number;
}

const SOURCE_CARD_KEY = 'tattty_source_card_input';
const GENERATOR_STATE_KEY = 'tattty_generator_state';

// Source Card persistence
export function saveSourceCardInput(inputTitle: string, questionTitle: string): void {
  try {
    const input: SourceCardInput = {
      inputTitle,
      questionTitle,
      timestamp: Date.now(),
    };
    localStorage.setItem(SOURCE_CARD_KEY, JSON.stringify(input));
  } catch (error) {
    console.error('Failed to save source card input:', error);
  }
}

export function getSourceCardInput(): SourceCardInput | null {
  try {
    const stored = localStorage.getItem(SOURCE_CARD_KEY);
    if (!stored) return null;

    const input: SourceCardInput = JSON.parse(stored);
    
    // Check if input is older than 24 hours
    const isExpired = Date.now() - input.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      clearSourceCardInput();
      return null;
    }

    return input;
  } catch (error) {
    console.error('Failed to retrieve source card input:', error);
    return null;
  }
}

export function clearSourceCardInput(): void {
  localStorage.removeItem(SOURCE_CARD_KEY);
}

// Complete Generator State persistence
export async function saveGeneratorState(
  selectedStyle: string | null,
  selectedPlacement: string | null,
  selectedSize: string | null,
  selectedColorPreference: string | null,
  selectedMood: string | null,
  selectedSkintone: number,
): Promise<void> {
  try {
    const state: GeneratorState = {
      selectedStyle,
      selectedPlacement,
      selectedSize,
      selectedColorPreference,
      selectedMood,
      selectedSkintone,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(GENERATOR_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save generator state:', error);
  }
}

export function getGeneratorState(): GeneratorState | null {
  try {
    const stored = localStorage.getItem(GENERATOR_STATE_KEY);
    if (!stored) return null;

    const state: GeneratorState = JSON.parse(stored);
    
    // Check if state is older than 24 hours
    const isExpired = Date.now() - state.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      clearGeneratorState();
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to retrieve generator state:', error);
    return null;
  }
}

export function clearGeneratorState(): void {
  localStorage.removeItem(GENERATOR_STATE_KEY);
}
