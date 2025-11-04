import { useState, useEffect } from 'react';
import { Scan } from 'lucide-react';
import { ARExperience } from './ARExperience';
import { useLicense } from '../../contexts/LicenseContext';

interface TryItOnButtonProps {
  imageDataUrl: string;
}

export function TryItOnButton({ 
  imageDataUrl,
}: TryItOnButtonProps) {
  const [showAR, setShowAR] = useState(false);
  const [arKey, setArKey] = useState(0); // Force remount with key
  const isEmbedded = window.self !== window.top;
  const { isVerified } = useLicense();
  
  useEffect(() => {
    console.log('[TryItOn] 🎬 TryItOnButton mounted');
    console.log('[TryItOn] Is embedded:', isEmbedded);
    console.log('[TryItOn] window.location:', window.location.href);
    // Don't log window.self/window.top directly - causes circular reference
    console.log('[TryItOn] window.self === window.top:', window.self === window.top);
  }, [isEmbedded]);
  
  const handleClick = () => {
    // Require license verification for AR usage
    if (!isVerified) {
      alert('🔒 Please enter your license key to use the AR camera.');
      return;
    }

    if (!imageDataUrl) {
      console.error('[TryItOn] No image data URL provided');
      alert('Unable to load tattoo image. Please try generating again.');
      return;
    }
    
    // Check if we're in an iframe (embedded environment)
    const isEmbedded = window.self !== window.top;
    console.log('[TryItOn] Is embedded:', isEmbedded);
    console.log('[TryItOn] Image data URL length:', imageDataUrl.length);
    
    // If embedded, warn user and offer to open in new tab
    if (isEmbedded) {
      const shouldOpenNewTab = confirm(
        '⚠️ AR Camera features may not work in this embedded view.\n\n' +
        'Click OK to open TaTTy in a new tab where camera access will work properly.\n\n' +
        'Click Cancel to try anyway (may not work).'
      );
      
      if (shouldOpenNewTab) {
        window.open(window.location.href, '_blank');
        return;
      }
    }
    
    setArKey(prev => prev + 1); // Increment key to force fresh mount
    setShowAR(true);
  };
  
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleClick}
          className="px-8 py-4 bg-gradient-to-r from-accent/80 to-accent text-background font-[Orbitron] transition-all duration-300 flex items-center gap-3 hover:shadow-[0_0_20px_rgba(87,241,214,0.6)] hover:scale-105"
          style={{
            boxShadow: '0 0 15px rgba(87, 241, 214, 0.4)',
            letterSpacing: '2px',
            borderRadius: '12px',
          }}
        >
          <Scan 
            size={24} 
            className="animate-pulse" 
          />
          <span className="text-[28px]">
            Try It On
          </span>
        </button>
      </div>

      {/* AR Experience Overlay */}
      {showAR && (
        <ARExperience 
          key={arKey}
          tattooDataUrl={imageDataUrl}
          onClose={() => setShowAR(false)}
        />
      )}
    </>
  );
}
