import { Spinner } from './Spinner';

interface ButtonLoadingStateProps {
  text?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable button loading state component
 * Shows spinner + optional text for button loading states
 */
export function ButtonLoadingState({ 
  text = 'Loading...', 
  spinnerSize = 'sm' 
}: ButtonLoadingStateProps) {
  return (
    <span className="flex items-center gap-2">
      <Spinner size={spinnerSize} />
      {text}
    </span>
  );
}
