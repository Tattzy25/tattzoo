/**
 * CONTENT DATA
 * All text content, headings, descriptions, messages
 * 
 * TODO: Replace with CMS/database call for multi-language support
 * Example: const { data } = await supabase.from('site_content').select('*').eq('language', 'en');
 */

/**
 * Validation Messages
 */
export const validationMessages = {
  tatttyQuestionsRequired: 'Please complete both questions with at least 50 characters each.',
  freestylePromptRequired: 'Please enter at least 50 characters in your prompt.',
  generationTimeout: 'Generation timed out. Please try again.',
};

/**
 * Section Headings
 */
export const sectionHeadings = {
  liveTheMagic: {
    title: 'LIVE THE MAGIC',
    description: 'Real designs created by real people using TaTTTy AI',
  },
  howItWorks: {
    title: 'HOW IT WORKS',
  },
  trustedByThousands: {
    title: 'TRUSTED BY THOUSANDS',
    description: 'Real people, real results, real tattoos',
  },
  licenseKey: {
    title: 'GET YOUR\\nPRIVATE KEY',
    price: '$9.99',
    description: 'Unlock unlimited tattoo designs',
    buttonText: 'UNLOCK NOW',
    paymentNote: 'Instant access',
  },
  freestyle: {
    title: 'Freestyle',
    describeItTitle: 'Describe It',
  },
  aspectRatio: {
    title: 'Image Dimensions',
  },
  mood: {
    title: 'Set Your Mood',
  },
  yourStory: {
    title: 'Your Story\nOur Ink',
  },
  chooseYourVibe: {
    title: 'Choose Your Vibe',
  },
  styledPhrases: {
    yourStory: { line1: 'Your', line2: 'Story' },
    yourPain: { line1: 'Your', line2: 'Pain' },
    intoInk: { line1: 'Into', line2: 'Ink' },
  },
  gallery: {
    viewAllButton: 'View All Designs',
  },
};

/**
 * Generator Types
 */
export const generatorTypes = {
  tattty: {
    id: 'tattty',
    title: 'TaTTTy',
    tagline: 'Your Vision, Zero Limits',
    description: 'Complete creative control. Upload references, describe your concept, and watch AI bring it to life.',
  },
  freestyle: {
    id: 'freestyle',
    title: 'Freestyle',
    tagline: 'Set the Mood, We Do the Rest',
    description: 'Choose your style, placement, and aesthetic. Let the AI interpret your energy.',
  },
};

/**
 * Footer Content
 */
export const footerContent = {
  brandName: 'TaTTTy',
  description: 'AI-powered tattoo design generator. Create meaningful tattoos based on your life story.',
  location: {
    city: 'Los Angeles',
    state: 'CA',
  },
  links: {
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookiePolicy: 'Cookie Policy',
  },
  madeWithAI: 'MADE WITH LOVE WITH 0 CODING , ALL AI GENERATED , 1000% NERVOUS WRECKED NOW CURRENTLY SEEING 6 PROFFESIONAL THERAPISTS FROM AI TRAUMA',
  copyright: '© 2025 TaTTTy. All rights reserved. Based in Los Angeles, California.',
};

/**
 * Button Labels
 */
export const buttonLabels = {
  generate: 'Generate',
  viewAll: 'View All Designs',
  unlockNow: 'UNLOCK NOW',
};

/**
 * Placeholder Text
 */
export const placeholders = {
  freestylePrompt: 'Describe your tattoo idea...',
  searchMood: 'Search moods...',
  resultsPlaceholder: 'Your unique design\nwill appear here',
};

/**
 * Share Content
 */
export const shareContent = {
  defaultText: 'Just made this with tattty.com🔥',
  title: 'My TaTTy Design',
};
