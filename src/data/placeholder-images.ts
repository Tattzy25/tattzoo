/**
 * Placeholder Images Configuration
 * 
 * Central location for all placeholder image paths.
 * Replace these empty strings with actual image paths when ready.
 * 
 * Recommended structure:
 * - /public/images/placeholders/   - Generic placeholders
 * - /public/images/gallery/         - Example tattoo designs
 * - /public/images/featured/        - Featured design showcase
 * - /public/images/avatars/         - User avatar defaults
 * - /public/images/carousel/        - Carousel option previews
 */

/**
 * Generic placeholder for missing images
 * Can be a simple branded graphic with TaTTy colors
 */
export const DEFAULT_PLACEHOLDER = '';

/**
 * Carousel option preview images
 * Used in generator carousels for style, color, placement, size
 */
export const carouselPlaceholders = {
  // Style previews - visual examples of each tattoo style
  styles: {
    'Traditional': '',
    'Neo-traditional': '',
    'Realism': '',
    'Black & Grey': '',
    'Watercolor': '',
    'Japanese': '',
    'Tribal': '',
    'Geometric': '',
    'Minimalist': '',
    'Abstract': '',
  },
  
  // Color previews - color swatches or examples
  colors: {
    'Black & Grey': '',
    'Full Color': '',
    'Black': '',
    'Red': '',
    'Blue': '',
    'Green': '',
    'Custom': '',
  },
  
  // Placement previews - body part reference images
  placements: {
    'Forearm': '',
    'Upper Arm': '',
    'Shoulder': '',
    'Chest': '',
    'Back': '',
    'Leg': '',
    'Ribs': '',
    'Neck': '',
    'Hand': '',
    'Other': '',
  },
  
  // Size previews - size reference examples
  sizes: {
    'Small (1-3")': '',
    'Medium (3-6")': '',
    'Large (6-12")': '',
    'Sleeve/Large Area': '',
  },
};

/**
 * Gallery fallback images
 * Example tattoo designs to show in community gallery when no real content
 */
export const galleryExamples: string[] = [
  // Add paths to example tattoo images here
  // Example: '/images/gallery/example-traditional-1.png'
];

/**
 * Featured design showcase
 * High-quality featured design for display
 */
export const featuredDesign = {
  image: '', // Main featured tattoo design
  avatar: '', // User avatar for featured design
};

/**
 * Social proof avatars
 * User avatars for testimonials
 */
export const testimonialAvatars = {
  marcus: '', // Marcus T. avatar
  sofia: '',  // Sofia R. avatar
};

/**
 * Default user avatar
 * Generic avatar for users without custom avatar
 */
export const DEFAULT_AVATAR = '';

/**
 * Helper function to get carousel placeholder by category and item
 */
export function getCarouselPlaceholder(
  category: 'styles' | 'colors' | 'placements' | 'sizes',
  item: string
): string {
  return carouselPlaceholders[category][item as keyof typeof carouselPlaceholders[typeof category]] || DEFAULT_PLACEHOLDER;
}
