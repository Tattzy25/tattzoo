interface SelectionChipProps {
  label: string;
  value: string;
  onClear?: () => void;
  variant?: 'default' | 'saved';
  className?: string;
}

export function SelectionChip({ 
  label, 
  value, 
  onClear,
  variant = 'default',
  className = '' 
}: SelectionChipProps) {
  
  if (variant === 'saved') {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-accent bg-accent/20 ${className}`}
        style={{
          animation: 'pulse 2s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(87, 241, 214, 0.6)',
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full bg-accent"
            style={{
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <span className="text-sm font-[Orbitron] text-accent tracking-wider">
            {label.toUpperCase()}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/50 bg-accent/10 ${className}`}
    >
      <span className="text-xs text-accent font-[Orbitron] tracking-wide text-[16px]">
        {value}
      </span>
    </div>
  );
}
