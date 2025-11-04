interface InkStrokeButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * InkStrokeButton - Reusable stroke text button with teal fill animation
 * Uses the .output-type-button CSS class from globals.css
 */
export function InkStrokeButton({ 
  label, 
  isActive = false, 
  onClick,
  className = ''
}: InkStrokeButtonProps) {
  return (
    <button
      className={`output-type-button ${className}`}
      onClick={onClick}
      data-active={isActive}
    >
      <span className="actual-text">&nbsp;{label}  &nbsp;</span>
      <span aria-hidden="true" className="hover-text">&nbsp;{label}&nbsp;</span>
    </button>
  );
}
