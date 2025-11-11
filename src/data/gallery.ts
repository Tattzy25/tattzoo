/**
 * GALLERY DATA
 * All gallery images that will be fetched from database
 * 
 * CRITICAL REQUIREMENT: ALL TATTOO IMAGES MUST HAVE TRANSPARENT BACKGROUNDS (PNG with alpha channel)
 * - This is essential for overlay on skin previews
 * - Required for professional tattoo mockups
 * - Needed for user downloads and editing
 * 
 * MIGRATION STRATEGY:
 * Phase 1 (COMPLETE): Centralized data structure with validation requirements
 * Phase 2 (TODO): Replace with database calls
 * Phase 3 (TODO): Add Vercel Blob storage integration
 * Phase 4 (TODO): Add CMS integration for real-time updates
 * 
 * DATABASE INTEGRATION:
 * When ready to migrate, use centralized content endpoints from @/config:
 * 
 * import { getContentEndpoint } from '@/config';
 * 
 * const galleryUrl = getContentEndpoint('gallery');
 * const response = await fetch(galleryUrl);
 * if (!response.ok) {
 *   throw new Error('CRITICAL: Failed to load gallery from database');
 * }
 * const data = await response.json();
 * 
 * Example Supabase integration:
 * const { data, error } = await supabase
 *   .from('gallery_designs')
 *   .select('id, title, image_url, thumbnail_url, is_active')
 *   .eq('is_active', true)
 *   .order('created_at', { ascending: false });
 * 
 * if (error) throw new Error('CRITICAL: Failed to load gallery');
 * return data;
 */

import { galleryExamples } from './placeholder-images';
import { GALLERY_IMAGE_REQUIREMENTS } from '@/config';

export interface GalleryDesign {
  id: string;
  title: string;
  image: string; // MUST be PNG with transparent background
}

/**
 * IMPORTANT NOTES ABOUT CURRENT GALLERY IMAGES:
 * 
 * ⚠️ TRANSPARENCY WARNING:
 * The current Imgur URLs are PLACEHOLDER images for UI testing only.
 * They may NOT have transparent backgrounds, which is REQUIRED for production.
 * 
 * MIGRATION PATH:
 * - Database Table: `gallery_designs`
 * - API Endpoint: getContentEndpoint('gallery') -> '/api/content/gallery'
 * - Storage: Vercel Blob or CDN with proper image processing
 * 
 * IMAGE REQUIREMENTS (from @/config):
 * - Format: ${GALLERY_IMAGE_REQUIREMENTS.format}
 * - Min Width: ${GALLERY_IMAGE_REQUIREMENTS.minWidth}px
 * - Min Height: ${GALLERY_IMAGE_REQUIREMENTS.minHeight}px
 * - Max File Size: ${GALLERY_IMAGE_REQUIREMENTS.maxFileSize / 1024 / 1024}MB
 * - Transparency: ${GALLERY_IMAGE_REQUIREMENTS.requiredTransparency ? 'REQUIRED' : 'Optional'}
 * 
 * FAIL LOUD: Replace these URLs with proper transparent PNGs before production
 */
