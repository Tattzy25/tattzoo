"use client";

import QFlow from "@/components/Q-FLOW";
import { SelectionChip } from "@/components/shared/SelectionChip";
import { AskTaTTTy } from "@/components/shared/AskTaTTTy";
import { Textarea } from "@/components/ui/textarea";
import { IconPhotoScan } from "@tabler/icons-react";
import { Send } from 'lucide-react';
import React, { useRef, useState, useEffect } from "react";
import { askTaTTTyAPI } from '../data/ask-tattty';
import { tatttyQuestions, validateTatttyQuestion } from '../data/field-labels';
import { sessionDataStore } from '../services/submissionService';
import { useGenerator } from '../contexts/GeneratorContext';

export default function Ai02() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<'question_one' | 'question_two'>('question_one');
  const [submittedQ1, setSubmittedQ1] = useState(false);
  const [submittedQ2, setSubmittedQ2] = useState(false);
  const [answersById, setAnswersById] = useState<{ question_one?: string; question_two?: string }>({});
  const { saveTextInput, updateImages } = useGenerator();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  

  

  const getCurrentText = (): string => {
    return inputRef.current?.value || inputValue || '';
  };

  

  const handleSubmit = () => {
    const currentText = getCurrentText().trim();
    const result = validateTatttyQuestion(currentQuestionId, currentText);
    if (!result.isValid) {
      setError(result.error || 'Invalid input');
      setTimeout(() => setError(null), 4000);
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
          

          <AskTaTTTy
            contextType="tattty"
            size="lg"
            className="ml-2"
            getCurrentText={() => getCurrentText()}
            getQuestionId={() => currentQuestionId}
            onTextUpdate={(text: string) => {
              setInputValue(text);
              if (inputRef.current) inputRef.current.value = text;
            }}
          />
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

      <div className="min-h-12" aria-hidden="true" />

      
    </div>
  );
}
