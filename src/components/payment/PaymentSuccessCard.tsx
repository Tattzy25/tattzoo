import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Mail, Key } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface PaymentSuccessCardProps {
  licenseKey: string;
  email: string;
  onContinue: () => void;
}

export function PaymentSuccessCard({ licenseKey, email, onContinue }: PaymentSuccessCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Fallback copy function using textarea
    const fallbackCopy = () => {
      const textArea = document.createElement('textarea');
      textArea.value = licenseKey;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    };

    // Try clipboard API first, fallback if it fails
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(licenseKey);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (clipboardErr) {
          // Clipboard API blocked, use fallback
          console.log('Clipboard API blocked, using fallback');
          fallbackCopy();
        }
      } else {
        // Clipboard API not available, use fallback
        fallbackCopy();
      }
    } catch (err) {
      // Any other error, use fallback
      console.error('Copy error:', err);
      fallbackCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl border-4 border-accent/60 p-8 md:p-10 max-w-md mx-auto"
      style={{
        background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.12), rgba(87, 241, 214, 0.05))',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: 'inset 0 0 40px rgba(87, 241, 214, 0.1)',
      }}
    >
      {/* Decorative icon badge - matching other cards */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-16 h-16 rounded-full border-4 border-accent/60 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.2), rgba(87, 241, 214, 0.05))',
          }}
        >
          <Check className="w-8 h-8 text-accent" />
        </div>
      </div>

      <div className="space-y-6 mt-4">
        {/* Title */}
        <div className="text-center space-y-2">
          <h3
            className="text-2xl md:text-3xl text-white"
            style={{ 
              textShadow: '0 0 20px rgba(87, 241, 214, 0.5)',
              fontFamily: 'Roboto Condensed, sans-serif'
            }}
          >
            PAYMENT SUCCESSFUL
          </h3>
          <p className="text-white/70 text-sm" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            Your license key has been sent to:
          </p>
          <p className="text-accent text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            <Mail size={14} />
            {email}
          </p>
        </div>

        {/* License key display with inline copy */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm flex items-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            <Key size={14} className="text-accent" />
            Your License Key
          </label>
          <div
            className="relative rounded-xl border-2 border-accent/40 p-4 flex items-center justify-between gap-3"
            style={{
              background: 'rgba(87, 241, 214, 0.05)',
            }}
          >
            <p 
              className="text-white tracking-wider break-all flex-1"
              style={{ fontFamily: 'Roboto Condensed, sans-serif', fontSize: '24px' }}
            >
              {licenseKey}
            </p>
            
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 p-2 hover:bg-accent/10 rounded transition-colors"
                    aria-label="Copy license key"
                  >
                    {copied ? (
                      <Check size={20} className="text-accent" />
                    ) : (
                      <Copy size={20} className="text-white/60 hover:text-accent transition-colors" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                    {copied ? 'Copied!' : 'Copy to clipboard'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Important message */}
        <div
          className="rounded-lg p-4 border border-accent/30"
          style={{
            background: 'rgba(87, 241, 214, 0.08)',
          }}
        >
          <div className="text-white/80" style={{ fontFamily: 'Roboto Condensed, sans-serif', fontSize: '20px' }}>
            <p className="text-accent mb-2"><strong>Next Step:</strong></p>
            <ul className="space-y-1.5 pl-4">
              <li>• Copy & Save the key somewhere safe. You will need it in the next step and for future verifications.</li>
              <li>• We also emailed your private license key.</li>
              <li>• Lost keys cannot be recovered - you'd need to buy a new one</li>
            </ul>
          </div>
        </div>

        {/* Continue button */}
        <Button
          onClick={onContinue}
          className="w-full h-12 font-[Orbitron]"
          style={{
            background: 'linear-gradient(135deg, #57f1d6, #3dd5c0)',
            color: '#0C0C0D',
            fontSize: '20px'
          }}
        >
          Continue to Verification
        </Button>
      </div>
    </motion.div>
  );
}
