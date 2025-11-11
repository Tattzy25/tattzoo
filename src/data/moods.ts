/**
 * MOODS DATA
 * All mood/theme options for tattoo generator
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
 * const moodsUrl = getContentEndpoint('moods');
 * const response = await fetch(moodsUrl);
 * if (!response.ok) {
 *   throw new Error('CRITICAL: Failed to load moods from database');
 * }
 * const data = await response.json();
 * 
 * Example Supabase integration:
 * const { data, error } = await supabase.from('tattoo_moods').select('*').order('label');
 * if (error) throw new Error('CRITICAL: Failed to load moods');
 * // Map icon names from DB to actual icon components using iconMap
 * return data.map(mood => ({ ...mood, icon: iconMap[mood.iconName] }));
 */

import { 
  Smile, 
  Moon, 
  Waves, 
  Zap, 
  HeartHandshake, 
  Sparkle, 
  Flame, 
  Minus,
  Skull,
  Flower2,
  Mountain,
  Stars,
  Compass,
  Gem,
  Feather,
  Wind,
  Sun,
  CloudRain,
  Heart,
  Eye
} from 'lucide-react';
import { Mood } from '../types/mood';

/**
 * All available moods
 * 
 * MIGRATION PATH:
 * - Database Table: `tattoo_moods`
 * - API Endpoint: getContentEndpoint('moods') -> '/api/content/moods'
 * - Query: SELECT id, label, icon_name, description, is_active FROM tattoo_moods WHERE is_active = true ORDER BY popularity DESC
 * 
 * NOTE: Icon mapping will need special handling when fetching from database
 * Store icon name as string in DB (e.g., 'Smile'), then map to actual component using iconMap below
 * 
 * FAIL LOUD: When database is connected, missing moods should throw error
 */
export const moods: Mood[] = [
  { id: 'happy', label: 'Happy', icon: Smile },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'calm', label: 'Calm', icon: Waves },
  { id: 'bold', label: 'Bold', icon: Zap },
  { id: 'romantic', label: 'Romantic', icon: HeartHandshake },
  { id: 'spiritual', label: 'Spiritual', icon: Sparkle },
  { id: 'energetic', label: 'Energetic', icon: Flame },
  { id: 'minimalist', label: 'Minimalist', icon: Minus },
  { id: 'mysterious', label: 'Mysterious', icon: Skull },
  { id: 'playful', label: 'Playful', icon: Flower2 },
  { id: 'fierce', label: 'Fierce', icon: Mountain },
  { id: 'peaceful', label: 'Peaceful', icon: Stars },
  { id: 'adventurous', label: 'Adventurous', icon: Compass },
  { id: 'elegant', label: 'Elegant', icon: Gem },
  { id: 'free', label: 'Free', icon: Feather },
  { id: 'wild', label: 'Wild', icon: Wind },
  { id: 'joyful', label: 'Joyful', icon: Sun },
  { id: 'melancholy', label: 'Melancholy', icon: CloudRain },
  { id: 'passionate', label: 'Passionate', icon: Heart },
  { id: 'mystic', label: 'Mystic', icon: Eye },
  { id: 'rebellious', label: 'Rebellious', icon: Zap },
  { id: 'serene', label: 'Serene', icon: Waves },
  { id: 'powerful', label: 'Powerful', icon: Flame },
  { id: 'dreamy', label: 'Dreamy', icon: Moon },
];

/**
 * Icon name mapping for database storage
 * 
 * USAGE IN DATABASE:
 * 1. Store icon name as string in database (e.g., iconName: 'Smile')
 * 2. When fetching from database, map the string to the component:
 *    const mood = { id: 'happy', label: 'Happy', iconName: 'Smile' };
 *    const moodWithIcon = { ...mood, icon: iconMap[mood.iconName] };
 * 
 * FAIL LOUD: If icon name from DB doesn't exist in map, log error
 */
export const iconMap: Record<string, any> = {
  Smile,
  Moon,
  Waves,
  Zap,
  HeartHandshake,
  Sparkle,
  Flame,
  Minus,
  Skull,
  Flower2,
  Mountain,
  Stars,
  Compass,
  Gem,
  Feather,
  Wind,
  Sun,
  CloudRain,
  Heart,
  Eye,
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
 * Helper function to load moods from database (future implementation)
 * 
 * IMPLEMENTATION NOTES:
 * - Add error handling with fail-loud approach
 * - Cache results in memory/localStorage
 * - Map icon names to components
 * - Validate all required fields
 */
export async function loadMoodsFromDatabase(): Promise<Mood[]> {
  // TODO: Implement when database is ready
  // import { getContentEndpoint } from '@/config';
  // 
  // const url = getContentEndpoint('moods');
  // const response = await fetch(url);
  // 
  // if (!response.ok) {
  //   throw new Error(`Failed to load moods from database: ${response.statusText}`);
  // }
  // 
  // const data = await response.json();
  // 
  // // Map icon names to components
  // return data.map((mood: any) => ({
  //   id: mood.id,
  //   label: mood.label,
  //   icon: mapIconName(mood.iconName),
  // }));
  
  console.warn(
    '⚠️ USING STATIC MOODS DATA: Database integration not yet implemented. ' +
    'Connect to database using getContentEndpoint("moods") from @/config for dynamic data.'
  );
  
  return moods;
}
