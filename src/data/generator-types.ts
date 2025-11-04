/**
 * GENERATOR CONFIGURATION
 * Single default TaTTTy AI generator configuration
 * 
 * TODO: Replace with database call
 * Example: const { data } = await supabase.from('generator_config').select('*');
 */

/**
 * Default generator configuration (TaTTTy AI)
 */
export const DEFAULT_GENERATOR_ID = 'tattty';
export const DEFAULT_GENERATOR_NAME = 'TaTTTy';
export const DEFAULT_GENERATOR_TAGLINE = 'Your Vision, Zero Limits';
export const DEFAULT_GENERATOR_DESCRIPTION = 'Complete creative control. Upload references, describe your concept, and watch AI bring it to life.';

/**
 * Carousel Categories Configuration
 * Used in GeneratorCarouselPanel for style/color/where/size selectors
 */
export interface CarouselCategory {
  id: string;
  label: string;
  required: boolean;
  items: string[];
}

export const carouselCategories: CarouselCategory[] = [
  {
    id: 'style',
    label: 'Style',
    required: true,
    items: [] // Will be populated from generator-options.ts
  },
  {
    id: 'color',
    label: 'Color',
    required: true,
    items: ['Black & Grey', 'Color', 'Blackwork', 'Watercolor']
  },
  {
    id: 'where',
    label: 'Where',
    required: false,
    items: [] // Will be populated from generator-options.ts
  },
  {
    id: 'size',
    label: 'Size',
    required: false,
    items: ['Small', 'Medium', 'Large', 'Extra Large']
  }
];
