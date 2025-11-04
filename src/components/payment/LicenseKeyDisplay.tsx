import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Key, Mail, X, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

interface LicenseKeyDisplayProps {
  licenseKey: string;
  email: string;
  onClose: () => void;
}

export function LicenseKeyDisplay({ licenseKey, email, onClose }: LicenseKeyDisplayProps) {
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

  // Lock body scroll when overlay is open
  useEffect(() => {
    const scrollY = window.scrollY;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] bg-[#0C0C0D] overflow-y-auto"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Close button - Top right */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-[10000] text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
        >
          <X size={28} />
        </button>

        {/* Content - Centered */}
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-3xl"
          >
            <div
              className="rounded-3xl border-4 border-accent/60 p-8 md:p-12 space-y-8"
              style={{
                background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.15), rgba(87, 241, 214, 0.05))',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                boxShadow: 'inset 0 0 60px rgba(87, 241, 214, 0.1)',
              }}
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className="flex justify-center"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.3), rgba(87, 241, 214, 0.1))',
                  }}
                >
                  <Key className="w-10 h-10 text-accent" />
                </div>
              </motion.div>

              {/* Title */}
              <div className="text-center space-y-2">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-[Orbitron] text-white"
                  style={{ textShadow: '0 0 30px rgba(87, 241, 214, 0.5)' }}
                >
                  PAYMENT SUCCESSFUL
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 text-lg"
                >
                  Your license key has been generated
                </motion.p>
              </div>

              {/* License key box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <label className="text-white/80 font-[Orbitron] flex items-center gap-2 text-lg">
                  <Key size={18} className="text-accent" />
                  YOUR LICENSE KEY
                </label>
                
                <div
                  className="relative rounded-2xl p-6 md:p-8 border-2 border-accent/40"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2))',
                    boxShadow: 'inset 0 0 20px rgba(87, 241, 214, 0.1)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <code className="font-[Orbitron] text-accent tracking-wider break-all" style={{ fontSize: '32px' }}>
                      {licenseKey}
                    </code>
                    
                    <Button
                      onClick={handleCopy}
                      size="lg"
                      className="shrink-0 w-full sm:w-auto font-[Orbitron]"
                      style={{
                        background: copied 
                          ? 'linear-gradient(135deg, rgba(87, 241, 214, 0.3), rgba(87, 241, 214, 0.2))'
                          : 'linear-gradient(135deg, rgba(87, 241, 214, 0.2), rgba(87, 241, 214, 0.1))',
                        border: '1px solid rgba(87, 241, 214, 0.4)',
                        fontSize: '20px'
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="flex items-center gap-2"
                          >
                            <Check size={20} className="text-accent" />
                            <span className="text-accent">Copied!</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Copy size={20} className="text-accent" />
                            <span className="text-accent">Copy</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Email confirmation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="rounded-xl p-4 md:p-5 border border-accent/20"
                style={{
                  background: 'rgba(87, 241, 214, 0.05)',
                }}
              >
                <div className="flex items-start gap-3">
                  <Mail className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <p className="text-white/80 text-base md:text-lg">
                      We've sent this key to:
                    </p>
                    <p className="text-accent font-[Orbitron] text-lg md:text-xl break-all">{email}</p>
                    <p className="text-white/60 text-base md:text-lg mt-3">
                      Check your inbox for a copy (it might take a few minutes)
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Safety Warning Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-xl p-5 md:p-6 border-2 border-yellow-500/40"
                style={{
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.05))',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(234, 179, 8, 0.2)',
                      }}
                    >
                      <Shield className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-yellow-400 font-[Orbitron] text-lg md:text-xl flex items-center gap-2">
                      <AlertTriangle size={20} />
                      Keep Your Key Safe
                    </h3>
                    <ul className="text-white/80 text-base md:text-lg space-y-2">
                      <li>• This is your private license key - treat it like a password</li>
                      <li>• Don't share it publicly or expose it in screenshots</li>
                      <li>• Save it somewhere secure (password manager, notes app, etc.)</li>
                      <li>• Once you close this window, you won't see it here again</li>
                      <li>• If you lose it, you'll need to purchase a new key</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-3 text-center pt-4"
              >
                <p className="text-white/70 text-base md:text-lg">
                  Ready to start creating? Enter your key below to unlock the generators.
                </p>
                
                <Button
                  onClick={onClose}
                  className="w-full py-6 md:py-7 font-[Orbitron] rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #57f1d6, #3dd5c0)',
                    color: '#0C0C0D',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                    fontSize: '20px'
                  }}
                >
                  CONTINUE
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
