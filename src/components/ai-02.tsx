"use client";

import QFlow from "@/components/Q-FLOW";
import { SelectionChip } from "@/components/shared/SelectionChip";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  IconAlertTriangle,
  IconFileSpark,
  IconGauge,
  IconPhotoScan,
  IconSparkles,
  IconDroplet,
} from "@tabler/icons-react";
import { Send } from 'lucide-react';
import React, { useRef, useState, useEffect } from "react";
import { askTaTTTyAPI } from '../data/ask-tattty';
import { tatttyQuestions, validateTatttyQuestion } from '../data/field-labels';
import { sessionDataStore } from '../services/submissionService';
import { useGenerator } from '../contexts/GeneratorContext';

const PROMPTS = [
  {
    icon: IconFileSpark,
    text: "Write documentation",
    prompt:
      "Write comprehensive documentation for this codebase, including setup instructions, API references, and usage examples.",
  },
  {
    icon: IconGauge,
    text: "Optimize performance",
    prompt:
      "Analyze the codebase for performance bottlenecks and suggest optimizations to improve loading times and runtime efficiency.",
  },
  {
    icon: IconAlertTriangle,
    text: "Find and fix 3 bugs",
    prompt:
      "Scan through the codebase to identify and fix 3 critical bugs, providing detailed explanations for each fix.",
  },
];

const TATTY_OPTIONS = [
  {
    value: "enhance",
    name: "Optimize",
    description: "Enhance and improve your text",
    icon: IconSparkles,
  },
  {
    value: "ideas",
    name: "Ideas",
    description: "Generate creative ideas",
    icon: IconDroplet,
  },
];

