import { useState } from 'react';
import { Key, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { sectionHeadings } from '../../data';
import { PayPalOverlayWithBoundary as PayPalOverlay } from '../../components/payment/PayPalOverlay';
import { LicenseKeyInput } from '../../components/payment/LicenseKeyInput';
import { PaymentSuccessCard } from '../../components/payment/PaymentSuccessCard';
import { PaymentErrorCard } from '../../components/payment/PaymentErrorCard';
// Removed LicenseKeyInput per request
import { PaymentLoader } from '../../components/payment/PaymentLoader';
import styles from './Pricing.module.css';

interface PricingProps {
  onNavigate?: (page: string) => void;
}

export function Pricing({ onNavigate }: PricingProps) {
  const [currentView, setCurrentView] = useState<'initial' | 'payment' | 'loading' | 'success' | 'error' | 'keyInput'>('initial');
  const [generatedKey, setGeneratedKey] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [hideContent, setHideContent] = useState(false);

  const handlePaymentSuccess = (email: string, licenseKey: string) => {
    setUserEmail(email);
    setGeneratedKey(licenseKey);
    // Show loading state first
    setCurrentView('loading');
    
    // After 2.5 seconds, show success card directly
    setTimeout(() => {
      setCurrentView('success');
    }, 2500);
  };

  const handlePaymentError = (message: string, details?: string) => {
    setErrorMessage(message);
    setErrorDetails(details || '');
    // Show loading state first
    setCurrentView('loading');
    
    // After 2 seconds, show error card
    setTimeout(() => {
      setCurrentView('error');
    }, 2000);
  };

  const handleSuccessContinue = () => {
    setCurrentView('initial');
  };
  
  const handlePaymentClose = () => {
    // Return to initial view when closing payment
    setCurrentView('initial');
  };

  const handleErrorRetry = () => {
    // Return to payment form to try again
    setCurrentView('payment');
  };

  const handleErrorCancel = () => {
    // Return to initial view
    setCurrentView('initial');
  };

  // Access granted flow removed with License UI

  return (
    <section id="pricing" className="w-full px-1.5 md:px-2.5">
      <div className="max-w-4xl mx-auto">
        {!hideContent && (
          <AnimatePresence mode="wait">
            {/* INITIAL CARD - Get Your Private Key */}
          {currentView === 'initial' && (
            <motion.div
              key="initial-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                className="relative overflow-hidden w-full h-[520px] md:h-[680px] rounded-[40px] border-3 border-black/10 shadow-xl"
                style={{
                  background: '#57f1d6',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(12,12,13,0.08), transparent 60%)' }} />
                <div className="relative z-10 w-full flex flex-col items-center text-center gap-1 py-[10px] px-[5px]">
                  <h2
                    className="text-black text-[28px] md:text-[36px] font-[Orbitron]"
                    style={{ textShadow: '0 3px 8px rgba(0,0,0,0.6)' }}
                  >
                    UNLOCK TO GET YOUR UNIQUE TATTOO IMAGE,
                    {' '}BUILT AND CREATED BY{' '}
                    <span
                      className="brand-gradient bg-clip-text text-transparent block md:inline"
                      style={{
                        fontFamily: 'Rock Salt',
                        fontSize: 'clamp(2.75rem, 20vw, 7rem)',
                        lineHeight: 0.9,
                        maxWidth: '100%'
                      }}
                    >
                      TaTTTy
                    </span>
                    {' '}BASED ON YOUR STORY
                  </h2>
                  <p className="text-black text-[22px] md:text-[26px]" style={{ fontFamily: 'Roboto Condensed' }}>Your Pain. Your Life. Your Power. OUR INK</p>
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <span className="relative inline-block text-black text-[26px] md:text-[32px] font-[Orbitron]">
                      $19.99
                      <span className="absolute left-0 right-0 top-1/2 h-[3px]" style={{ background: '#ef4444', transform: 'translateY(-50%) rotate(-12deg)' }}></span>
                    </span>
                    <span className="text-black text-[28px] md:text-[34px] font-[Orbitron]">$9.99</span>
                    <span className="text-black/80 text-[18px] md:text-[20px]" style={{ fontFamily: 'Roboto Condensed' }}>for a limited time</span>
                  </div>
                  <p className="text-black text-[22px] md:text-[26px] font-[Orbitron] mt-1">How It Works</p>
                  <div className="flex items-center justify-center gap-3 md:gap-6 text-black/80 text-[18px] md:text-[20px]" style={{ fontFamily: 'Roboto Condensed' }}>
                    <span>Get Your Private Key</span>
                    <span className="h-5 w-px bg-black/30" />
                    <span>Get Access</span>
                    <span className="h-5 w-px bg-black/30" />
                    <span>Get TaTTTid</span>
                  </div>
                  <div className="mt-4 flex w-full max-w-xl gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentView('keyInput')}
                      className="flex-1 h-14 text-black border-black/30 hover:border-black/60 font-[Orbitron] text-[20px]"
                    >
                      ENTER KEY NOW
                    </Button>
                    <Button
                      onClick={() => setCurrentView('payment')}
                      className="flex-1 h-14 font-[Orbitron] text-[20px]"
                      style={{ background: 'linear-gradient(135deg, #57f1d6, #3dd5c0)', color: '#0C0C0D' }}
                    >
                      UNLOCK NOW
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* PAYMENT CARD */}
          {currentView === 'payment' && (
            <motion.div
              key="payment-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <PayPalOverlay
                isOpen={true}
                inline
                onClose={handlePaymentClose}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </motion.div>
          )}

          {/* SUCCESS CARD */}
          {currentView === 'success' && (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <PaymentSuccessCard
                licenseKey={generatedKey}
                email={userEmail}
                onContinue={handleSuccessContinue}
              />
            </motion.div>
          )}

          {/* ERROR CARD */}
          {currentView === 'error' && (
            <motion.div
              key="error-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <PaymentErrorCard
                errorMessage={errorMessage}
                errorDetails={errorDetails}
                onRetry={handleErrorRetry}
                onCancel={handleErrorCancel}
              />
            </motion.div>
          )}

          {currentView === 'keyInput' && (
            <motion.div
              key="key-input-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <LicenseKeyInput inline onClose={() => setCurrentView('initial')} />
            </motion.div>
          )}

          {/* PAYMENT LOADING STATE */}
          {currentView === 'loading' && (
            <PaymentLoader key="payment-loader" />
          )}
        </AnimatePresence>
        )}
      </div>
    </section>
  );
}
