import { useState, useEffect, useRef } from 'react';
import { Palette } from 'lucide-react';
import { Slider } from '../../components/ui/slider';
import { SelectionChip } from '../../components/shared/SelectionChip';

// Monk Scale inspired skintone palette - arranged lightest to darkest
const SKINTONE_PALETTE = [
  '#F7EDE4', // Very Light/Porcelain
  '#F3E7DA', // Light Beige
  '#F6EAD0', // Light Golden
  '#EAD9BB', // Medium Light
  '#D7BD96', // Medium Tan
  '#9F7D54', // Medium Bronze
  '#815D44', // Medium Dark
  '#604234', // Dark Brown
  '#3A312A', // Very Dark
  '#2A2420', // Deepest Brown/Black
];

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  const r = c1.r + factor * (c2.r - c1.r);
  const g = c1.g + factor * (c2.g - c1.g);
  const b = c1.b + factor * (c2.b - c1.b);
  
  return rgbToHex(r, g, b);
}

// Get interpolated color from slider value (0-100)
function getColorFromValue(value: number): string {
  // Normalize value to 0-1 range
  const normalized = value / 100;
  
  // Calculate which two colors we're between
  const scaledValue = normalized * (SKINTONE_PALETTE.length - 1);
  const index = Math.floor(scaledValue);
  const factor = scaledValue - index;
  
  // Handle edge cases
  if (index >= SKINTONE_PALETTE.length - 1) {
    return SKINTONE_PALETTE[SKINTONE_PALETTE.length - 1];
  }
  
  // Interpolate between the two colors
  return interpolateColor(SKINTONE_PALETTE[index], SKINTONE_PALETTE[index + 1], factor);
}

interface SkintonePickerProps {
  selectedSkintone: string; // Hex color value
  onSelectSkintone: (value: string) => void;
  title?: string;
}

export function SkintonePicker({ 
  selectedSkintone, 
  onSelectSkintone,
  title = "Choose Your Skintone"
}: SkintonePickerProps) {
  // Internal state for slider position (0-100)
  const [sliderValue, setSliderValue] = useState<number>(() => {
    // Initialize from selectedSkintone prop
    const index = SKINTONE_PALETTE.findIndex(color => color.toUpperCase() === selectedSkintone.toUpperCase());
    if (index !== -1) {
      return (index / (SKINTONE_PALETTE.length - 1)) * 100;
    }
    return 44.44; // Default to index 4 (Medium Tan) which is 4/9 * 100 = 44.44
  });
  
  // Internal state for immediate visual feedback
  const [currentColor, setCurrentColor] = useState<string>(selectedSkintone);
  
  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Sync with external changes (e.g., clicking palette buttons or clearing)
  useEffect(() => {
    const index = SKINTONE_PALETTE.findIndex(color => color.toUpperCase() === selectedSkintone.toUpperCase());
    if (index !== -1) {
      const newValue = (index / (SKINTONE_PALETTE.length - 1)) * 100;
      setSliderValue(newValue);
      setCurrentColor(selectedSkintone);
    }
  }, [selectedSkintone]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h2 className="text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-12 md:mb-16" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', letterSpacing: '4px' }}>
        {title}
      </h2>
      
      {currentColor !== SKINTONE_PALETTE[4] && (
        <div className="flex justify-center -mt-8 md:-mt-12 mb-4">
          <SelectionChip 
            label="Skintone"
            value={currentColor.toUpperCase()}
            onClear={() => {
              if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
              }
              const defaultValue = (4 / (SKINTONE_PALETTE.length - 1)) * 100;
              setSliderValue(defaultValue);
              setCurrentColor(SKINTONE_PALETTE[4]);
              onSelectSkintone(SKINTONE_PALETTE[4]);
            }}
          />
        </div>
      )}
      
      {/* Visual Palette Guide Strip - 160px height */}
      <div className="relative rounded-full overflow-hidden border-2 border-border/30" style={{ height: '160px' }}>
        {/* Gradient background showing full range */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${SKINTONE_PALETTE.join(', ')})`
          }}
        />
        
        {/* Current position indicator */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-accent shadow-lg transition-all duration-150"
          style={{ 
            left: `${sliderValue}%`,
            boxShadow: '0 0 10px rgba(87, 241, 214, 0.8), 0 0 20px rgba(87, 241, 214, 0.4)'
          }}
        />
      </div>

      {/* Preview Card - Same size as mood selector cards */}
      <div className="flex justify-center mt-6 md:mt-8">
        <div 
          className="flex flex-col items-center justify-center gap-1 md:gap-1.5 p-1.5 md:p-2 lg:p-2.5 rounded-xl md:rounded-2xl aspect-square transition-all duration-200 border-2 border-border/30"
          style={{
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)',
            width: 'clamp(80px, 20vw, 120px)',
            height: 'clamp(80px, 20vw, 120px)',
          }}
        >
          <div 
            className="w-full h-full rounded-lg"
            style={{ 
              backgroundColor: currentColor,
              boxShadow: `0 0 20px ${currentColor}80`
            }}
          />
        </div>
      </div>

      {/* Clickable palette stops for quick selection */}
      <div className="flex justify-between items-center gap-1 mt-[20px]">
        {SKINTONE_PALETTE.map((color, index) => {
          const isNearCurrent = currentColor.toUpperCase() === color.toUpperCase();
          
          return (
            <button
              key={index}
              onClick={() => {
                // Clicking a palette button should update immediately (no debounce)
                if (debounceTimer.current) {
                  clearTimeout(debounceTimer.current);
                }
                const value = (index / (SKINTONE_PALETTE.length - 1)) * 100;
                setSliderValue(value);
                setCurrentColor(color);
                onSelectSkintone(color);
              }}
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-200 flex-shrink-0 ${
                isNearCurrent
                  ? 'border-accent scale-110 md:scale-125 shadow-lg'
                  : 'border-border/30 hover:border-accent/50 hover:scale-105 md:hover:scale-110'
              }`}
              style={{ 
                backgroundColor: color,
                boxShadow: isNearCurrent 
                  ? `0 0 40px rgba(0, 0, 0, 0.8), 0 0 12px ${color}60` 
                  : '0 0 40px rgba(0, 0, 0, 0.8)'
              }}
              aria-label={`Skintone ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Slider in its own container at the bottom */}
      <div className="px-1 md:px-2 py-[0px] pt-[60px] pr-[8px] pb-[40px] pl-[8px]">
        <Slider
          value={[sliderValue]}
          onValueChange={(values) => {
            const newSliderValue = values[0];
            const hexColor = getColorFromValue(newSliderValue);
            
            // Update internal state immediately for responsive UI
            setSliderValue(newSliderValue);
            setCurrentColor(hexColor);
            
            // Debounce the callback to parent (2 second delay)
            if (debounceTimer.current) {
              clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(() => {
              onSelectSkintone(hexColor);
            }, 2000);
          }}
          min={0}
          max={100}
          step={0.1}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}

// Export for use in other components
export { SKINTONE_PALETTE, getColorFromValue };
