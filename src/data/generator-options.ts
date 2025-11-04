/**
 * GENERATOR OPTIONS DATA
 * Styles, placements, sizes, colors for tattoo generator
 * 
 * TODO: Replace with database calls
 * Example: const { data } = await supabase.from('tattoo_styles').select('*');
 */

/**
 * Tattoo Styles
 * TODO: Fetch from database table 'tattoo_styles'
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
 * TODO: Fetch from database table 'tattoo_placements'
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
 * TODO: Fetch from database table 'tattoo_sizes'
 */
export const tattooSizes: string[] = [
  'Small',
  'Medium',
  'Large',
  'Extra Large',
];

/**
 * Color Preferences
 * TODO: Fetch from database table 'color_preferences'
 */
export const colorPreferences: string[] = [
  'Black & Grey',
  'Color',
  'Blackwork',
  'Watercolor',
];
