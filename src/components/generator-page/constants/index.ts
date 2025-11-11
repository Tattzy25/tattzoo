export const HERO_BACKGROUND = '/images/hero-background.jpg';

export const HOME_PAGE_STATS = [
  { value: '10K+', label: 'Designs Created' },
  { value: '500+', label: 'Happy Customers' },
  { value: '4.9★', label: 'Average Rating' },
];

export const DEFAULT_VALUES = {
  STYLE: 'Traditional',
  COLOR: 'Black & Grey',
  MOOD: 'happy',
  ASPECT_RATIO: '1:1',
} as const;

export const VALIDATION_MESSAGES = {
  LICENSE_REQUIRED: 'Please verify your license key first',
  SUBMIT_FIRST: 'Click Submit First!',
  GENERATION_FAILED: 'Generation failed. Please try again.',
} as const;

export const TIMEOUTS = {
  VALIDATION_ERROR: 3000,
  GENERATION_DELAY: 500,
} as const;