/**
 * DYNAMIC QUESTIONS HOOK
 * Fetches questions from backend API or falls back to data file
 * 
 * This hook loads generator questions dynamically from:
 * 1. Backend API (if configured)
 * 2. Fallback to frontend data file
 */

import { useState, useEffect } from 'react';
import { tatttyQuestions, type TatttyQuestion } from '../data/field-labels';

interface UseDynamicQuestionsOptions {
  generatorType: 'tattty' | 'freestyle';
  language?: string;
  enableBackend?: boolean; // Set to true to fetch from backend
}

interface UseDynamicQuestionsResult {
  questions: TatttyQuestion[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// BACKEND API CONFIGURATION
// TODO: Replace with your actual backend URL
const BACKEND_API_URL = import.meta.env?.VITE_BACKEND_API_URL || 'http://localhost:8000';
const QUESTIONS_ENDPOINT = '/api/generator-questions';

/**
 * Fetch questions from backend API
 */
async function fetchQuestionsFromBackend(
  generatorType: string,
  language: string
): Promise<TatttyQuestion[]> {
  const url = `${BACKEND_API_URL}${QUESTIONS_ENDPOINT}?generator=${generatorType}&language=${language}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(5000), // 5 second timeout
  });

  if (!response.ok) {
    throw new Error(`Backend error: HTTP ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.questions || !Array.isArray(data.questions)) {
    throw new Error('Backend error: Invalid response format - missing questions array');
  }

  return data.questions;
}

/**
 * Hook to load dynamic questions
 * 
 * @param options Configuration options
 * @returns Questions data with loading state
 * 
 * @example
 * ```tsx
 * // Load from backend
 * const { questions, isLoading } = useDynamicQuestions({
 *   generatorType: 'tattty',
 *   enableBackend: true
 * });
 * 
 * // Load from data file only
 * const { questions } = useDynamicQuestions({
 *   generatorType: 'tattty',
 *   enableBackend: false
 * });
 * ```
 */
export function useDynamicQuestions(
  options: UseDynamicQuestionsOptions
): UseDynamicQuestionsResult {
  const {
    generatorType,
    language = 'en',
    enableBackend = false, // Default: use frontend data
  } = options;

  const [questions, setQuestions] = useState<TatttyQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    // For non-tattty generators, return empty array (they don't use questions)
    if (generatorType !== 'tattty') {
      setQuestions([]);
      return;
    }

    // If backend is disabled, use frontend data immediately
    if (!enableBackend) {
      setQuestions(tatttyQuestions);
      return;
    }

    // Fetch from backend
    let cancelled = false;

    async function loadQuestions() {
      setIsLoading(true);
      setError(null);

      try {
        const backendQuestions = await fetchQuestionsFromBackend(generatorType, language);
        
        if (!cancelled) {
          setQuestions(backendQuestions);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load questions';
          console.error('Failed to load questions from backend:', errorMessage);
          
          // FALLBACK: Use frontend data if backend fails
          console.warn('Falling back to frontend question data');
          setQuestions(tatttyQuestions);
          setError(errorMessage);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [generatorType, language, enableBackend, fetchTrigger]);

  const refetch = () => {
    setFetchTrigger(prev => prev + 1);
  };

  return {
    questions,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Get single question by order number
 */
export function useQuestion(
  generatorType: 'tattty' | 'freestyle',
  order: number,
  options?: { enableBackend?: boolean; language?: string }
): TatttyQuestion | null {
  const { questions } = useDynamicQuestions({
    generatorType,
    ...options,
  });

  return questions.find(q => q.order === order) || null;
}
