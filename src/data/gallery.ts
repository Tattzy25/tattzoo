/**
 * GALLERY DATA
 * All gallery images that will be fetched from database
 * 
 * CRITICAL REQUIREMENT: ALL TATTOO IMAGES MUST HAVE TRANSPARENT BACKGROUNDS (PNG with alpha channel)
 * - This is essential for overlay on skin previews
 * - Required for professional tattoo mockups
 * - Needed for user downloads and editing
 * 
 * TODO: Replace with database call
 * Example: const { data } = await supabase.from('gallery_designs').select('*');
 */

import { galleryExamples } from './placeholder-images';

export interface GalleryDesign {
  id: string;
  title: string;
  image: string; // MUST be PNG with transparent background
}

// NOTE: These are PLACEHOLDER images for UI testing only
// ⚠️ Replace with real transparent-background tattoo PNGs before production
// Current Imgur images may NOT have transparent backgrounds
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
 * TODO: Replace with database call for featured designs
 * Imported from centralized placeholder configuration
 */
export const carouselFallbackImages: string[] = galleryExamples;
