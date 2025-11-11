/**
 * ASPECT RATIOS DATA
 * All aspect ratio options for image dimensions
 * 
 * MIGRATION STRATEGY:
 * Phase 1 (COMPLETE): Centralized data structure with icon mapping
 * Phase 2 (TODO): Replace with database calls
 * Phase 3 (TODO): Add CMS integration for real-time updates
 * 
 * DATABASE INTEGRATION:
 * When ready to migrate, use centralized content endpoints from @/config:
 * 
 * import { getContentEndpoint } from '@/config';
 * 
 * const aspectRatiosUrl = getContentEndpoint('aspectRatios');
 * const response = await fetch(aspectRatiosUrl);
 * if (!response.ok) {
 *   throw new Error('CRITICAL: Failed to load aspect ratios from database');
 * }
 * const data = await response.json();
 * 
 * Example Supabase integration:
 * const { data, error } = await supabase
 *   .from('aspect_ratios')
 *   .select('*')
 *   .order('grid_position');
 * 
 * if (error) throw new Error('CRITICAL: Failed to load aspect ratios');
 * // Map icon names from DB to actual icon components using iconMap
 * return data.map(ratio => ({ ...ratio, icon: iconMap[ratio.iconName] }));
 */

import { 
  ArrowLeftRight, 
  ArrowUpDown, 
  Maximize2 
} from 'lucide-react';
import { AspectRatioOption } from '../types/aspectRatio';

/**
 * All available aspect ratios
 * 
 * MIGRATION PATH:
 * - Database Table: `aspect_ratios`
 * - API Endpoint: getContentEndpoint('aspectRatios') -> '/api/content/aspect-ratios'
 * - Query: SELECT id, label, value, icon_name, grid_position, center_effect, is_active 
 *          FROM aspect_ratios WHERE is_active = true ORDER BY grid_position
 * 
 * NOTE: Icon mapping will need special handling when fetching from database
 * Store icon name as string in DB (e.g., 'ArrowLeftRight'), then map to actual component using iconMap below
 * 
 * FAIL LOUD: When database is connected, missing aspect ratios should throw error
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
 * 
 * USAGE IN DATABASE:
 * 1. Store icon name as string in database (e.g., iconName: 'ArrowLeftRight')
 * 2. When fetching from database, map the string to the component:
 *    const ratio = { id: '16:9', label: '16:9', iconName: 'ArrowLeftRight' };
 *    const ratioWithIcon = { ...ratio, icon: iconMap[ratio.iconName] };
 * 
 * FAIL LOUD: If icon name from DB doesn't exist in map, throw error
 */
export const iconMap: Record<string, any> = {
  ArrowLeftRight,
  ArrowUpDown,
  Maximize2,
};

/**
 * Helper function to map icon name from database to icon component
 * 
 * FAIL LOUD: Throws error if icon name is not found
 */
export function mapIconName(iconName: string): any {
  const icon = iconMap[iconName];
  
  if (!icon) {
    throw new Error(
      `CRITICAL: Icon "${iconName}" not found in iconMap. ` +
      `Available icons: ${Object.keys(iconMap).join(', ')}`
    );
  }
  
  return icon;
}

/**
 * Helper function to load aspect ratios from database (future implementation)
 * 
 * IMPLEMENTATION NOTES:
 * - Add error handling with fail-loud approach
 * - Cache results in memory/localStorage
 * - Map icon names to components
 * - Validate all required fields
 * - Ensure grid positions are unique
 */
export async function loadAspectRatiosFromDatabase(): Promise<AspectRatioOption[]> {
  // TODO: Implement when database is ready
  // import { getContentEndpoint } from '@/config';
  // 
  // const url = getContentEndpoint('aspectRatios');
  // const response = await fetch(url);
  // 
  // if (!response.ok) {
  //   throw new Error(`Failed to load aspect ratios from database: ${response.statusText}`);
  // }
  // 
  // const data = await response.json();
  // 
  // // Map icon names to components and validate
  // return data.map((ratio: any) => {
  //   if (!ratio.iconName) {
  //     throw new Error(`Aspect ratio ${ratio.id} missing iconName field`);
  //   }
  //   
  //   return {
  //     id: ratio.id,
  //     label: ratio.label,
  //     value: ratio.value,
  //     icon: mapIconName(ratio.iconName),
  //     gridPosition: ratio.gridPosition,
  //     centerEffect: ratio.centerEffect,
  //   };
  // });
  
  console.warn(
    '⚠️ USING STATIC ASPECT RATIO DATA: Database integration not yet implemented. ' +
    'Connect to database using getContentEndpoint("aspectRatios") from @/config for dynamic data.'
  );
  
  return aspectRatios;
}
