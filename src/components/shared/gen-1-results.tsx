import { Sparkles } from 'lucide-react';

interface Gen1ResultsProps {
  onClick?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  errorMessage?: string | null;
}

export function Gen1Results({ 
  onClick, 
  disabled = false,
  isGenerating = false,
  errorMessage = null,
}: Gen1ResultsProps) {
  const buttonText = errorMessage || (isGenerating ? 'Creating...' : 'TaTTT NoW');
  const isError = !!errorMessage;
  
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled || isGenerating}
        className={`px-8 py-4 ${
          isError 
            ? 'bg-gradient-to-r from-red-500/80 to-red-500' 
            : 'bg-gradient-to-r from-accent/80 to-accent'
        } text-background font-[Orbitron] transition-all duration-300 flex items-center gap-3 hover:shadow-[0_0_20px_rgba(87,241,214,0.6)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{
          boxShadow: isError ? '0 0 15px rgba(239, 68, 68, 0.6)' : '0 0 15px rgba(87, 241, 214, 0.4)',
          letterSpacing: '2px',
          borderRadius: '12px',
        }}
      >
        <Sparkles 
          size={24} 
          className={isGenerating ? "animate-spin" : isError ? "animate-bounce" : "animate-pulse"} 
        />
        <span className="text-[28px]">
          {buttonText}
        </span>
      </button>
    </div>
  );
}
