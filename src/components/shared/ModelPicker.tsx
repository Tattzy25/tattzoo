import { useState } from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { cn } from '../ui/utils';

// Stability AI model types
export type ModelType = 'sd3.5-large' | 'sd3-turbo';

interface ModelConfig {
  name: string;
  tagline: string;
  description: string;
  apiValue: string;
  icon: typeof Sparkles;
  glowColor: string;
  gradient: string;
}

const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  'sd3.5-large': {
    name: 'Quality',
    tagline: 'Make this shit beautiful',
    description: 'Best quality, most detailed, perfect for complex tattoos',
    apiValue: 'sd3.5-large',
    icon: Sparkles,
    glowColor: 'rgba(147, 51, 234, 0.6)', // Purple glow
    gradient: 'from-purple-500/30 to-pink-500/30',
  },
  'sd3-turbo': {
    name: 'Speed',
    tagline: 'Fuck it, I want it now',
    description: 'Fast generation, good quality, great for testing ideas',
    apiValue: 'sd3-turbo',
    icon: Zap,
    glowColor: 'rgba(234, 179, 8, 0.6)', // Yellow glow
    gradient: 'from-yellow-500/30 to-orange-500/30',
  },
};

interface ModelPickerProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  className?: string;
}

export function ModelPicker({ 
  selectedModel, 
  onModelChange, 
  className 
}: ModelPickerProps) {
  const [hoveredModel, setHoveredModel] = useState<ModelType | null>(null);

  return (
    <div className={cn('w-full space-y-6', className)}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {(Object.keys(MODEL_CONFIGS) as ModelType[]).map((model) => {
          const config = MODEL_CONFIGS[model];
          const Icon = config.icon;
          const isSelected = selectedModel === model;
          const isHovered = hoveredModel === model;
          
          return (
            <div
              key={model}
              onClick={() => onModelChange(model)}
              onMouseEnter={() => setHoveredModel(model)}
              onMouseLeave={() => setHoveredModel(null)}
              className="group relative cursor-pointer flex-1"
            >
              <div
                className="relative overflow-hidden rounded-full md:rounded-3xl border-2 transition-all duration-500"
                style={{
                  borderColor: isSelected ? 'rgba(87, 241, 214, 0.8)' : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: isSelected 
                    ? `0 0 40px ${config.glowColor}, 0 8px 24px rgba(0, 0, 0, 0.7)` 
                    : isHovered
                    ? `0 0 25px ${config.glowColor}, 0 6px 20px rgba(0, 0, 0, 0.6)`
                    : '0 4px 16px rgba(0, 0, 0, 0.5)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${config.gradient} transition-opacity duration-500`}
                  style={{ opacity: isSelected || isHovered ? 0.6 : 0 }}
                />
                
                {isSelected && (
                  <div 
                    className="absolute inset-0 rounded-full md:rounded-3xl"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${config.glowColor}, transparent)`,
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 3s ease-in-out infinite',
                      opacity: 0.4
                    }}
                  />
                )}

                <div 
                  className="relative px-6 py-4 md:px-8 md:py-6 backdrop-blur-xl h-full flex items-center justify-center gap-4 md:gap-5"
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.12), hsla(0, 0%, 100%, 0.04))'
                      : 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.08), hsla(0, 0%, 100%, 0.02))'
                  }}
                >
                  <div 
                    className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all duration-500 shrink-0"
                    style={{
                      borderColor: isSelected ? 'rgba(87, 241, 214, 0.7)' : 'rgba(255, 255, 255, 0.2)',
                      background: isSelected 
                        ? `radial-gradient(circle, ${config.glowColor} 0%, rgba(12, 12, 13, 0.9) 70%)`
                        : 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(12, 12, 13, 0.9) 70%)',
                      boxShadow: isSelected 
                        ? `0 0 30px ${config.glowColor}, inset 0 0 15px ${config.glowColor}` 
                        : 'none'
                    }}
                  >
                    <Icon 
                      className="w-6 h-6 md:w-7 md:h-7 transition-colors duration-500"
                      style={{ 
                        color: isSelected ? '#57f1d6' : '#888'
                      }}
                    />
                  </div>

                  <h3 
                    className="text-xl md:text-2xl font-[Orbitron] text-white transition-all duration-500"
                    style={{
                      textShadow: isSelected 
                        ? '0 0 15px rgba(87, 241, 214, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.8)'
                        : '2px 2px 4px rgba(0, 0, 0, 0.8)',
                      letterSpacing: '1px'
                    }}
                  >
                    {config.name}
                  </h3>

                  {isSelected && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Description Box */}
      <div className="w-full md:max-w-2xl md:mx-auto px-0 md:px-4">
        <div
          className="relative overflow-hidden rounded-2xl border transition-all duration-500"
          style={{
            borderColor: 'rgba(87, 241, 214, 0.3)',
            background: 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.06), hsla(0, 0%, 100%, 0.02))',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="relative backdrop-blur-xl px-6 py-5 md:px-8 md:py-6 space-y-3">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            
            <p className="text-xl md:text-2xl text-[#57f1d6] text-center italic">
              &quot;{MODEL_CONFIGS[selectedModel].tagline}&quot;
            </p>
            
            <p className="md:text-lg text-muted-foreground text-center leading-relaxed text-[24px]">
              {MODEL_CONFIGS[selectedModel].description}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </div>
  );
}
