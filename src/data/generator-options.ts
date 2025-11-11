/**
 * GENERATOR OPTIONS DATA
 * Styles, placements, sizes, colors for tattoo generator
 * 
 * MIGRATION STRATEGY:
 * Phase 1 (COMPLETE): Move to centralized data structure
 * Phase 2 (TODO): Replace with database calls
 * Phase 3 (TODO): Add CMS integration for real-time updates
 * 
 * DATABASE INTEGRATION:
 * When ready to migrate, use centralized content endpoints from @/config:
 * 
 * import { getContentEndpoint } from '@/config';
 * 
 * const stylesUrl = getContentEndpoint('styles');
 * const response = await fetch(stylesUrl);
 * if (!response.ok) {
 *   throw new Error('Failed to load tattoo styles from database');
 * }
 * const data = await response.json();
 * 
 * Example Supabase integration:
 * const { data, error } = await supabase.from('tattoo_styles').select('*').order('name');
 * if (error) throw new Error('CRITICAL: Failed to load tattoo styles');
 * return data;
 */

/**
 * Tattoo Styles
 * 
 * MIGRATION PATH:
 * - Database Table: `tattoo_styles`
 * - API Endpoint: getContentEndpoint('styles') -> '/api/content/styles'
 * - Query: SELECT id, name, description, is_active FROM tattoo_styles WHERE is_active = true ORDER BY name
 * 
 * FAIL LOUD: When database is connected, missing styles should throw error
 */
export const tattooStyles: string[] = [
  'Traditional',
  'Neo-Traditional',
  'Realism',
  'Watercolor',
  'Minimalist',
  'Geometric',
  'Japanese',
  'Tribal',
  'Blackwork',
  'Dotwork',
];

/**
 * Tattoo Placements
 * 
 * MIGRATION PATH:
 * - Database Table: `tattoo_placements`
 * - API Endpoint: getContentEndpoint('placements') -> '/api/content/placements'
 * - Query: SELECT id, name, description, is_active FROM tattoo_placements WHERE is_active = true ORDER BY popularity DESC
 * 
 * FAIL LOUD: When database is connected, missing placements should throw error
 */
export const tattooPlacements: string[] = [
  'Forearm',
  'Upper Arm',
  'Shoulder',
  'Back',
  'Chest',
  'Leg',
  'Ankle',
  'Wrist',
  'Neck',
  'Rib',
];

/**
 * Tattoo Sizes
 * 
 * MIGRATION PATH:
 * - Database Table: `tattoo_sizes`
 * - API Endpoint: getContentEndpoint('sizes') -> '/api/content/sizes'
 * - Query: SELECT id, name, min_inches, max_inches, is_active FROM tattoo_sizes WHERE is_active = true ORDER BY min_inches
 * 
 * FAIL LOUD: When database is connected, missing sizes should throw error
 */
export const tattooSizes: string[] = [
  'Small',
  'Medium',
  'Large',
  'Extra Large',
];

/**
 * Color Preferences
 * 
 * MIGRATION PATH:
 * - Database Table: `tattoo_colors` (or `color_preferences`)
 * - API Endpoint: getContentEndpoint('colors') -> '/api/content/colors'
 * - Query: SELECT id, name, description, hex_codes, is_active FROM tattoo_colors WHERE is_active = true ORDER BY popularity DESC
 * 
 * FAIL LOUD: When database is connected, missing colors should throw error
 */
export const colorPreferences: string[] = [
  'Black & Grey',
  'Color',
  'Blackwork',
  'Watercolor',
];

/**
 * Helper function to load data from database (future implementation)
 * 
 * IMPLEMENTATION NOTES:
 * - Add error handling with fail-loud approach
 * - Cache results in memory/localStorage
 * - Add loading states
 * - Provide fallback only in development mode
 */
export async function loadGeneratorOptionsFromDatabase() {
  // TODO: Implement when database is ready
  // import { getContentEndpoint } from '@/config';
  // 
  // const [styles, placements, sizes, colors] = await Promise.all([
  //   fetch(getContentEndpoint('styles')).then(r => {
  //     if (!r.ok) throw new Error('Failed to load styles');
  //     return r.json();
  //   }),
  //   fetch(getContentEndpoint('placements')).then(r => {
  //     if (!r.ok) throw new Error('Failed to load placements');
  //     return r.json();
  //   }),
  //   fetch(getContentEndpoint('sizes')).then(r => {
  //     if (!r.ok) throw new Error('Failed to load sizes');
  //     return r.json();
  //   }),
  //   fetch(getContentEndpoint('colors')).then(r => {
  //     if (!r.ok) throw new Error('Failed to load colors');
  //     return r.json();
  //   }),
  // ]);
  // 
  // return { styles, placements, sizes, colors };
  
  console.warn(
    '⚠️ USING STATIC GENERATOR OPTIONS: Database integration not yet implemented. ' +
    'Connect to database using getContentEndpoint() from @/config for dynamic data.'
  );
  
  return {
    styles: tattooStyles,
    placements: tattooPlacements,
    sizes: tattooSizes,
    colors: colorPreferences,
  };
}
