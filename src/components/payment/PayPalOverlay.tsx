import React, { useState, useEffect } from 'react';
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
  const BACKEND_API_URL = (import.meta as any)?.env?.VITE_BACKEND_API_URL as string | undefined;
  const backendConfigured = !!BACKEND_API_URL;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [paypalInit, setPaypalInit] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  usePaypalButton(isOpen, paypalInit, setPaypalInit);

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
    if (!backendConfigured) {
      setError('Backend URL is not configured. Set VITE_BACKEND_API_URL.');
      return;
    }
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
    
    // Remove mock simulation: always attempt backend issuance and fail loud
    
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

  // Legacy card input handlers removed (email-only flow)

  // Payment form content (reusable for both modal and inline modes)
  const formContent = (
    <div
      className="relative rounded-[40px] border-3 border-black/10 p-8 md:p-10 shadow-xl"
      style={{
        background: '#57f1d6',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
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
        {!backendConfigured && (
          <div
            className="rounded-lg p-3 border border-red-400/40"
            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                Backend URL is not configured. Set VITE_BACKEND_API_URL.
              </p>
            </div>
          </div>
        )}
        <div className="text-center space-y-1">
          <h3 
            className="text-2xl md:text-3xl text-black font-[Orbitron]"
            style={{ textShadow: '0 3px 8px rgba(0,0,0,0.6)' }}
          >
            UNLOCK NOW
          </h3>
          <p className="text-black text-2xl font-[Orbitron]">$9.99</p>
          <p className="text-black/70 text-sm" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>One-time payment • Instant access</p>
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

        <div className="space-y-2">
          <label className="text-black/80 text-sm flex items-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
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
            className="bg-black/20 border-black/30 text-black placeholder:text-black/40 h-12 tracking-wider"
            style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-black/80 text-sm flex items-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
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
              className="bg-black/20 border-black/30 text-black placeholder:text-black/40 h-12"
              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-black/80 text-sm flex items-center gap-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
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
              className="bg-black/20 border-black/30 text-black placeholder:text-black/40 h-12 text-center"
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
            disabled={!backendConfigured || !email}
            className={`${inline ? 'flex-1' : 'w-full'} h-12 font-[Orbitron]`}
            style={{
              background: 'linear-gradient(135deg, #57f1d6, #3dd5c0)',
              color: '#0C0C0D',
              fontSize: '20px'
            }}
          >
            {backendConfigured ? 'Get Access' : 'Backend Not Configured'}
          </Button>
        </div>

        <div id="paypal-button-container-P-4PH289791F392245MNEOEYQQ" className="pt-4" />

        {/* Secure payment note */}
        <p className="text-center text-white/50 text-xs" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
          🔒 Secure payment • Production mode
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-md px-4 relative"
          >
            {formContent}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

class PayPalOverlayErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: 'rgba(12, 12, 13, 0.95)' }}>
          <div className="flex items-center justify-center h-full px-4">
            <div className="relative rounded-3xl border-4 border-red-400/40 p-8 w-full max-w-md" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-red-400 shrink-0" />
                <div className="space-y-2">
                  <p className="text-red-400" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>An error occurred in payment UI.</p>
                  <Button onClick={() => this.setState({ hasError: false })} className="h-10">Retry</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}

export function PayPalOverlayWithBoundary(props: PayPalOverlayProps) {
  return (
    <PayPalOverlayErrorBoundary>
      <PayPalOverlay {...props} />
    </PayPalOverlayErrorBoundary>
  );
}

function initPaypal(isOpen: boolean, setPaypalInit: (v: boolean) => void) {
  if (!isOpen) return;
  const setup = () => {
    const paypal = (window as any).paypal;
    if (!paypal) return;
    const el = document.getElementById('paypal-button-container-P-4PH289791F392245MNEOEYQQ');
    if (!el) return;
    el.innerHTML = '';
    try {
      paypal
        .Buttons({
          style: { shape: 'pill', color: 'black', layout: 'vertical', label: 'subscribe' },
          createSubscription: function (data: any, actions: any) {
            return actions.subscription.create({ plan_id: 'P-4PH289791F392245MNEOEYQQ' });
          },
          onApprove: function (data: any) {
            alert((data as any)?.subscriptionID);
          },
        })
        .render('#paypal-button-container-P-4PH289791F392245MNEOEYQQ');
      setPaypalInit(true);
    } catch {}
  };
  if ((window as any).paypal) {
    setup();
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://www.paypal.com/sdk/js?client-id=AXv0pX_4up4nGJaAXJ-VnzxFnxQlpyrqwV5GPbLDe83yrtumx_zNPppH0M9yTIg2KvFT19L41IQIKXSz&vault=true&intent=subscription';
  s.setAttribute('data-sdk-integration-source', 'button-factory');
  s.onload = setup;
  document.head.appendChild(s);
}

export function usePaypalButton(isOpen: boolean, paypalInit: boolean, setPaypalInit: (v: boolean) => void) {
  useEffect(() => {
    if (!paypalInit) initPaypal(isOpen, setPaypalInit);
  }, [isOpen, paypalInit]);
}
  const handleCardNumberChange = (value: string) => {
    const v = value.replace(/[^0-9\s]/g, '').slice(0, 19);
    setCardNumber(v);
  };

  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;
    setExpiry(formatted);
  };

  const handleCvvChange = (value: string) => {
    const v = value.replace(/[^0-9]/g, '').slice(0, 4);
    setCvv(v);
  };
