import { Send, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SaveChipProps {
  onSubmit: () => void;
  isSubmitted?: boolean;
  isValid?: boolean;
  errorMessage?: string;
}

export function SaveChip({ onSubmit, isSubmitted = false, isValid = true, errorMessage = 'NEED 50+ CHARACTERS IN EACH FIELD' }: SaveChipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showError, setShowError] = useState(false);

  // Clear error after 3 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleClick = () => {
    if (isSubmitted) return;
    
    if (!isValid) {
      setShowError(true);
      return;
    }
    
    onSubmit();
  };

  const getButtonStyle = () => {
    if (showError) {
      return {
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.15))',
        border: '2px solid rgba(239, 68, 68, 0.6)',
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
      };
    }
    
    if (isSubmitted) {
      return {
        background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.3), rgba(87, 241, 214, 0.15))',
        border: '2px solid #57f1d6',
        boxShadow: '0 0 20px rgba(87, 241, 214, 0.5)',
      };
    }
    
    if (isHovered) {
      return {
        background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.25), rgba(87, 241, 214, 0.1))',
        border: '2px solid rgba(87, 241, 214, 0.4)',
        boxShadow: '0 0 15px rgba(87, 241, 214, 0.3)',
      };
    }
    
    return {
      background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.15), rgba(87, 241, 214, 0.05))',
      border: '2px solid rgba(87, 241, 214, 0.4)',
      boxShadow: '0 0 10px rgba(87, 241, 214, 0.2)',
    };
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isSubmitted}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-[Orbitron] tracking-wider"
      style={{
        ...getButtonStyle(),
        cursor: isSubmitted ? 'default' : 'pointer',
        opacity: isSubmitted ? 0.9 : 1,
      }}
    >
      {showError ? (
        <>
          <AlertCircle size={18} className="text-red-400" />
          <span className="text-red-400 text-sm">{errorMessage}</span>
        </>
      ) : isSubmitted ? (
        <>
          <Check size={18} className="text-accent" />
          <span className="text-accent text-sm">SUBMITTED</span>
        </>
      ) : (
        <>
          <Send size={18} className="text-accent/80" />
          <span className="text-accent/80 text-sm">SUBMIT</span>
        </>
      )}
    </button>
  );
}
