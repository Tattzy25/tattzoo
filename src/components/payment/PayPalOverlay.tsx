import { useState, useEffect } from 'react';
import { X, Mail, AlertCircle, CreditCard, Calendar, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { Spinner } from '../shared/Spinner';

interface PayPalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (email: string, licenseKey: string) => void;
  onPaymentError: (errorMessage: string, errorDetails?: string) => void;
  inline?: boolean;
}

export function PayPalOverlay({ isOpen, onClose, onPaymentSuccess, onPaymentError, inline = false }: PayPalOverlayProps) {
  const BACKEND_API_URL = (import.meta as any)?.env?.VITE_BACKEND_API_URL || 'http://localhost:8000';
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  // Lock body scroll and hide overflow when overlay is open (only for modal mode)
  useEffect(() => {
    if (isOpen && !inline) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, inline]);

  const handlePayment = async () => {
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Email is required to receive your license key');
      return;
    }
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate card number
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      setError('Please enter a valid card number');
      return;
    }

    // Validate expiry
    if (!expiry || expiry.length < 5) {
      setError('Please enter a valid expiry date');
      return;
    }

    // Validate CVV
    if (!cvv || cvv.length < 3) {
      setError('Please enter a valid CVV');
      return;
    }

    setError('');
    
    // ==========================================
    // 🔌 BACKEND INTEGRATION POINT
    // ==========================================
    // Replace this mock logic with actual payment processor API call
    // Example with Stripe:
    //
    // try {
    //   const response = await fetch('/api/process-payment', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       email,
    //       paymentMethod: { /* card details */ },
    //       amount: 999, // $9.99 in cents
    //     })
    //   });
    //
    //   const data = await response.json();
    //
    //   if (data.success) {
    //     onPaymentSuccess(email, data.licenseKey);
    //   } else {
    //     onPaymentError(data.errorMessage, data.errorDetails);
    //   }
    // } catch (error) {
    //   onPaymentError('Payment processing failed', error.message);
    // }
    // ==========================================
    
    // MOCK: Simulate random payment failures (30% chance)
    const paymentSucceeds = Math.random() > 0.3; // 70% success rate
    
    if (!paymentSucceeds) {
      // Simulate different types of payment errors
      const errorTypes = [
        {
          message: 'Card Declined',
          details: 'Your card was declined by the issuing bank. Please try a different payment method.'
        },
        {
          message: 'Insufficient Funds',
          details: 'The card does not have sufficient funds to complete this transaction.'
        },
        {
          message: 'Invalid Card Details',
          details: 'The card information provided is invalid. Please check and try again.'
        },
        {
          message: 'Network Error',
          details: 'Unable to connect to payment processor. Please check your connection and try again.'
        }
      ];
      
      const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      onPaymentError(randomError.message, randomError.details);
      
      // Reset form
      setEmail('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      return;
    }
    
    // Request license issuance from backend
    try {
      const resp = await fetch(`${BACKEND_API_URL}/api/key/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(10000),
      });

      if (!resp.ok) {
        const text = await resp.text();
        onPaymentError('License issuance failed', `HTTP ${resp.status}: ${text}`);
        // Reset form
        setEmail('');
        setCardNumber('');
        setExpiry('');
        setCvv('');
        return;
      }

      const data = await resp.json();
      const issuedKey = data?.key || data?.licenseKey || '';
      if (!issuedKey) {
        onPaymentError('License issuance failed', 'Backend returned no key');
        // Reset form
        setEmail('');
        setCardNumber('');
        setExpiry('');
        setCvv('');
        return;
      }

      // Trigger success callback with real issued key
      onPaymentSuccess(email, issuedKey);
    } catch (err: any) {
      onPaymentError('License issuance failed', err?.message || 'Network error');
      // Reset form
      setEmail('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      return;
    }
    
    // Reset form
    setEmail('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  // (Removed mock key generator; keys now issued by backend)

  // Format card number with spaces
  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted.slice(0, 19)); // Max 16 digits + 3 spaces
  };

  // Format expiry as MM/YY
  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    setExpiry(formatted.slice(0, 5));
  };

  // CVV accepts only numbers
  const handleCvvChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setCvv(cleaned.slice(0, 4));
  };

  // Payment form content (reusable for both modal and inline modes)
  const formContent = (
    <div
      className="relative rounded-3xl border-4 border-accent/60 p-8 md:p-10"
      style={{
        background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.12), rgba(87, 241, 214, 0.05))',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: 'inset 0 0 40px rgba(87, 241, 214, 0.1)',
      }}
    >
      {/* Decorative top icon - matching LicenseKeyInput */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-16 h-16 rounded-full border-4 border-accent/60 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.2), rgba(87, 241, 214, 0.05))',
          }}
        >
          <Mail className="w-8 h-8 text-accent" />
        </div>
      </div>

      {/* Close button (only show in modal mode) */}
      {!inline && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      )}

      {/* Content */}
      <div className="space-y-6 mt-4">
        <div className="text-center space-y-2">
          <h3 
            className="text-2xl md:text-3xl text-white"
            style={{ 
              textShadow: '0 0 20px rgba(87, 241, 214, 0.5)',
              fontFamily: 'Roboto Condensed, sans-serif'
            }}
          >
            UNLOCK NOW
          </h3>
          
          <p className="text-accent text-2xl" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>$9.99</p>
          <p className="text-white/70 text-sm" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>One-time payment • Instant access</p>
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
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="bg-black/30 border-accent/30 text-white placeholder:text-white/40 h-12"
            style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
          />
        </div>

        {/* Card Number */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm flex items-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            <CreditCard size={14} className="text-accent" />
            Card Number
          </label>
          <Input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => {
              handleCardNumberChange(e.target.value);
              setError('');
            }}
            className="bg-black/30 border-accent/30 text-white placeholder:text-white/40 h-12 tracking-wider"
            style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-white/80 text-sm flex items-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              <Calendar size={14} className="text-accent" />
              Expiry
            </label>
            <Input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => {
                handleExpiryChange(e.target.value);
                setError('');
              }}
              className="bg-black/30 border-accent/30 text-white placeholder:text-white/40 h-12"
              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm flex items-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              <Lock size={14} className="text-accent" />
              CVV
            </label>
            <Input
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => {
                handleCvvChange(e.target.value);
                setError('');
              }}
              className="bg-black/30 border-accent/30 text-white placeholder:text-white/40 h-12 text-center"
              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
            />
          </div>
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
          {/* Cancel button (only in inline mode) */}
          {inline && (
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 border-accent/30 hover:border-accent/50 font-[Orbitron]"
              style={{ fontSize: '20px' }}
            >
              Cancel
            </Button>
          )}
          
          {/* Payment button */}
          <Button
            onClick={handlePayment}
            disabled={!email || !cardNumber || !expiry || !cvv}
            className={`${inline ? 'flex-1' : 'w-full'} h-12 font-[Orbitron]`}
            style={{
              background: 'linear-gradient(135deg, #57f1d6, #3dd5c0)',
              color: '#0C0C0D',
              fontSize: '20px'
            }}
          >
            Get Access
          </Button>
        </div>

        {/* Secure payment note */}
        <p className="text-center text-white/50 text-xs" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
          🔒 Secure payment • Demo mode active
        </p>
      </div>
    </div>
  );

  // If inline mode, just return the form content
  if (inline) {
    return isOpen ? formContent : null;
  }

  // Modal mode
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: 'rgba(12, 12, 13, 0.95)' }}>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          />

          {/* Payment Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-md px-4"
          >
            {formContent}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
