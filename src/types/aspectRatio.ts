import { LucideIcon } from 'lucide-react';

export interface AspectRatioOption {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  gridPosition?: number; // Position in the grid (1-8)
  centerEffect?: 'left' | 'top' | 'bottom' | 'right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-right'; // For the center diamond effect
}
