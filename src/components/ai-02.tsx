"CHOOSE YOUR VIBE"

"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  IconAlertTriangle,
  IconArrowUp,
  IconCloud,
  IconFileSpark,
  IconGauge,
  IconPhotoScan,
  IconSparkles,
  IconDroplet,
} from "@tabler/icons-react";
import React, { useRef, useState } from "react";
import { askTaTTTyAPI } from '../data/ask-tattty';

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
  const [selectedTaTTy, setSelectedTaTTy] = useState(TATTY_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleTaTTyAction = async () => {
    if (isLoading) return;
    
    const currentText = getCurrentText().trim();
    
    // Validate text for enhance action
    if (selectedTaTTy.value === 'enhance' && currentText.length < 10) {
      setError('Text too short for enhancement. Please enter more content.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await streamAIResponse(selectedTaTTy.value as 'enhance' | 'ideas');
      
      // Update the textarea with the result
      if (inputRef.current) {
        inputRef.current.value = result;
        setInputValue(result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMaxBadge = () => (
    <div className="flex h-[14px] items-center gap-1.5 rounded border border-border px-1 py-0">
      <span
        className="text-[9px] font-bold uppercase"
        style={{
          background:
            "linear-gradient(to right, rgb(129, 161, 193), rgb(125, 124, 155))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        MAX
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-[calc(48rem-2rem)]">
      <div className="flex min-h-[160px] flex-col rounded-2xl cursor-text bg-card border border-border shadow-lg">
        <div className="flex-1 relative overflow-y-auto max-h-[320px]">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything"
            className="w-full border-0 p-4 transition-[padding] duration-200 ease-in-out min-h-[64px] outline-none text-[20px] text-foreground resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent! whitespace-pre-wrap break-words"
          />
        </div>

        <div className="flex min-h-[56px] items-center gap-3 p-3 pb-1">
          <div className="flex aspect-1 items-center gap-2 rounded-full bg-muted p-2 text-sm">
            <IconCloud className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="relative flex items-center">
            <Select
              value={selectedTaTTy.value}
              onValueChange={handleTaTTyChange}
            >
              <SelectTrigger className="w-fit border-none bg-transparent! p-0 text-base text-muted-foreground hover:text-foreground focus:ring-0 shadow-none">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {React.createElement(selectedTaTTy.icon, { className: "h-4 w-4" })}
                    <span>Ask TaTTTy</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TATTY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {React.createElement(option.icon, { className: "h-4 w-4" })}
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

          <div className="ml-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground transition-all duration-100"
              title="Attach images"
            >
              <IconPhotoScan className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-100 cursor-pointer bg-accent",
                (inputValue || selectedTaTTy.value === 'ideas') && "bg-accent hover:bg-accent/90!"
              )}
              disabled={isLoading || (!inputValue && selectedTaTTy.value === 'enhance')}
              onClick={handleTaTTyAction}
            >
              {isLoading ? (
                <IconSparkles className="h-5 w-5 text-accent-foreground animate-spin" />
              ) : (
                React.createElement(selectedTaTTy.icon, { className: "h-5 w-5 text-accent-foreground" })
              )}
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
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
    </div>
  );
}
