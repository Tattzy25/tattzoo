/**
 * SECTIONS INDEX
 * Central export point for all page sections
 * Sections are exported in the order they appear on the page
 */

// Note: Hero component is in src/components/hero.tsx and used via generator-page/components/hero-section.tsx
// Note: Footer component is in src/components/Footer.tsx
export { Stats } from './Stats/Stats';
export { SocialProof } from './SocialProof/SocialProof';
export { Pricing } from './Pricing/Pricing';

// Generator Sections
export { 
  CarouselPanel,
  MoodSelector,
  SizeColorSelector,
  StylePlacementSelector,
} from './Generator';
