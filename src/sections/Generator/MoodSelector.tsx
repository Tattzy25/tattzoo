import { ReactNode } from 'react';
import { Mood } from '../../types/mood';
import { SelectionChip } from '../../components/shared/SelectionChip';

interface MoodSelectorProps {
  moods: Mood[];
  selectedMood: string | null;
  onSelectMood: (moodId: string | null) => void;
  title?: string;
  rightAccessory?: ReactNode;
}

export function MoodSelector({ 
  moods, 
  selectedMood, 
  onSelectMood,
  title = "Set Your Mood",
  rightAccessory,
}: MoodSelectorProps) {
  const selectedMoodLabel = moods.find(m => m.id === selectedMood)?.label;
  
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="mb-6 md:mb-10">
        <div className="hidden sm:flex items-center justify-center gap-4">
          <h2 className="text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', letterSpacing: '4px' }}>
            {title}
          </h2>
          {rightAccessory ? <div className="ml-2">{rightAccessory}</div> : null}
        </div>
        <div className="sm:hidden flex flex-col items-center gap-3">
          <h2 className="text-5xl font-[Akronim] text-white text-center uppercase" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', letterSpacing: '4px' }}>
            {title}
          </h2>
          {rightAccessory ? rightAccessory : null}
        </div>
      </div>
      
      {selectedMood && selectedMoodLabel && (
        <div className="flex justify-center -mt-8 md:-mt-12 mb-4">
          <SelectionChip 
            label="Mood"
            value={selectedMoodLabel}
            onClear={() => onSelectMood(null)}
          />
        </div>
      )}
      
      {/* Horizontal scrollable container with generous padding to prevent clipping */}
      <div className="w-full overflow-x-auto overflow-y-visible py-12 -my-12">
        <div className="px-12 -mx-12 flex justify-center">
          <div 
            className="grid gap-2 md:gap-3 lg:gap-4 w-max"
            style={{
              gridTemplateRows: 'repeat(3, 1fr)',
              gridAutoFlow: 'column',
              gridAutoColumns: 'minmax(0, 1fr)',
            }}
          >
            {moods.map((mood) => {
              const MoodIcon = mood.icon;
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => onSelectMood(isSelected ? null : mood.id)}
                  aria-pressed={isSelected}
                  aria-label={`Select mood: ${mood.label}`}
                  className={`mood-btn flex flex-col items-center justify-center gap-1 md:gap-1.5 p-1.5 md:p-2 lg:p-2.5 rounded-xl md:rounded-2xl aspect-square transition-all duration-200 border-2 ${
                    isSelected
                      ? 'border-accent bg-accent/10 shadow-[0_0_20px_rgba(87,241,214,0.6)]'
                      : 'border-border/50 bg-background/50 hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  {MoodIcon && (
                    <MoodIcon 
                      className={`transition-colors ${
                        isSelected ? 'text-accent' : 'text-muted-foreground'
                      } mood-icon`}
                    />
                  )}
                  <span className={`text-xs md:text-sm text-center transition-colors leading-tight ${
                    isSelected ? 'text-accent' : 'text-muted-foreground'
                  } mood-label`}
                  >
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
