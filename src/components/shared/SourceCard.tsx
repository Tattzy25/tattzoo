import { useState, useEffect, useRef } from 'react';
import { Sparkles, Upload, X } from 'lucide-react';
import { AskTaTTTy } from './AskTaTTTy';
import { SaveChip } from './SaveChip';
import { DiamondLoader } from './DiamondLoader';
import { sessionDataStore } from '../../services/submissionService';
import { useDynamicQuestions } from '../../hooks/useDynamicQuestions';

const MIN_CHARACTERS = 50;

export function SourceCard() {
  // LOAD DYNAMIC QUESTIONS FROM BACKEND
  // Set enableBackend: true to fetch from API
  // Set enableBackend: false to use frontend data file
  const { questions, isLoading: questionsLoading } = useDynamicQuestions({
    generatorType: 'tattty',
    language: 'en',
    enableBackend: false, // TODO: Set to true when backend is ready
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  
  // Focus tracking for Ask TaTTTy
  const [focusedField, setFocusedField] = useState<'q1' | 'q2' | null>(null);
  const [lastEditedField, setLastEditedField] = useState<'q1' | 'q2'>('q1');
  const [showLoader, setShowLoader] = useState(false);

  // Get individual questions (with fallback for safety)
  const question1 = questions[0] || {
    id: 'question_one',
    order: 1,
    label: 'Question 1',
    placeholder: 'Enter text...',
    required: true,
    minCharacters: 50,
  };
  
  const question2 = questions[1] || {
    id: 'question_two',
    order: 2,
    label: 'Question 2',
    placeholder: 'Enter text...',
    required: true,
    minCharacters: 50,
  };
  
  // Enhancement state - resets when switching fields
  const [enhancementState, setEnhancementState] = useState<{
    hasEnhanced: boolean;
    originalText: string | null;
    enhancedText: string | null;
    field: 'q1' | 'q2' | null;
    isShowingOriginal: boolean;
  }>({ hasEnhanced: false, originalText: null, enhancedText: null, field: null, isShowingOriginal: false });
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ file: File; preview: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const q1Ref = useRef<HTMLTextAreaElement>(null);
  const q2Ref = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    // Show validation errors if fields are invalid
    if (!isValid) {
      setShowValidation(true);
      return;
    }

    // Extract File objects from uploaded files (NO base64 conversion)
    const fileObjects = uploadedFiles.map(item => item.file);
    
    if (fileObjects.length > 0) {
      console.log(`📸 Storing ${fileObjects.length} image file(s) in session`);
    }

    // Store in session with BOTH question prompts AND user answers
    // This gives AI prompt enhancer full context
    sessionDataStore.setSourceCardData(
      { 
        question1: {
          prompt: question1.label,
          answer: inputTitle.trim()
        },
        question2: {
          prompt: question2.label,
          answer: questionTitle.trim()
        },
        images: fileObjects.length > 0 ? fileObjects : undefined
      }
    );
    
    // Mark as submitted
    setIsSubmitted(true);
    setShowValidation(false);
  };

  // Check if each field meets minimum characters
  const isInputTitleValid = inputTitle.trim().length >= MIN_CHARACTERS;
  const isQuestionTitleValid = questionTitle.trim().length >= MIN_CHARACTERS;
  const isValid = isInputTitleValid && isQuestionTitleValid;

  // Generate error message based on which fields are invalid
  const getErrorMessage = () => {
    if (!isInputTitleValid && !isQuestionTitleValid) {
      return 'MIN 50 CHAR - Q1 & Q2';
    } else if (!isInputTitleValid) {
      return 'MIN 50 CHAR - Q1';
    } else if (!isQuestionTitleValid) {
      return 'MIN 50 CHAR - Q2';
    }
    return '';
  };

  // If content changes after submission, reset submitted state
  useEffect(() => {
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  }, [inputTitle, questionTitle, uploadedFiles]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [uploadedFiles]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: Array<{ file: File; preview: string }> = [];
    const maxFiles = 5;
    const maxSizeMB = 10;

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        // TODO: Show user-friendly error popup here (not toast)
        console.error(`${file.name} is not an image file`);
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        // TODO: Show user-friendly error popup here (not toast)
        console.error(`${file.name} exceeds ${maxSizeMB}MB limit`);
        return;
      }

      // Check total count
      if (uploadedFiles.length + validFiles.length >= maxFiles) {
        // TODO: Show user-friendly error popup here (not toast)
        console.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      validFiles.push({ file, preview });
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      console.log(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} uploaded`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
    console.log('Image removed');
  };

  // Trigger file input
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // REMOVED: streamAIResponse - now handled inside AskTaTTTy component
  const streamAIResponse_REMOVED = async () => {
    try {
      const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/ai/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          contextType: 'tattty',
          targetField: field,
          targetText,
          hasSelection,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `Stream failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      const setter = field === 'q1' ? setInputTitle : setQuestionTitle;
      const ref = field === 'q1' ? q1Ref : q2Ref;
      const currentValue = field === 'q1' ? inputTitle : questionTitle;
      
      let accumulatedText = '';
      
      // If replacing selection, preserve before/after text
      let beforeText = '';
      let afterText = '';
      if (replaceSelection && ref.current) {
        const { selectionStart, selectionEnd } = ref.current;
        beforeText = currentValue.substring(0, selectionStart);
        afterText = currentValue.substring(selectionEnd);
      } else {
        // Clear field for full replacement
        setter('');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.token) {
                accumulatedText += data.token;
                
                if (replaceSelection) {
                  setter(beforeText + accumulatedText + afterText);
                } else {
                  setter(accumulatedText);
                }
              }
              
              if (data.done) {
                return accumulatedText;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      return accumulatedText;
    } catch (error) {
      console.error('AI streaming error:', error);
      throw error;
    }
  };

  // Get current text from focused or last edited field for AskTaTTTy
  const getCurrentText = (): string => {
    const targetField = focusedField || lastEditedField;
    return targetField === 'q1' ? inputTitle : questionTitle;
  };

  // Get selection info for AskTaTTTy
  const getAskTaTTTySelectionInfo = () => {
    const activeRef = focusedField === 'q1' ? q1Ref : focusedField === 'q2' ? q2Ref : null;
    
    if (!activeRef?.current) {
      return { hasSelection: false, selectedText: '', replaceSelection: false };
    }

    const { selectionStart, selectionEnd, value } = activeRef.current;
    const hasSelection = selectionStart !== selectionEnd;
    const selectedText = hasSelection ? value.substring(selectionStart, selectionEnd) : '';

    return { hasSelection, selectedText, replaceSelection: hasSelection };
  };

  // Typewriter effect helper
  const typewriterEffect = async (finalText: string, targetField: 'q1' | 'q2', beforeText = '', afterText = '') => {
    const setter = targetField === 'q1' ? setInputTitle : setQuestionTitle;
    const chars = finalText.split('');
    
    for (let i = 0; i <= chars.length; i++) {
      const currentText = chars.slice(0, i).join('');
      if (beforeText || afterText) {
        setter(beforeText + currentText + afterText);
      } else {
        setter(currentText);
      }
      // Delay between characters (adjust for speed)
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };

  // Handle text updates from AskTaTTTy with typewriter effect
  const handleTextUpdate = async (newText: string) => {
    const targetField = focusedField || lastEditedField;
    const ref = targetField === 'q1' ? q1Ref : q2Ref;
    const currentValue = targetField === 'q1' ? inputTitle : questionTitle;
    
    // Save original text if this is the first enhancement for this field
    if (!enhancementState.hasEnhanced || enhancementState.field !== targetField) {
      setEnhancementState({
        hasEnhanced: true,
        originalText: currentValue,
        enhancedText: newText,
        field: targetField,
        isShowingOriginal: false,
      });
    } else {
      // Update enhanced text for re-enhancements
      setEnhancementState(prev => ({
        ...prev,
        enhancedText: newText,
        isShowingOriginal: false,
      }));
    }
    
    // Check if there's a text selection
    if (ref.current) {
      const { selectionStart, selectionEnd } = ref.current;
      const hasSelection = selectionStart !== selectionEnd;
      
      if (hasSelection) {
        // Replace only the selected text with typewriter effect
        const beforeText = currentValue.substring(0, selectionStart);
        const afterText = currentValue.substring(selectionEnd);
        await typewriterEffect(newText, targetField, beforeText, afterText);
      } else {
        // Replace entire field with typewriter effect
        await typewriterEffect(newText, targetField);
      }
    } else {
      // Fallback: replace entire field with typewriter effect
      await typewriterEffect(newText, targetField);
    }
  };

  // Get enhancement state for currently active field
  const getCurrentEnhancementState = () => {
    const targetField = focusedField || lastEditedField;
    
    // Only show enhancement state if it's for the current field
    const isCurrentField = enhancementState.field === targetField;
    
    return {
      hasEnhanced: isCurrentField && enhancementState.hasEnhanced,
      originalText: isCurrentField ? enhancementState.originalText : null,
      isShowingOriginal: isCurrentField && enhancementState.isShowingOriginal,
      onRevert: () => {
        if (enhancementState.isShowingOriginal) {
          // Currently showing original, toggle back to enhanced
          if (enhancementState.enhancedText) {
            if (targetField === 'q1') {
              setInputTitle(enhancementState.enhancedText);
            } else {
              setQuestionTitle(enhancementState.enhancedText);
            }
            setEnhancementState(prev => ({
              ...prev,
              isShowingOriginal: false,
            }));
          }
        } else {
          // Currently showing enhanced, toggle back to original
          if (enhancementState.originalText) {
            if (targetField === 'q1') {
              setInputTitle(enhancementState.originalText);
            } else {
              setQuestionTitle(enhancementState.originalText);
            }
            setEnhancementState(prev => ({
              ...prev,
              isShowingOriginal: true,
            }));
          }
        }
      },
      onReEnhance: async () => {
        // Trigger another enhancement
        setShowLoader(true);
        try {
          // Simulate AI response
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock enhanced text (in real app, this would be AI response)
          const mockEnhancedTexts = [
            "A majestic dragon soaring through storm clouds, scales gleaming with electric blue highlights, breathing ethereal flames...",
            "An ancient serpentine dragon coiled around a mystical mountain peak, its eyes glowing with wisdom and power...",
            "A fierce warrior dragon mid-flight, wings spread wide against a crimson sunset, ready to defend its territory...",
          ];
          
          const randomEnhanced = mockEnhancedTexts[Math.floor(Math.random() * mockEnhancedTexts.length)];
          
          if (targetField === 'q1') {
            await typewriterEffect(randomEnhanced, 'q1');
          } else {
            await typewriterEffect(randomEnhanced, 'q2');
          }
        } finally {
          setShowLoader(false);
        }
      },
    };
  };

  return (
    <div className="relative flex flex-col h-full px-[10px]">
        <div className="flex flex-col pt-[20px] pr-[0px] pb-[0px] pl-[0px] flex-1">
          <label className="block text-white px-2 mt-[0px] mr-[0px] mb-[8px] ml-[0px] font-[Roboto_Condensed] font-bold font-normal not-italic text-[24px]" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
            {question1.label}
          </label>
          <div className="relative">
            <textarea 
              ref={q1Ref}
              value={inputTitle}
              onChange={(e) => {
                setInputTitle(e.target.value);
                setLastEditedField('q1');
              }}
              onFocus={() => {
                setFocusedField('q1');
                setLastEditedField('q1');
              }}
              onBlur={() => setFocusedField(null)}
              disabled={showLoader}
              className={`w-full py-2 bg-transparent border rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none transition-all resize-y disabled:opacity-50 ${
                lastEditedField === 'q1' 
                  ? 'border-accent/60 shadow-[0_0_15px_rgba(87,241,214,0.3)]' 
                  : 'border-accent/30'
              }`}
              placeholder={question1.placeholder}
              style={{ minHeight: '150px', paddingLeft: '10px', paddingRight: '10px' }}
            />
            {showLoader && lastEditedField === 'q1' && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
                <DiamondLoader size={60} scale={0.7} />
              </div>
            )}
          </div>
          
          <div className="mt-[32px] mr-[0px] mb-[40px] ml-[0px]">
            <label className="block text-white mb-2 px-2 font-[Roboto_Condensed] text-[24px]" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              {question2.label}
            </label>
            <div className="relative">
              <textarea 
                ref={q2Ref}
                value={questionTitle}
                onChange={(e) => {
                  setQuestionTitle(e.target.value);
                  setLastEditedField('q2');
                }}
                onFocus={() => {
                  setFocusedField('q2');
                  setLastEditedField('q2');
                }}
                onBlur={() => setFocusedField(null)}
                disabled={showLoader}
                className={`w-full py-2 bg-transparent border rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none transition-all resize-y disabled:opacity-50 ${
                  lastEditedField === 'q2' 
                    ? 'border-accent/60 shadow-[0_0_15px_rgba(87,241,214,0.3)]' 
                    : 'border-accent/30'
                }`}
                placeholder={question2.placeholder}
                style={{ minHeight: '150px', paddingLeft: '10px', paddingRight: '10px' }}
              />
              {showLoader && lastEditedField === 'q2' && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
                  <DiamondLoader size={60} scale={0.7} />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons - Stacked Vertically */}
        <div className="flex flex-col items-center gap-4 py-4 mt-8">
          {/* Ask TaTTTy Button */}
          <div className="flex justify-center">
            <AskTaTTTy 
              contextType="tattty"
              size="md"
              getCurrentText={getCurrentText}
              getSelectionInfo={getAskTaTTTySelectionInfo}
              onTextUpdate={handleTextUpdate}
              onLoadingChange={setShowLoader}
              enhancementState={getCurrentEnhancementState()}
            />
          </div>
          
          {/* Upload + Submit Row */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={triggerFileUpload}
              className="p-3 rounded-full transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.15), rgba(87, 241, 214, 0.05))',
                border: '2px solid rgba(87, 241, 214, 0.4)',
                boxShadow: '0 0 10px rgba(87, 241, 214, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(87, 241, 214, 0.25), rgba(87, 241, 214, 0.1))';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(87, 241, 214, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(87, 241, 214, 0.15), rgba(87, 241, 214, 0.05))';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(87, 241, 214, 0.2)';
              }}
              aria-label="Upload file"
            >
              <Upload size={20} className="text-accent/80" />
            </button>
            
            <SaveChip 
              onSubmit={handleSubmit}
              isSubmitted={isSubmitted}
              isValid={isValid}
              errorMessage={getErrorMessage()}
            />
          </div>
        </div>
        
        {/* Uploaded Images Thumbnails */}
        {uploadedFiles.length > 0 && (
          <div className="px-4 mb-6 mt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {uploadedFiles.map((item, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden border-2 border-accent/30 hover:border-accent/60 transition-all duration-300"
                  style={{
                    boxShadow: '0 0 10px rgba(87, 241, 214, 0.2)',
                  }}
                >
                  <img
                    src={item.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500/90 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
    </div>
  );
}
