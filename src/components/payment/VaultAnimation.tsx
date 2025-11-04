import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface VaultAnimationProps {
  onComplete: () => void;
}

export function VaultAnimation({ onComplete }: VaultAnimationProps) {
  const [stage, setStage] = useState<'door' | 'opening' | 'complete'>('door');

  useEffect(() => {
    // Stage 1: Show vault door (1s)
    const doorTimer = setTimeout(() => {
      setStage('opening');
    }, 1000);

    // Stage 2: Opening animation (2s)
    const openingTimer = setTimeout(() => {
      setStage('complete');
    }, 3000);

    // Stage 3: Call onComplete after vault opens (3.5s total)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(doorTimer);
      clearTimeout(openingTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0C0D]">
      <div className="relative w-full max-w-md px-4">
        {/* Vault Door */}
        <motion.div
          className="relative aspect-square max-w-[280px] mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: stage === 'door' ? 1 : 1.1,
            opacity: stage === 'complete' ? 0 : 1
          }}
          transition={{ duration: 0.6 }}
        >
          {/* Outer vault circle */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-[#57f1d6]/20"
            animate={{
              rotate: stage === 'opening' ? 360 : 0,
              borderColor: stage === 'opening' ? '#57f1d6' : '#57f1d6'
            }}
            transition={{ 
              rotate: { duration: 2, ease: 'easeInOut' },
              borderColor: { duration: 0.5 }
            }}
          />

          {/* Inner vault circle */}
          <motion.div
            className="absolute inset-8 rounded-full border-2 border-[#57f1d6]/30 bg-[#1a1a1b]"
            animate={{
              rotate: stage === 'opening' ? -180 : 0
            }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            {/* Center handle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-[#57f1d6]"
                animate={{
                  scale: stage === 'opening' ? [1, 1.2, 1] : 1
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: stage === 'opening' ? 3 : 0
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-2 bg-[#0C0C0D] rounded-full" />
                </div>
              </motion.div>
            </div>

            {/* Locking pins */}
            {[0, 90, 180, 270].map((rotation, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-1 h-8 bg-[#57f1d6] origin-bottom"
                style={{
                  transform: `translate(-50%, -100%) rotate(${rotation}deg)`
                }}
                animate={{
                  scaleY: stage === 'opening' ? 0 : 1,
                  opacity: stage === 'opening' ? 0 : 1
                }}
                transition={{ 
                  delay: 0.2 + (i * 0.1),
                  duration: 0.3
                }}
              />
            ))}
          </motion.div>

          {/* Glow effect */}
          {stage === 'opening' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-[#57f1d6]/20 blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: 1 }}
            />
          )}
        </motion.div>

        {/* Status text */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[#57f1d6]">
            {stage === 'door' && 'Securing your key...'}
            {stage === 'opening' && 'Unlocking vault...'}
            {stage === 'complete' && 'Complete!'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
