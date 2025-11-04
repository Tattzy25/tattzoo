/**
 * ASPECT RATIOS DATA
 * All aspect ratio options for image dimensions
 * 
 * TODO: Replace with database call
 * Example: const { data } = await supabase.from('aspect_ratios').select('*').order('grid_position');
 */

import { 
  ArrowLeftRight, 
  ArrowUpDown, 
  Maximize2 
} from 'lucide-react';
import { AspectRatioOption } from '../types/aspectRatio';

/**
 * All available aspect ratios
 * NOTE: Icon mapping will need special handling when fetching from database
 */
export const aspectRatios: AspectRatioOption[] = [
  { id: '21:9', label: '21:9', value: '21:9', icon: ArrowLeftRight, gridPosition: 1, centerEffect: 'left' },
  { id: '16:9', label: '16:9', value: '16:9', icon: ArrowLeftRight, gridPosition: 2, centerEffect: 'top' },
  { id: '3:2', label: '3:2', value: '3:2', icon: ArrowLeftRight, gridPosition: 3, centerEffect: 'bottom' },
  { id: '5:4', label: '5:4', value: '5:4', icon: Maximize2, gridPosition: 4, centerEffect: 'right' },
  { id: '1:1', label: '1:1', value: '1:1', icon: Maximize2, gridPosition: 5, centerEffect: 'top-left' },
  { id: '4:5', label: '4:5', value: '4:5', icon: ArrowUpDown, gridPosition: 6, centerEffect: 'bottom-right' },
  { id: '9:16', label: '9:16', value: '9:16', icon: ArrowUpDown, gridPosition: 7, centerEffect: 'bottom-left' },
  { id: '9:21', label: '9:21', value: '9:21', icon: ArrowUpDown, gridPosition: 8, centerEffect: 'top-right' },
];

/**
 * Icon name mapping for database storage
 */
export const iconMap: Record<string, any> = {
  ArrowLeftRight,
  ArrowUpDown,
  Maximize2,
};
