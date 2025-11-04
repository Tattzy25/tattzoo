import { motion } from 'motion/react';
import { XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

interface PaymentErrorCardProps {
  errorMessage: string;
  errorDetails?: string;
  onRetry: () => void;
  onCancel: () => void;
}

export function PaymentErrorCard({ 
  errorMessage, 
  errorDetails, 
  onRetry, 
  onCancel 
}: PaymentErrorCardProps) {
  return (
    <div
      className="relative rounded-3xl border-4 border-red-400/60 p-8 md:p-10"
      style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.05))',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: 'inset 0 0 40px rgba(239, 68, 68, 0.1)',
      }}
    >
      {/* Decorative top icon - error state */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-16 h-16 rounded-full border-4 border-red-400/60 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
          }}
        >
          <XCircle className="w-8 h-8 text-red-400" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-6 mt-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 
            className="text-2xl md:text-3xl text-white"
            style={{ 
              textShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
              fontFamily: 'Roboto Condensed, sans-serif'
            }}
          >
            PAYMENT FAILED
          </h3>
          
          <p 
            className="text-red-400 text-xl"
            style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
          >
            {errorMessage}
          </p>
        </div>

        {/* Error details if provided */}
        {errorDetails && (
          <div
            className="rounded-xl border border-red-400/30 p-4"
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p 
                  className="text-white/90"
                  style={{ fontFamily: 'Roboto Condensed, sans-serif', fontSize: '18px' }}
                >
                  Error Details:
                </p>
                <p 
                  className="text-white/70"
                  style={{ fontFamily: 'Roboto Condensed, sans-serif', fontSize: '16px' }}
                >
                  {errorDetails}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Common reasons */}
        <div className="text-white/70" style={{ fontFamily: 'Roboto Condensed, sans-serif', fontSize: '16px' }}>
          <p className="mb-2">Common reasons:</p>
          <ul className="space-y-1 pl-4">
            <li>• Insufficient funds</li>
            <li>• Card declined by bank</li>
            <li>• Incorrect card details</li>
            <li>• Network connection issue</li>
          </ul>
        </div>

        {/* Demo mode note */}
        <div
          className="rounded-xl border border-amber-400/30 p-4"
          style={{
            background: 'rgba(251, 191, 36, 0.08)',
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p 
                className="text-amber-400"
                style={{ fontFamily: 'Roboto Condensed, sans-serif', fontSize: '16px' }}
              >
                <strong>Demo Mode:</strong> This is a simulated payment error. In production, connect your payment processor here to handle real payment failures.
              </p>
              <p 
                className="text-white/60 text-sm"
                style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
              >
                {/* BACKEND INTEGRATION POINT: Replace mock error with real payment gateway response */}
                Integration point: Handle actual payment processor error codes and messages
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-12 border-white/20 hover:border-white/40 text-white font-[Orbitron]"
            style={{ fontSize: '18px' }}
          >
            Cancel
          </Button>
          
          <Button
            onClick={onRetry}
            className="flex-1 h-12 font-[Orbitron] flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #57f1d6, #3dd5c0)',
              color: '#0C0C0D',
              fontSize: '18px'
            }}
          >
            <RefreshCw size={18} />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
