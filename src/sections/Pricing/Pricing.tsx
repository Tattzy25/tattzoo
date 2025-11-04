import { useState } from 'react';
import { Key, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { sectionHeadings } from '../../data';
import { PayPalOverlay } from '../../components/payment/PayPalOverlay';
import { PaymentSuccessCard } from '../../components/payment/PaymentSuccessCard';
import { PaymentErrorCard } from '../../components/payment/PaymentErrorCard';
import { LicenseKeyInput } from '../../components/payment/LicenseKeyInput';
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
    // Close success card and show license key input
    setCurrentView('keyInput');
  };
  
  const handleKeyInputClose = () => {
    // Return to initial view when closing key input
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

  const handleAccessGranted = () => {
    setHideContent(true);
  };

  return (
    <section className="w-full px-4">
      <div className="max-w-md mx-auto">
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
              <div
                className={`relative overflow-hidden rounded-[40px] border-3 border-accent/50 p-8 text-center group cursor-pointer ${styles.card}`}
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  background: 'linear-gradient(135deg, hsla(169, 85%, 64%, 0.12), hsla(169, 85%, 64%, 0.05))',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)',
                }}
              >
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-accent rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Rotating gradient background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(87, 241, 214, 0.4), transparent 60%)',
                'radial-gradient(circle at 30% 70%, rgba(87, 241, 214, 0.4), transparent 60%)',
                'radial-gradient(circle at 70% 30%, rgba(87, 241, 214, 0.4), transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(87, 241, 214, 0.4), transparent 60%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative z-10 space-y-6">
            {/* Icon with floating animation */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <div
                className={`relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${styles.iconContainer}`}
                style={{
                  background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.25), rgba(87, 241, 214, 0.1))',
                }}
              >
                <Key className="w-8 h-8 text-accent" />
                
                {/* Sparkle effects */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <div className="space-y-2">
              <h2
                className={`text-3xl md:text-4xl font-[Orbitron] text-white ${styles.title}`}
                style={{
                  textShadow: '0 0 30px rgba(87, 241, 214, 0.6), 2px 2px 6px rgba(0, 0, 0, 0.9)',
                  letterSpacing: '3px',
                }}
              >
                {sectionHeadings.licenseKey.title.split('\\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h2>
              
              {/* Price with pulse effect */}
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-3xl md:text-4xl text-accent font-[Orbitron] ${styles.price}`}
                style={{ textShadow: '0 0 25px rgba(87, 241, 214, 0.6)' }}
              >
                {sectionHeadings.licenseKey.price}
              </motion.p>
              
              <p className="text-lg text-white/80">
                {sectionHeadings.licenseKey.description}
              </p>
            </div>

            {/* Button with hover glow */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={() => setCurrentView('payment')}
                className={`text-lg px-10 py-6 rounded-full border-2 border-accent transition-all duration-300 relative overflow-hidden group ${styles.primaryButton}`}
                style={{
                  background: 'linear-gradient(135deg, #57f1d6, #3dd5c0)',
                  color: '#0C0C0D',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                  textShadow: 'none',
                }}
              >
                <span className="relative z-10 font-[Orbitron] tracking-wider">
                  {sectionHeadings.licenseKey.buttonText}
                </span>
                
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>

            {/* Enter Key Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentView('keyInput')}
                className={`text-lg px-10 py-6 rounded-full border-2 border-accent/50 transition-all duration-300 bg-transparent hover:bg-accent/10 ${styles.secondaryButton}`}
              >
                <span className="relative z-10 font-[Orbitron] tracking-wider">
                  ENTER KEY
                </span>
              </Button>
            </motion.div>

            {/* Payment note */}
            <p className="text-sm text-muted-foreground">
              {sectionHeadings.licenseKey.paymentNote}
            </p>
          </div>
        </div>
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

          {/* LICENSE KEY INPUT CARD */}
          {currentView === 'keyInput' && (
            <motion.div
              key="key-input-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <LicenseKeyInput 
                inline 
                onClose={handleKeyInputClose}
                onAccessGranted={handleAccessGranted}
              />
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
