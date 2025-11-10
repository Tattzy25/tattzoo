import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Mail, AlertCircle, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useLicense } from '../../contexts/LicenseContext';
import './LicenseKeyInput.css';

interface LicenseKeyInputProps {
  inline?: boolean;
  onClose?: () => void;
  onAccessGranted?: () => void;
}

export function LicenseKeyInput({ inline = false, onClose, onAccessGranted }: LicenseKeyInputProps) {
  const { verifyLicense, isVerified, license } = useLicense();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const [bannerStatus, setBannerStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleVerify = async () => {
    setError('');
    setIsVerifying(true);

    // Validate inputs
    if (!email || !licenseKey) {
      setError('Please fill in all fields');
      setIsVerifying(false);
      return;
    }

    const success = await verifyLicense(licenseKey, email);
    
    setIsVerifying(false);
    
    if (!success) {
      setError('Invalid license key or email');
      return;
    }
    
    // Trigger access granted callback to hide pricing content
    if (onAccessGranted) {
      onAccessGranted();
    }
    
    // If verification was successful, close the form
    if (isVerified) {
      setIsOpen(false);
      setEmail('');
      setLicenseKey('');
      if (inline && onClose) {
        onClose();
      }
    }
    // If denied, keep form open so user can retry
  };

  // Format license key as user types
  const handleKeyChange = (value: string) => {
    // Remove all non-alphanumeric
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Format with hyphens
    let formatted = '';
    if (cleaned.startsWith('TATY')) {
      formatted = 'TATY-';
      const rest = cleaned.slice(4);
      for (let i = 0; i < rest.length && i < 12; i++) {
        if (i > 0 && i % 4 === 0) formatted += '-';
        formatted += rest[i];
      }
    } else {
      // Add TATY prefix
      formatted = 'TATY-';
      for (let i = 0; i < cleaned.length && i < 12; i++) {
        if (i > 0 && i % 4 === 0) formatted += '-';
        formatted += cleaned[i];
      }
    }
    
    setLicenseKey(formatted);
  };

  // Inline form content (for use below the Enter Key button)
  const formContent = (
    <div
      className="relative rounded-3xl border-4 border-accent/60 p-8 md:p-10 license-key-form-bg"
    >
      {/* Vault door design */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-16 h-16 rounded-full border-4 border-accent/60 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.2), rgba(87, 241, 214, 0.05))',
          }}
        >
          <KeyRound className="w-8 h-8 text-accent" />
        </div>
      </div>

      <div className="space-y-6 mt-4">
        {/* Title */}
        <div className="text-center space-y-2">
          <h3
            className="text-2xl md:text-3xl text-white"
            style={{ textShadow: '0 0 20px rgba(87, 241, 214, 0.5)', fontFamily: 'Roboto Condensed, sans-serif' }}
          >
            ENTER LICENSE KEY
          </h3>
          <p className="text-white/70 text-sm" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            Verify your key to unlock access
          </p>
        </div>

        {/* Email input */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm flex items-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            <Mail size={14} className="text-accent" />
            Email Address
          </label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/30 border-accent/30 text-white placeholder:text-white/40 h-12"
            style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
            disabled={isVerifying}
          />
        </div>

        {/* License key input */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm flex items-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            <KeyRound size={14} className="text-accent" />
            License Key
          </label>
          <Input
            type="text"
            placeholder="TATY-XXXX-XXXX-XXXX"
            value={licenseKey}
            onChange={(e) => handleKeyChange(e.target.value)}
            className="bg-black/30 border-accent/30 text-white placeholder:text-white/40 tracking-wider h-16 text-center"
            style={{ fontFamily: 'Roboto Condensed, sans-serif', fontSize: '24px' }}
            maxLength={19}
            disabled={isVerifying}
          />
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg p-3 border border-red-400/40"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
              }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (inline && onClose) {
                onClose();
              } else {
                setIsOpen(false);
              }
            }}
            variant="outline"
            className="flex-1 h-12 font-[Orbitron] border-accent/30 hover:border-accent/50"
            style={{ fontSize: '20px' }}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !email || !licenseKey}
            className="flex-1 h-12 font-[Orbitron]"
            style={{
              background: isVerifying
                ? 'linear-gradient(135deg, #555, #444)'
                : 'linear-gradient(135deg, #57f1d6, #3dd5c0)',
              color: '#0C0C0D',
              fontSize: '20px'
            }}
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                />
                Verifying...
              </span>
            ) : (
              'Access Now'
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  // If inline mode, return form content only
  if (inline) {
    return formContent;
  }

  return (
    <>
      {/* Trigger Button */}
      {!isVerified ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="w-full rounded-2xl border-2 border-accent/40 p-6 transition-all hover:border-accent/60"
            style={{
              background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.08), rgba(87, 241, 214, 0.03))',
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <KeyRound className="w-6 h-6 text-accent" />
              <span className="font-[Orbitron] text-white">
                Already have a key? <span className="text-accent">Enter it here</span>
              </span>
            </div>
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-2xl border-2 border-accent/60 p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.12), rgba(87, 241, 214, 0.05))',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                  background: 'rgba(87, 241, 214, 0.2)',
                }}
              >
                <Check className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-[Orbitron] text-white">License Verified</p>
                <p className="text-sm text-white/60">{license?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="text-accent text-sm hover:underline font-[Orbitron]"
            >
              Change
            </button>
          </div>
        </motion.div>
      )}
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: 'rgba(12, 12, 13, 0.85)',
              }}
            />
            {/* Vault Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4"
            >
              {formContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Access Banner */}
      {/* <AccessBanner status={bannerStatus} onComplete={handleBannerComplete} /> */}
    </>
  );
}
