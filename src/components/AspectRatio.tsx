import { useState } from 'react';
import { useBoolean } from '../hooks/use-boolean';
import { SelectionChip } from './shared/SelectionChip';
import { AspectRatioOption } from '../types/aspectRatio';

interface AspectRatioProps {
  aspectRatios: AspectRatioOption[];
  selectedAspectRatio?: string | null;
  onSelectAspectRatio?: (value: string | null) => void;
  className?: string;
}

export function AspectRatio({ 
  aspectRatios,
  selectedAspectRatio: controlledValue,
  onSelectAspectRatio,
  className = '' 
}: AspectRatioProps) {
  const [internalValue, setInternalValue] = useState<string>('1:1');
  const [hasInteracted, { setTrue: setHasInteractedTrue }] = useBoolean(false);

  // Use controlled value if provided, otherwise use internal state
  const selectedValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleSelectionChange = (value: string) => {
    if (onSelectAspectRatio) {
      onSelectAspectRatio(value);
    } else {
      setInternalValue(value);
    }
    setHasInteractedTrue();
  };

  // Helper function to get center diamond styling based on centerEffect
  const getCenterDiamondStyle = (centerEffect?: string) => {
    const baseStyle = {
      width: '12px',
      height: '12px',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(45deg)',
      backgroundColor: '#333333',
      borderRadius: '2px',
      border: '1px solid #4e4d4d',
      transition: 'all 0.12s linear',
    };

    if (!centerEffect) return baseStyle;

    const effectStyles: Record<string, any> = {
      'left': {
        borderLeft: '1px solid #57f1d6b2',
        boxShadow: 'inset 11px 0px 10px -12px #57f1d6dc',
      },
      'top': {
        borderTop: '1px solid #57f1d6d8',
        boxShadow: 'inset 0px 11px 10px -12px #57f1d6',
      },
      'bottom': {
        borderBottom: '1px solid #57f1d6b2',
        boxShadow: 'inset 0px -11px 10px -12px #57f1d6',
      },
      'right': {
        borderRight: '1px solid #57f1d694',
        boxShadow: 'inset -11px 0px 10px -12px #57f1d6',
      },
      'top-left': {
        borderLeft: '1px solid #57f1d6b2',
        borderTop: '1px solid #57f1d6b2',
        boxShadow: 'inset 11px 11px 10px -12px #57f1d6',
      },
      'bottom-right': {
        borderRight: '1px solid #57f1d6b2',
        borderBottom: '1px solid #57f1d6b2',
        boxShadow: 'inset -11px -11px 10px -12px #57f1d6',
      },
      'bottom-left': {
        borderLeft: '1px solid #57f1d6b2',
        borderBottom: '1px solid #57f1d6b2',
        boxShadow: 'inset 11px -11px 10px -12px #57f1d6',
      },
      'top-right': {
        borderRight: '1px solid #57f1d6b2',
        borderTop: '1px solid #57f1d6b2',
        boxShadow: 'inset -11px 11px 10px -12px #57f1d6',
      },
    };

    return baseStyle;
  };

  // Get active center effect
  const activeRatio = aspectRatios.find(ratio => ratio.value === selectedValue);
  const activeCenterEffect = activeRatio?.centerEffect;

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Selection Chip */}
      {hasInteracted && selectedValue && (
        <SelectionChip 
          label="Selected Aspect Ratio"
          value={selectedValue}
          variant="default"
        />
      )}

      {/* Radio Input Grid */}
      <div 
        className="radio-input mx-auto"
        style={{
          width: '280px',
          height: '640px',
          backgroundColor: 'rgb(54, 240, 230)',
          borderRadius: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(4, minmax(0, 1fr))',
          padding: '6px',
          gap: '4px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Center Diamond */}
        <div 
          className="center"
          style={{
            width: '12px',
            height: '12px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            backgroundColor: '#333333',
            borderRadius: '2px',
            borderTop: activeCenterEffect === 'top' || activeCenterEffect === 'top-left' || activeCenterEffect === 'top-right' ? '1px solid #57f1d6b2' : '1px solid #4e4d4d',
            borderRight: activeCenterEffect === 'right' || activeCenterEffect === 'bottom-right' || activeCenterEffect === 'top-right' ? '1px solid #57f1d6b2' : '1px solid #4e4d4d',
            borderBottom: activeCenterEffect === 'bottom' || activeCenterEffect === 'bottom-left' || activeCenterEffect === 'bottom-right' ? '1px solid #57f1d6b2' : '1px solid #4e4d4d',
            borderLeft: activeCenterEffect === 'left' || activeCenterEffect === 'top-left' || activeCenterEffect === 'bottom-left' ? '1px solid #57f1d6b2' : '1px solid #4e4d4d',
            transition: 'all 0.12s linear',
            ...(activeCenterEffect === 'left' && {
              boxShadow: 'inset 11px 0px 10px -12px #57f1d6dc',
            }),
            ...(activeCenterEffect === 'top' && {
              boxShadow: 'inset 0px 11px 10px -12px #57f1d6',
            }),
            ...(activeCenterEffect === 'bottom' && {
              boxShadow: 'inset 0px -11px 10px -12px #57f1d6',
            }),
            ...(activeCenterEffect === 'right' && {
              boxShadow: 'inset -11px 0px 10px -12px #57f1d6',
            }),
            ...(activeCenterEffect === 'top-left' && {
              boxShadow: 'inset 11px 11px 10px -12px #57f1d6',
            }),
            ...(activeCenterEffect === 'bottom-right' && {
              boxShadow: 'inset -11px -11px 10px -12px #57f1d6',
            }),
            ...(activeCenterEffect === 'bottom-left' && {
              boxShadow: 'inset 11px -11px 10px -12px #57f1d6',
            }),
            ...(activeCenterEffect === 'top-right' && {
              boxShadow: 'inset -11px 11px 10px -12px #57f1d6',
            }),
          }}
        />
        
        {/* Render aspect ratio options */}
        {aspectRatios.map((ratio, index) => {
          const Icon = ratio.icon;
          const isSelected = selectedValue === ratio.value;

          return (
            <label 
              key={ratio.id}
              className={`label ratio-${ratio.value.replace(':', '-')}`}
              style={{
                background: isSelected 
                  ? 'linear-gradient(to bottom, #1d1d1d, #1d1d1d)'
                  : 'linear-gradient(to bottom, #333333, rgb(36, 35, 35))',
                borderRadius: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                borderTop: isSelected ? 'none' : '1px solid #4e4d4d',
                cursor: 'pointer',
                transitionProperty: 'all',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDuration: '200ms',
                boxShadow: isSelected 
                  ? '0px 17px 5px 1px rgba(0, 0, 0, 0)'
                  : '0px 0px 5px 1px rgba(0, 0, 0, 0.2)',
              }}
            >
              <input 
                type="radio" 
                id={`value-${index + 1}`} 
                name="value-radio" 
                value={ratio.value}
                checked={isSelected}
                onChange={(e) => handleSelectionChange(e.target.value)}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Icon 
                  size={22}
                  style={{
                    color: isSelected ? '#57f1d6' : 'black',
                    transition: 'all 0.1s linear',
                    filter: isSelected 
                      ? 'drop-shadow(0px 0px 8px #57f1d6)'
                      : 'drop-shadow(-1px -1px 1px rgba(224, 224, 224, 0.1)) drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.3))',
                  }}
                />
                <span 
                  className={`text ratio-${ratio.value.replace(':', '-')}`}
                  style={{
                    color: isSelected ? '#57f1d6' : 'black',
                    fontSize: '22px',
                    lineHeight: '12px',
                    padding: '0px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    transition: 'all 0.1s linear',
                    textShadow: isSelected 
                      ? '0px 0px 12px #57f1d6'
                      : '-1px -1px 1px rgb(224, 224, 224, 0.1), 0px 2px 3px rgb(0, 0, 0, 0.3)',
                  }}
                >
                  {ratio.label}
                </span>
              </div>
              <div 
                style={{
                  content: '""',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: '1.02',
                  borderRadius: '25px',
                  background: isSelected
                    ? 'linear-gradient(to bottom, transparent 10%, #57f1d6, transparent 90%), linear-gradient(to left, transparent 10%, #57f1d6, transparent 90%)'
                    : 'linear-gradient(to bottom, transparent 10%, transparent, transparent 90%), linear-gradient(to left, transparent 10%, transparent, transparent 90%)',
                  transitionProperty: 'all',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDuration: '200ms',
                  zIndex: -1,
                  pointerEvents: 'none',
                }}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
