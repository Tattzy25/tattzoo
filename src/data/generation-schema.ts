/**
 * TATTTY GENERATION SCHEMA
 * Complete data structure sent to image generation API
 * 
 * This schema represents ALL data collected from the user interface
 * and sent when the "TAP TO CREATE" button is clicked.
 * 
 * ⚠️ CRITICAL IMAGE REQUIREMENT ⚠️
 * ALL generated tattoo images MUST be:
 * - PNG format with alpha channel (transparent background)
 * - Minimum 512x512px, Maximum 2048x2048px
 * - No white/colored backgrounds - MUST be transparent
 * - This is essential for tattoo mockups, skin overlays, and professional use
 * 
 * Last Updated: Phase 6 - Complete Data Collection
 */

/**
 * MAIN GENERATION REQUEST PAYLOAD
 * This is what gets sent to the backend API endpoint
 */
export interface GenerationRequest {
  // ============================================================
  // SOURCE CARD DATA (Required)
  // ============================================================
  sourceCard: {
    /**
     * Question 1: "What does this tattoo represent?"
     * REQUIRED - Minimum 50 characters
     * Collected from: SourceCard component, first textarea
     */
    questionOne: string;
    
    /**
     * Question 2: "Any details we should capture?"
     * REQUIRED - Minimum 50 characters
     * Collected from: SourceCard component, second textarea
     */
    questionTwo: string;
    
    /**
     * Optional reference images
     * File objects (sent as multipart/form-data when submitting to backend)
     * Collected from: SourceCard image upload
     */
    images?: string[];
  };
  
  
  // ============================================================
  // GENERATION OPTIONS
  // Mix of required (with defaults) and optional fields
  // ============================================================
  options: {
    /**
     * Tattoo Style
     * REQUIRED (default: 'Traditional')
     * 
     * Possible values:
     * - Traditional
     * - Neo-Traditional
     * - Realism
     * - Watercolor
     * - Minimalist
     * - Geometric
     * - Japanese
     * - Tribal
     * - Blackwork
     * - Dotwork
     * 
     * Collected from: StylePlacementSelector carousel
     * Data source: /data/generator-options.ts → tattooStyles
     */
    style?: string;
    
    /**
     * Body Placement
     * OPTIONAL
     * 
     * Possible values:
     * - Forearm
     * - Upper Arm
     * - Shoulder
     * - Back
     * - Chest
     * - Leg
     * - Ankle
     * - Wrist
     * - Neck
     * - Rib
     * 
     * Collected from: StylePlacementSelector carousel
     * Data source: /data/generator-options.ts → tattooPlacements
     */
    placement?: string;
    
    /**
     * Tattoo Size
     * OPTIONAL
     * 
     * Possible values:
     * - Small
     * - Medium
     * - Large
     * - Extra Large
     * 
     * Collected from: SizeColorSelector carousel
     * Data source: /data/generator-options.ts → tattooSizes
     */
    size?: string;
    
    /**
     * Color Preference
     * REQUIRED (default: 'Black & Grey')
     * 
     * Possible values:
     * - Black & Grey
     * - Color
     * - Blackwork
     * - Watercolor
     * 
     * Collected from: SizeColorSelector carousel
     * Data source: /data/generator-options.ts → colorPreferences
     */
    color?: string;
    
    /**
     * Mood/Vibe
     * REQUIRED (default: 'Happy')
     * 
     * Possible values: 50+ moods including
     * - Happy, Sad, Angry, Calm, Energetic, Mysterious, etc.
     * 
     * Collected from: MoodSelector component
     * Data source: /data/moods.ts → moods
     */
    mood?: string;
    
    /**
     * Aspect Ratio
     * OPTIONAL
     * Default: '1:1' (square)
     * 
     * Possible values:
     * - 21:9 (Ultra-wide landscape)
     * - 16:9 (Wide landscape)
     * - 3:2  (Landscape)
     * - 5:4  (Almost square landscape)
     * - 1:1  (Square) ← DEFAULT
     * - 4:5  (Almost square portrait)
     * - 9:16 (Portrait)
     * - 9:21 (Ultra-tall portrait)
     * 
     * Collected from: AspectRatio component
     * Data source: /data/aspect-ratios.ts → aspectRatios
     */
    aspectRatio?: string;
    
    /**
     * AI Model Selection
     * OPTIONAL
     * Default: 'sd3.5-large'
     * 
     * Values:
     * - 'sd3.5-large': Quality mode (slower, best quality)
     * - 'sd3-turbo': Speed mode (faster, good quality)
     * 
     * Collected from: ModelPicker component
     * Managed by: GeneratorContext
     */
    model?: 'sd3.5-large' | 'sd3-turbo';
  };
  
  
  // ============================================================
  // METADATA (AUTO-GENERATED)
  // ============================================================
  
