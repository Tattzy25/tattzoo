interface SelectionChipProps {
  label: string;
  value: string;
  onClear?: () => void;
  variant?: 'default' | 'saved';
  className?: string;
  style?: React.CSSProperties;
}

export function SelectionChip({ 
  label, 
  value, 
  onClear,
  variant = 'default',
  className = '',
  style 
}: SelectionChipProps) {
  
  if (variant === 'saved') {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-accent bg-accent/10 ${className}`}
        style={{
          ...style,
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full bg-accent"
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
      style={style}
    >
      <span className="text-xs text-accent font-[Orbitron] tracking-wide text-[16px]">
        {value}
      </span>
    </div>
  );
}