export const galleryDesigns: GalleryDesign[] = [
  { id: '1', title: 'Black Design', image: 'https://i.imgur.com/7LSHoSe.png' },
  { id: '2', title: 'Minimalist', image: 'https://i.imgur.com/iEA79XE.png' },
  { id: '3', title: 'Geometric', image: 'https://i.imgur.com/Q89Qc0M.png' },
  { id: '4', title: 'Traditional', image: 'https://i.imgur.com/TkTn1GN.png' },
  { id: '5', title: 'Watercolor', image: 'https://i.imgur.com/Osfjl9b.png' },
  { id: '6', title: 'Japanese', image: 'https://i.imgur.com/7ThrYMD.png' },
  { id: '7', title: 'Tribal', image: 'https://i.imgur.com/6gqKzyS.png' },
  { id: '8', title: 'Floral', image: 'https://i.imgur.com/xXSWDzD.png' },
  { id: '9', title: 'Dragon', image: 'https://i.imgur.com/IrToa4J.png' },
  { id: '10', title: 'Skull', image: 'https://i.imgur.com/IRfX9uu.png' },
  { id: '11', title: 'Rose', image: 'https://i.imgur.com/mSSvGPm.png' },
  { id: '12', title: 'Butterfly', image: 'https://i.imgur.com/kLUbnIe.png' },
  { id: '13', title: 'Wolf', image: 'https://i.imgur.com/fa1wmHR.png' },
  { id: '14', title: 'Lion', image: 'https://i.imgur.com/O2yVpKE.jpg' },
  { id: '15', title: 'Snake', image: 'https://i.imgur.com/SQqlyCx.png' },
  { id: '16', title: 'Phoenix', image: 'https://i.imgur.com/IyJWQ5h.png' },
  { id: '17', title: 'Mandala', image: 'https://i.imgur.com/PtJO5Zp.png' },
  { id: '18', title: 'Compass', image: 'https://i.imgur.com/7V7HLCe.png' },
  { id: '19', title: 'Anchor', image: 'https://i.imgur.com/7gvvKdy.png' },
  { id: '20', title: 'Feather', image: 'https://i.imgur.com/CBTZ11d.png' },
  { id: '21', title: 'Arrow', image: 'https://i.imgur.com/lK73zkg.png' },
  { id: '22', title: 'Moon', image: 'https://i.imgur.com/sVuGUEM.png' },
  { id: '23', title: 'Star', image: 'https://i.imgur.com/JjSyvXk.png' },
  { id: '24', title: 'Tree', image: 'https://i.imgur.com/Yzvi7HC.png' },
  { id: '25', title: 'Mountain', image: 'https://i.imgur.com/7PiOVMP.png' },
  { id: '26', title: 'Wave', image: 'https://i.imgur.com/iwomkZi.png' },
  { id: '27', title: 'Sun', image: 'https://i.imgur.com/yO9mdhH.png' },
  { id: '28', title: 'Crown', image: 'https://i.imgur.com/Hm7P9TZ.png' },
  { id: '29', title: 'Heart', image: 'https://i.imgur.com/05dSSDu.png' },
  { id: '30', title: 'Wings', image: 'https://i.imgur.com/MPFXa44.png' },
];

/**
 * Fallback images for carousel
 * 
 * MIGRATION PATH:
 * - Database Table: `featured_gallery_designs`
 * - API Endpoint: getContentEndpoint('gallery') with query parameter ?featured=true
 * 
 * Imported from centralized placeholder configuration
 */
export const carouselFallbackImages: string[] = galleryExamples;

/**
 * Helper function to load gallery from database (future implementation)
 * 
 * IMPLEMENTATION NOTES:
 * - Add error handling with fail-loud approach
 * - Validate image transparency
 * - Cache results in memory
 * - Add loading states
 * - Validate image dimensions and format
 * 
 * FAIL LOUD: Missing or invalid images should throw errors
 */
export async function loadGalleryFromDatabase(): Promise<GalleryDesign[]> {
  // TODO: Implement when database is ready
  // import { getContentEndpoint } from '@/config';
  // 
  // const url = getContentEndpoint('gallery');
  // const response = await fetch(url);
  // 
  // if (!response.ok) {
  //   throw new Error(`Failed to load gallery from database: ${response.statusText}`);
  // }
  // 
  // const data = await response.json();
  // 
  // // Validate all images meet requirements
  // data.forEach((design: GalleryDesign) => {
  //   if (!design.image.endsWith('.png')) {
  //     console.error(
  //       `❌ GALLERY IMAGE ERROR: ${design.id} "${design.title}" ` +
  //       `is not a PNG file. Transparent background required.`
  //     );
  //   }
  // });
  // 
  // return data;
  
  console.warn(
    '⚠️ USING STATIC GALLERY DATA: Database integration not yet implemented. ' +
    'Connect to database using getContentEndpoint("gallery") from @/config for dynamic data. ' +
    '\n⚠️ WARNING: Current Imgur images may not have transparent backgrounds!'
  );
  
  return galleryDesigns;
}
