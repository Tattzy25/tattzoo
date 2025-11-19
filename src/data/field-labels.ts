/**
 * FIELD LABELS DATA - DYNAMIC & CMS-READY
 * All labels for form fields across the application
 * 
 * STRUCTURE:
 * - Questions are now DYNAMIC and configurable
 * - Can be replaced with CMS/database call for multi-language support
 * - Questions are stored in order with metadata for rendering
 * 
 * TODO: Replace with CMS/database call
 * Example: const { data } = await supabase.from('generator_questions').select('*').eq('generator_type', 'tattty').eq('language', 'en');
 */

/**
 * TaTTTy Generator Questions - DYNAMIC CONFIGURATION
 * 
 * These are the two questions shown in TaTTTy AI generator
 * Can be modified here or loaded from database
 */
export interface TatttyQuestion {
  id: string;
  order: number;
  label: string;
  placeholder: string;
  helpText?: string;
  required: boolean;
  minCharacters: number;
  maxCharacters?: number;
}

export const tatttyQuestions: TatttyQuestion[] = [
  {
    id: 'question_one',
    order: 1,
    label: 'What decision of yours do you wish had been reviewed by an impartial panel?',
    placeholder: 'Type your answer...',
    helpText: 'Reflect on a decision you made that could have benefited from external review',
    required: true,
    minCharacters: 50,
    
  },
  {
    id: 'question_two',
    order: 2,
    label: 'What is one rule you enforced that you would not enforce today?',
    placeholder: 'Type your answer...',
    helpText: 'Think about rules or policies you once upheld but now question',
    required: true,
    minCharacters: 50,
    
  },
];

/**
 * Legacy SourceCard Labels (for backward compatibility)
 * DEPRECATED: Use tatttyQuestions instead
 */
export const sourceCardLabels = {
  question1: tatttyQuestions[0].label,
  question2: tatttyQuestions[1].label,
  placeholder: tatttyQuestions[0].placeholder,
} as const;

/**
 * Placeholder Text Configuration
 */
export const placeholderText = {
  tattty: tatttyQuestions[0].placeholder,
  general: 'Enter text...',
} as const;

/**
 * Helper Functions for Dynamic Questions
 */

/**
 * Get question by order number (1-based)
 */
export function getTatttyQuestion(order: number): TatttyQuestion | undefined {
  return tatttyQuestions.find(q => q.order === order);
}

/**
 * Get question by ID
 */
export function getTatttyQuestionById(id: string): TatttyQuestion | undefined {
  return tatttyQuestions.find(q => q.id === id);
}

/**
 * Get all questions sorted by order
 */
export function getAllTatttyQuestions(): TatttyQuestion[] {
  return [...tatttyQuestions].sort((a, b) => a.order - b.order);
}

/**
 * Validate question input
 */
export function validateTatttyQuestion(questionId: string, value: string): {
  isValid: boolean;
  error?: string;
} {
  const question = getTatttyQuestionById(questionId);
  
  if (!question) {
    return { isValid: false, error: 'Invalid question ID' };
  }
  
  if (question.required && !value.trim()) {
    return { isValid: false, error: `Answer is required` };
  }
  
  if (value.trim().length < question.minCharacters) {
    return { 
      isValid: false, 
      error: `Please enter at least ${question.minCharacters} characters` 
    };
  }
  
  // Max length validation disabled per UX requirement
  
  return { isValid: true };
}