export default function Ai02() {
  const [inputValue, setInputValue] = useState("");
  const [selectedTaTTy, setSelectedTaTTy] = useState<typeof TATTY_OPTIONS[number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<'question_one' | 'question_two'>('question_one');
  const [submittedQ1, setSubmittedQ1] = useState(false);
  const [submittedQ2, setSubmittedQ2] = useState(false);
  const [answersById, setAnswersById] = useState<{ question_one?: string; question_two?: string }>({});
  const { saveTextInput, updateImages } = useGenerator();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anyWin = window as any;
    const preset = anyWin?.tatttyCurrentQuestionId;
    if (preset === 'question_two' || preset === 'question_one') {
      setCurrentQuestionId(preset);
    }
    anyWin.tatttySetQuestion = (id: 'question_one' | 'question_two') => {
      anyWin.tatttyCurrentQuestionId = id;
      window.dispatchEvent(new CustomEvent('tattty:question-changed', { detail: { id } }));
    };
    const handler = (e: any) => {
      const id = e?.detail?.id ?? e?.detail;
      if (id === 'question_one' || id === 'question_two') {
        setCurrentQuestionId(id);
      }
    };
    window.addEventListener('tattty:question-changed', handler);
    return () => window.removeEventListener('tattty:question-changed', handler);
  }, []);

  const handlePromptClick = (prompt: string) => {
    if (inputRef.current) {
      inputRef.current.value = prompt;
      setInputValue(prompt);
      inputRef.current.focus();
    }
  };

  const handleTaTTyChange = (value: string) => {
    const option = TATTY_OPTIONS.find((m) => m.value === value);
    if (option) {
      setSelectedTaTTy(option);
      setIsDropdownActive(false);
    }
  };

  const streamAIResponse = async (type: 'enhance' | 'ideas'): Promise<string> => {
    const currentText = getCurrentText();
    
    if (!askTaTTTyAPI.baseURL) {
      throw new Error('Ask TaTTTy API not configured');
    }

    const endpoint = type === 'enhance' 
      ? askTaTTTyAPI.enhanceEndpoint 
      : askTaTTTyAPI.ideasEndpoint;

    if (!endpoint) {
      throw new Error(`${type} endpoint not configured`);
    }

    const response = await fetch(`${askTaTTTyAPI.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        contextType: 'tattty',
        targetText: currentText,
        hasSelection: false,
        selection_info: currentQuestionId,
      }),
      signal: AbortSignal.timeout(askTaTTTyAPI.requestTimeout || 30000),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.result) {
      throw new Error('Response missing required "result" field');
    }
    
    return data.result;
  };

  const getCurrentText = (): string => {
    return inputRef.current?.value || inputValue || '';
  };

  

  const handleSubmit = () => {
    const currentText = getCurrentText().trim();
    const result = validateTatttyQuestion(currentQuestionId, currentText);
    if (!result.isValid) {
      return;
    }
    const qId = currentQuestionId;
    const questionObj = tatttyQuestions.find(q => q.id === qId);
    if (questionObj) {
      if (qId === 'question_one') {
        sessionDataStore.setSourceCardData({ question1: { prompt: questionObj.label, answer: currentText } });
        setSubmittedQ1(true);
      } else {
        sessionDataStore.setSourceCardData({ question2: { prompt: questionObj.label, answer: currentText } });
        setSubmittedQ2(true);
      }
      setAnswersById(prev => ({ ...prev, [qId]: currentText }));
      window.dispatchEvent(new CustomEvent('tattty:answer-submitted', { detail: { id: qId, text: currentText } }));
      const combinedText = [
        qId === 'question_one' ? currentText : (answersById.question_one || ''),
        qId === 'question_two' ? currentText : (answersById.question_two || ''),
      ].filter(Boolean).join('\n\n');
      if (combinedText) {
        saveTextInput('tattty', combinedText);
      }
    }
  };

  const triggerImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const files = Array.from(filesList).slice(0, 6);
    updateImages(files);
    sessionDataStore.setSourceCardData({ images: files });
  };

  

  useEffect(() => {
    const onWindowClick = (e: any) => {
      if (!controlsRef.current) return;
      if (!controlsRef.current.contains(e.target)) {
        setIsDropdownActive(false);
      }
    };
    window.addEventListener('click', onWindowClick);
    return () => window.removeEventListener('click', onWindowClick);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full max-w-5xl px-3 sm:px-4 md:px-6">
      <div className="-mt-12 sm:-mt-16">
        <QFlow />
      </div>
      <div className="flex w-full justify-center gap-3">
        {submittedQ1 && (
          <SelectionChip
            label="Q1 SUBMITTED"
            value=""
            variant="saved"
            style={{
              background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.15), rgba(87, 241, 214, 0.05))',
              border: '2px solid #57f1d6',
              boxShadow: '0 0 20px rgba(87, 241, 214, 0.5)'
            }}
          />
        )}
        {submittedQ2 && (
          <SelectionChip
            label="Q2 SUBMITTED"
            value=""
            variant="saved"
            style={{
              background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.15), rgba(87, 241, 214, 0.05))',
              border: '2px solid #57f1d6',
              boxShadow: '0 0 20px rgba(87, 241, 214, 0.5)'
            }}
          />
        )}
      </div>
      
      <div className="flex min-h-40 flex-col rounded-2xl cursor-text bg-background/60 border border-accent/50 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        <div className="flex-1 relative overflow-y-auto max-h-80">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={tatttyQuestions.find(q => q.id === currentQuestionId)?.placeholder ?? 'Ask anything'}
            className="w-full border-0 p-4 transition-[padding] duration-200 ease-in-out min-h-16 outline-none text-[20px] text-foreground resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent! whitespace-pre-wrap wrap-break-word"
          />
        </div>

        <div ref={controlsRef} className="flex min-h-16 items-center justify-center gap-8 p-4">
          

          <div className="relative flex items-center gap-4 ml-2">
            <Select
              value={selectedTaTTy?.value as any}
              onValueChange={handleTaTTyChange}
            >
              <SelectTrigger onClick={() => setIsDropdownActive(true)} className="w-fit border-none bg-transparent! px-4 py-3 text-xl text-muted-foreground hover:text-foreground focus:ring-0 shadow-none">
                <SelectValue placeholder="Ask TaTTTy" />
              </SelectTrigger>
              <SelectContent>
                {TATTY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {React.createElement(option.icon, { className: "h-7 w-7" })}
                      <span>{option.name}</span>
                    </div>
                    <span className="text-muted-foreground block text-sm">
                      {option.description}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageFiles(e.target.files)}
            />
            <span
              role="button"
              aria-label="Upload images"
              className="inline-flex items-center justify-center h-12 w-12 cursor-pointer"
              onClick={triggerImagePicker}
            >
              <IconPhotoScan className="h-8 w-8 text-muted-foreground hover:text-foreground" />
            </span>

            <span
              role="button"
              aria-label="Submit answer"
              className="inline-flex items-center justify-center h-12 w-12 cursor-pointer"
              onClick={handleSubmit}
            >
              <Send className="h-8 w-8 text-accent" />
            </span>

            
          </div>
        </div>

      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {PROMPTS.map((button) => {
          const IconComponent = button.icon;
          return (
            <Button
              key={button.text}
              variant="ghost"
              className="group flex items-center gap-3 rounded-full border px-4 py-3 text-base text-foreground transition-all duration-200 hover:bg-muted/30 h-auto bg-transparent dark:bg-muted"
              onClick={() => handlePromptClick(button.prompt)}
            >
              <IconComponent className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
              <span>{button.text}</span>
            </Button>
          );
        })}
      </div>

      {error && (
        <div className="text-red-500 text-base text-center py-2">
          {error}
        </div>
      )}
    </div>
  );
}
