import { motion } from 'motion/react';
import { CreditCard, Lock, Sparkles } from 'lucide-react';

/**
 * Reusable payment processing loader
 * Shows animated vault/lock with processing message
 */
export function PaymentLoader() {
  return (
    <motion.div
      key="payment-loader"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-3xl border-4 border-accent/60 p-12 md:p-16"
      style={{
        background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.12), rgba(87, 241, 214, 0.05))',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: 'inset 0 0 40px rgba(87, 241, 214, 0.1)',
      }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="space-y-8 text-center">
        {/* Animated Lock Icon */}
        <div className="flex justify-center">
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 -m-6 rounded-full border-2 border-accent/30"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            
            {/* Inner circle */}
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.3), rgba(87, 241, 214, 0.1))',
                boxShadow: '0 0 30px rgba(87, 241, 214, 0.4)',
              }}
            >
              <Lock className="w-10 h-10 text-accent" />
              
              {/* Sparkle */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-5 h-5 text-accent" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Processing text */}
        <div className="space-y-3">
          <motion.h3
            className="text-2xl md:text-3xl font-[Orbitron] text-white"
            style={{ textShadow: '0 0 20px rgba(87, 241, 214, 0.5)' }}
            animate={{
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            PROCESSING PAYMENT
          </motion.h3>
          
          <p className="text-white/70 text-sm">
            Securing your license key...
          </p>

          {/* Loading dots */}
          <div className="flex justify-center gap-2 pt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-accent"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="w-full max-w-xs mx-auto">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{
              background: 'rgba(87, 241, 214, 0.1)',
            }}
          >
            <motion.div
              className="h-full bg-accent"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
              }}
              style={{
                boxShadow: '0 0 10px rgba(87, 241, 214, 0.5)',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
