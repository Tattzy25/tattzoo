import { useState, useRef, useEffect } from 'react';
import { Sparkles, Droplet, Undo2, Redo2, RotateCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { 
  askTaTTTyLabels, 
  askTaTTTyAPI,
  askTaTTTyErrors, 
  askTaTTTySizes, 
  askTaTTTyStyling, 
  askTaTTTyTimings,
  askTaTTTyValidation
} from '../../data';

interface AskTaTTTyProps {
  // Context for AI suggestions - REQUIRED (TaTTTy AI only)
  contextType?: 'tattty';
  
  // Text update callback - REQUIRED
  onTextUpdate: (updatedText: string) => void;
  
  // Get current text to optimize - REQUIRED
  getCurrentText: () => string;
  
  // Selection info (optional - defaults to no selection)
  getSelectionInfo?: () => {
    hasSelection: boolean;
    selectedText: string;
    replaceSelection: boolean;
  };
  
  // Loading state callback (optional)
  onLoadingChange?: (isLoading: boolean) => void;
  
  // External enhancement state management (optional - uses internal if not provided)
  enhancementState?: {
    hasEnhanced: boolean;
    originalText: string | null;
    isShowingOriginal?: boolean;
    onRevert: () => void;
    onReEnhance: () => void;
  };
  
  // UI customization
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AskTaTTTy({ 
  contextType,
  onTextUpdate,
  getCurrentText,
  getSelectionInfo,
  onLoadingChange,
  enhancementState,
  size = 'md',
  className = '',
}: AskTaTTTyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use external state if provided, otherwise use internal state
  const [internalOriginalText, setInternalOriginalText] = useState<string | null>(null);
  const [internalEnhancedText, setInternalEnhancedText] = useState<string | null>(null);
  const [internalHasEnhanced, setInternalHasEnhanced] = useState(false);
  const [internalIsShowingOriginal, setInternalIsShowingOriginal] = useState(false);
  
  const hasEnhanced = enhancementState?.hasEnhanced ?? internalHasEnhanced;
  const originalText = enhancementState?.originalText ?? internalOriginalText;
  const isShowingOriginal = enhancementState?.isShowingOriginal ?? internalIsShowingOriginal;
  
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Notify parent of loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Validate text before processing
  const validateText = (text: string): { isValid: boolean; error: string | null } => {
    const trimmedText = text.trim();
    
    // Check if empty
    if (!trimmedText) {
      return { isValid: false, error: askTaTTTyErrors.emptyText };
    }
    
    // Check if too short (minimum characters only)
    if (trimmedText.length < askTaTTTyValidation.minCharacters) {
      return { isValid: false, error: askTaTTTyErrors.textTooShort };
    }
    
    return { isValid: true, error: null };
  };

  // Backend streaming API call - FAILS LOUD
  const streamAIResponse = async (type: 'enhance' | 'ideas'): Promise<string> => {
    // REQUIRED: Get current text - will throw if getCurrentText not provided
    const currentText = getCurrentText();
    
    // Optional selection info
    const selectionInfo = getSelectionInfo?.() || { 
      hasSelection: false, 
      selectedText: '', 
      replaceSelection: false 
    };

    // REQUIRED: API configuration must be complete
    if (!askTaTTTyAPI.baseURL) {
      throw new Error('CRITICAL: askTaTTTyAPI.baseURL is not configured');
    }

    const endpoint = type === 'enhance' 
      ? askTaTTTyAPI.enhanceEndpoint 
      : askTaTTTyAPI.ideasEndpoint;

    if (!endpoint) {
      throw new Error(`CRITICAL: ${type} endpoint is not configured`);
    }

    const response = await fetch(`${askTaTTTyAPI.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        contextType,
        targetText: selectionInfo.hasSelection ? selectionInfo.selectedText : currentText,
        hasSelection: selectionInfo.hasSelection,
      }),
      signal: AbortSignal.timeout(askTaTTTyAPI.requestTimeout),
    });

    // FAIL LOUD: No fallbacks for errors
    if (!response.ok) {
      const errorData = await response.json();
      if (!errorData.error) {
        throw new Error(`Backend error: HTTP ${response.status} ${response.statusText} - No error message provided`);
      }
      throw new Error(errorData.error);
    }

    // REQUIRED: Content type must be present
    const contentType = response.headers.get('content-type');
    if (!contentType) {
      throw new Error('Backend error: No Content-Type header in response');
    }
    
    if (contentType.includes('text/event-stream')) {
      // Handle streaming response (Server-Sent Events)
      if (!response.body) {
        throw new Error('Backend error: No response body for SSE stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let lastUpdateTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            // FAIL LOUD: Invalid JSON must throw
            const data = JSON.parse(line.slice(6));
            
            if (data.token) {
              accumulatedText += data.token;
              
              // Throttle UI updates for performance
              const now = Date.now();
              if (now - lastUpdateTime >= askTaTTTyTimings.streamingThrottleMs) {
                onTextUpdate(accumulatedText);
                lastUpdateTime = now;
              }
            }
            
            if (data.done) {
              // Final update
              onTextUpdate(accumulatedText);
              return accumulatedText;
            }
          }
        }
      }

      // FAIL LOUD: Stream ended without done signal
      if (accumulatedText.length === 0) {
        throw new Error('Backend error: SSE stream ended with no data');
      }

      return accumulatedText;
      
    } else {
      // Handle regular JSON response (non-streaming)
      const data = await response.json();
      
      // FAIL LOUD: result field must exist
      if (!data.result) {
        throw new Error('Backend error: Response missing required "result" field');
      }
      
      onTextUpdate(data.result);
      return data.result;
    }
  };

  const handleEnhance = async () => {
    if (isLoading) return;
    
    // Get current text and validate
    const currentText = getCurrentText();
    const validation = validateText(currentText);
    
    if (!validation.isValid) {
      setError(validation.error);
      setIsOpen(false);
      // Show error permanently - user must click to clear
      return;
    }
    
    // Save original text before enhancement (only if this is the first enhancement)
    if (!hasEnhanced) {
      if (!enhancementState) {
        setInternalOriginalText(currentText);
      }
      // For external state, parent will handle storing original text
    }
    
    setIsLoading(true);
    setIsOpen(false);
    setError(null);
    
    try {
      const result = await streamAIResponse('enhance');
      
      // REQUIRED: onTextUpdate callback
      onTextUpdate(result);
      
      if (!enhancementState) {
        setInternalHasEnhanced(true);
        setInternalEnhancedText(result);
        setInternalIsShowingOriginal(false);
      }
      // For external state, parent will handle setting hasEnhanced
    } catch (error) {
      // FAIL LOUD: Re-throw error for parent to handle
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      throw error; // Let parent component handle critical failures
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = () => {
    if (enhancementState) {
      // Use external revert handler
      enhancementState.onRevert();
    } else {
      // Use internal state - toggle between original and enhanced
      if (internalIsShowingOriginal) {
        // Currently showing original, go back to enhanced
        if (!internalEnhancedText) {
          throw new Error('CRITICAL: No enhanced text stored');
        }
        onTextUpdate(internalEnhancedText);
        setInternalIsShowingOriginal(false);
      } else {
        // Currently showing enhanced, go back to original
        if (!originalText) {
          throw new Error('CRITICAL: No original text stored');
        }
        onTextUpdate(originalText);
        setInternalIsShowingOriginal(true);
      }
    }
  };

  const handleReEnhance = async () => {
    if (isLoading) return;
    
    if (enhancementState) {
      // Use external re-enhance handler
      enhancementState.onReEnhance();
    } else {
      // Use internal state
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await streamAIResponse('enhance');
        
        // REQUIRED: onTextUpdate callback
        onTextUpdate(result);
        setInternalEnhancedText(result);
        setInternalIsShowingOriginal(false);
      } catch (error) {
        // FAIL LOUD: Re-throw error for parent to handle
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        throw error; // Let parent component handle critical failures
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleIdeas = async () => {
    if (isLoading) return;
    
    // Ideas don't require text validation - they can be generated even with empty input
    setIsLoading(true);
    setIsOpen(false);
    setError(null);
    
    try {
      const result = await streamAIResponse('ideas');
      
      // REQUIRED: onTextUpdate callback
      onTextUpdate(result);
    } catch (error) {
      // FAIL LOUD: Re-throw error for parent to handle
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      throw error; // Let parent component handle critical failures
    } finally {
      setIsLoading(false);
    }
  };

  // Get size configuration from data
  const sizeConfig = askTaTTTySizes[size];

  // Get button display text and styling
  const getButtonContent = () => {
    if (error) {
      return {
        text: error,
        textClass: 'text-red-500',
        textStyle: { 
          textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 8px rgba(255,0,0,0.5)' 
        }
      };
    }
    if (isLoading) {
      return {
        text: askTaTTTyLabels.loadingText,
        textClass: 'text-background',
        textStyle: {}
      };
    }
    return {
      text: askTaTTTyLabels.buttonText,
      textClass: 'text-background',
      textStyle: {}
    };
  };

  const buttonContent = getButtonContent();

  return (
    <div className={`relative ${className}`} ref={tooltipRef}>
      <div className="flex flex-col items-center gap-4">
        {/* Main Button */}
        <button
          onClick={() => {
            if (error) {
              setError(null); // Clear error on click
            } else {
              setIsOpen(!isOpen);
            }
          }}
          disabled={isLoading}
          className={`${sizeConfig.buttonClass} bg-gradient-to-r from-accent/80 to-accent font-[Orbitron] transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(87,241,214,0.6)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            boxShadow: `0 0 15px ${askTaTTTyStyling.glowColor}`,
            letterSpacing: askTaTTTyStyling.letterSpacing,
            borderRadius: askTaTTTyStyling.borderRadius,
          }}
        >
          <Sparkles 
            size={sizeConfig.iconSize} 
            className={isLoading ? "animate-spin" : error ? "text-red-500" : "animate-pulse"} 
            style={error ? { 
              filter: 'drop-shadow(0 0 3px rgba(255,0,0,0.8))',
              textShadow: '0 0 8px rgba(255,0,0,0.8)'
            } : {}}
          />
          <span className={`text-[${askTaTTTyStyling.buttonFontSize}] font-bold ${buttonContent.textClass}`} style={buttonContent.textStyle}>
            {buttonContent.text}
          </span>
        </button>

        {/* Revert/Redo Controls - Show after enhancement */}
        {hasEnhanced && !isLoading && (
          <TooltipProvider>
            <div className="flex items-center gap-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Revert/Forward Toggle Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleRevert}
                    className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
                  >
                    {isShowingOriginal ? (
                      <>
                        <Redo2 className="w-4 h-4" />
                        <span className="text-sm font-[Orbitron]">Forward</span>
                      </>
                    ) : (
                      <>
                        <Undo2 className="w-4 h-4" />
                        <span className="text-sm font-[Orbitron]">{askTaTTTyLabels.revertButton}</span>
                      </>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {isShowingOriginal ? 'Go back to enhanced text' : askTaTTTyLabels.revertTooltip}
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Re-Enhance Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleReEnhance}
                    disabled={isLoading}
                    className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="text-sm font-[Orbitron]">{askTaTTTyLabels.reEnhanceButton}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{askTaTTTyLabels.reEnhanceTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}

        {/* Dropdown Tooltip */}
        {isOpen && (
          <div
            className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-[${askTaTTTyStyling.dropdownBg}]/95 backdrop-blur-xl border-2 border-[${askTaTTTyStyling.dropdownBorder}]/30 rounded-2xl p-3 shadow-xl z-50`}
            style={{
              boxShadow: '0 0 20px rgba(87, 241, 214, 0.3)',
            }}
          >
            <button
              onClick={handleEnhance}
              disabled={isLoading}
              className={`w-full mb-2 py-2.5 px-4 bg-[${askTaTTTyStyling.dropdownBorder}]/10 hover:bg-[${askTaTTTyStyling.dropdownBorder}]/20 text-[${askTaTTTyStyling.dropdownBorder}] border border-[${askTaTTTyStyling.dropdownBorder}]/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{askTaTTTyLabels.enhanceButton}</span>
            </button>
            <button
              onClick={handleIdeas}
              disabled={isLoading}
              className={`w-full py-2.5 px-4 bg-[${askTaTTTyStyling.dropdownBorder}]/10 hover:bg-[${askTaTTTyStyling.dropdownBorder}]/20 text-[${askTaTTTyStyling.dropdownBorder}] border border-[${askTaTTTyStyling.dropdownBorder}]/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              <Droplet className="w-4 h-4" />
              <span>{askTaTTTyLabels.ideasButton}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