  /**
   * Session ID
   * Auto-generated unique identifier for this generation session
   * Format: 'session_${timestamp}_${random}'
   */
  sessionId: string;
  
  /**
   * Timestamp
   * Unix timestamp (milliseconds) when session was created
   */
  timestamp: number;
  
  /**
   * User ID
   * Optional - Only present if user is authenticated
   * Currently not collected (no auth system)
   */
  userId?: string;
}


/**
 * EXAMPLE PAYLOADS
 */

/**
 * Example 1: Full Options
 */
export const EXAMPLE_TATTTY_FULL: GenerationRequest = {
  sourceCard: {
    questionOne: 'This tattoo represents my grandmother who raised me. She loved roses and was the strongest person I knew. I want to honor her memory with something beautiful and timeless.',
    questionTwo: 'I\'d love to include a rose with thorns, maybe some delicate shading. Something elegant but not too feminine. I want it to look classic and last forever.',
    images: ['data:image/png;base64,iVBORw0KGgo...'] // Optional reference images
  },
  
  options: {
    style: 'Traditional',
    placement: 'Forearm',
    size: 'Medium',
    color: 'Black & Grey',
    mood: 'Nostalgic',
    aspectRatio: '1:1',
    model: 'sd3.5-large'
  },
  
  sessionId: 'session_1698765432000_a3k9m2x7z',
  timestamp: 1698765432000,
  userId: undefined // No auth
};


/**
 * Example 2: Minimal (Required Only)
 */
export const EXAMPLE_TATTTY_MINIMAL: GenerationRequest = {
  sourceCard: {
    questionOne: 'This tattoo represents my journey through recovery and finding strength. It\'s about resilience and never giving up on yourself.',
    questionTwo: 'I want something that symbolizes growth and transformation. Maybe a phoenix or similar imagery that shows rising from the ashes.',
  },
  
  options: {
    style: 'Traditional', // Default applied
    color: 'Black & Grey', // Default applied
    mood: 'Happy', // Default applied
    aspectRatio: '1:1', // Default
    model: 'sd3.5-large' // Default
  },
  
  sessionId: 'session_1698765433000_b7j2n8y4p',
  timestamp: 1698765433000
};


/**
 * VALIDATION RULES
 */
export const VALIDATION_RULES = {
  // Text Requirements
  MIN_CHARACTERS: 50, // Minimum characters for all text inputs
  
  // Required Fields (with defaults)
  REQUIRED: {
    questionOne: 'Must be at least 50 characters',
    questionTwo: 'Must be at least 50 characters',
    style: 'Required (default: Traditional)',
    color: 'Required (default: Black & Grey)',
    mood: 'Required (default: Happy)'
  },
  
  // Default Values
  DEFAULTS: {
    style: 'Traditional',
    color: 'Black & Grey',
    mood: 'Happy',
    aspectRatio: '1:1',
    model: 'sd3.5-large' as const
  }
};


/**
 * DATA FLOW SUMMARY
 * 
 * 1. USER INPUTS (GeneratorPage.tsx)
 *    ├─ Generator Type Selection → setSelectedGenerator
 *    ├─ Source Card (TaTTTy) → SourceCard.tsx → sessionDataStore.setSourceCardData()
 *    ├─ Freestyle Card → FreestyleCard.tsx → sessionDataStore.setFreestyleData()
 *    ├─ Style/Placement → StylePlacementSelector
 *    ├─ Size/Color → SizeColorSelector
 *    ├─ Mood → MoodSelector
 *    ├─ Skintone → (removed)
 *    ├─ Aspect Ratio → AspectRatio
 *    └─ Model → ModelPicker → GeneratorContext
 * 
 * 2. SESSION STORAGE (sessionDataStore - submissionService.ts)
 *    ├─ setGeneratorType()
 *    ├─ setSourceCardData()
 *    ├─ setFreestyleData()
 *    └─ setOptions() ← ALL OPTIONS STORED HERE
 * 
 * 3. GENERATION TRIGGER (User clicks "TAP TO CREATE")
 *    ├─ GeneratorPage.handleGenerate()
 *    ├─ Validates required fields
 *    ├─ Applies defaults (TaTTTy only)
 *    ├─ Calls sessionDataStore.setOptions() with complete data
 *    └─ Calls sessionDataStore.submitToBackend()
 * 
 * 4. BACKEND API CALL (Future Implementation)
 *    POST /api/generate
 *    Body: GenerationRequest
 *    Response: { imageUrl: string, generationId: string }
 */
