/**
 * PROMPT ENHANCEMENT SCHEMA
 * 
 * This schema defines what we send to the LLM API to enhance/craft
 * the final prompt BEFORE sending to the image generation API.
 * 
 * FLOW:
 * 1. Collect user inputs from UI
 * 2. Send to LLM API → Prompt Enhancement
 * 3. Receive enhanced prompt from LLM
 * 4. Send enhanced prompt to Image Generation API (Stability AI, DALL-E, etc.)
 */

/**
 * PROMPT ENHANCEMENT REQUEST
 * What we send to the LLM API for prompt enhancement
 */
export interface PromptEnhancementRequest {
  // ============================================================
  // GENERATOR TYPE (REQUIRED)
  // ============================================================
  
  /**
   * Generator Type
   * REQUIRED - Determines how the LLM structures the enhanced prompt
   * 
   * Values:
   * - 'tattty': TaTTTy generator (Q1 + Q2 format, strict requirements)
   * - 'freestyle': Freestyle generator (single prompt, all options optional)
   * 
   * From: GeneratorPage.tsx - selectedGenerator state
   */
  generatorType: 'tattty' | 'freestyle';
  
  
  // ============================================================
  // TEXT INPUTS (REQUIRED)
  // ============================================================
  
  /**
   * Question 1: "What does this tattoo represent?"
   * From: SourceCard component (TaTTTy) or FreestyleCard (Freestyle)
   * Minimum: 50 characters
   */
  questionOne: string;
  
  /**
   * Question 2: "Any details we should capture?"
   * From: SourceCard component (TaTTTy) or FreestyleCard (Freestyle)
   * Minimum: 50 characters
   */
  questionTwo: string;
  
  
  // ============================================================
  // STYLE OPTIONS (REQUIRED for TaTTTy, OPTIONAL for Freestyle)
  // ============================================================
  
  /**
   * Tattoo Style
   * From: StylePlacementSelector carousel
   * 
   * Values:
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
   * Default (TaTTTy): 'Traditional'
   */
  style: string;
  
  /**
   * Color Preference
   * From: SizeColorSelector carousel
   * 
   * Values:
   * - Black & Grey
   * - Color
   * - Blackwork
   * - Watercolor
   * 
   * Default (TaTTTy): 'Black & Grey'
   */
  color: string;
  
  
  // ============================================================
  // PLACEMENT & SIZE (OPTIONAL)
  // ============================================================
  
  /**
   * Body Placement
   * From: StylePlacementSelector carousel
   * 
   * Values:
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
   */
  placement?: string;
  
  /**
   * Tattoo Size
   * From: SizeColorSelector carousel
   * 
   * Values:
   * - Small
   * - Medium
   * - Large
   * - Extra Large
   */
  size?: string;
  
  
  // ============================================================
  // MOOD & ATMOSPHERE (REQUIRED for TaTTTy, OPTIONAL for Freestyle)
  // ============================================================
  
  /**
   * Mood/Vibe
   * From: MoodSelector component
   * 
   * Values: 50+ moods including
   * - Happy, Sad, Angry, Calm, Energetic, Mysterious, Romantic, etc.
   * 
   * Default (TaTTTy): 'Happy'
   */
  mood: string;
  
  
  // ============================================================
  // TECHNICAL SPECIFICATIONS
  // ============================================================
  
  /**
   * Output Type
   * From: OutputTypeButtons component
   * 
   * Values:
   * - 'color': Full color tattoo rendering
   * - 'stencil': Black stencil/outline style
   * 
   * Default: 'stencil'
   * 
   * Used by LLM to:
   * - Adjust prompt for stencil vs color rendering
   * - Specify line work vs shading emphasis
   */
  outputType: 'color' | 'stencil';
  
  /**
   * Aspect Ratio
   * From: AspectRatio component
   * 
   * Values:
   * - 21:9 (Ultra-wide landscape)
   * - 16:9 (Wide landscape)
   * - 3:2  (Landscape)
   * - 5:4  (Almost square landscape)
   * - 1:1  (Square) ← DEFAULT
   * - 4:5  (Almost square portrait)
   * - 9:16 (Portrait)
   * - 9:21 (Ultra-tall portrait)
   * 
   * Default: '1:1'
   * 
   * Used by LLM to:
   * - Adjust composition (horizontal vs vertical)
   * - Guide element placement in prompt
   */
  aspectRatio: string;
}


/**
 * PROMPT ENHANCEMENT RESPONSE
 * What we receive back from the LLM
 */
export interface PromptEnhancementResponse {
  /**
   * Enhanced prompt optimized for image generation
   * This gets sent directly to the image generation API
   */
  enhancedPrompt: string;
  
  /**
   * Optional: Negative prompt (what to avoid in the image)
   */
  negativePrompt?: string;
}


/**
 * EXAMPLE REQUEST - TATTTY GENERATOR
 */
export const EXAMPLE_ENHANCEMENT_REQUEST_TATTTY: PromptEnhancementRequest = {
  // Generator type
  generatorType: 'tattty',
  
  // Text inputs
  questionOne: 'This tattoo represents my grandmother who raised me. She loved roses and was the strongest person I knew. I want to honor her memory with something beautiful and timeless.',
  questionTwo: 'I\'d love to include a rose with thorns, maybe some delicate shading. Something elegant but not too feminine. I want it to look classic and last forever.',
  
  // Style options (REQUIRED for TaTTTy)
  style: 'Traditional',
  color: 'Black & Grey',
  
  // Placement & size (optional)
  placement: 'Forearm',
  size: 'Medium',
  
  // Mood (REQUIRED for TaTTTy)
  mood: 'Nostalgic',
  
  // Technical specs
  outputType: 'stencil',
  aspectRatio: '1:1'
};


/**
 * EXAMPLE REQUEST - FREESTYLE GENERATOR
 */
export const EXAMPLE_ENHANCEMENT_REQUEST_FREESTYLE: PromptEnhancementRequest = {
  // Generator type
  generatorType: 'freestyle',
  
  // Text inputs
  questionOne: 'A highly detailed biomechanical sleeve design featuring gears, pistons, and mechanical components seamlessly integrated with organic muscle tissue.',
  questionTwo: 'Dark industrial aesthetic with chrome and steel finishes. Want it to look like the mechanics are part of the body, not just on top of it.',
  
  // Style options (optional for Freestyle, but user selected them)
  style: 'Realism',
  color: 'Color',
  
  // Placement & size (optional)
  placement: 'Upper Arm',
  size: 'Large',
  
  // Mood (optional for Freestyle)
  mood: 'Mysterious',
  
  // Technical specs
  outputType: 'color',
  aspectRatio: '9:16'
};


/**
 * EXAMPLE LLM PROMPT TEMPLATE
 * How we structure the prompt to the LLM
 */
export const LLM_SYSTEM_PROMPT = `You are an expert tattoo design consultant and prompt engineer. Your job is to take user inputs about their desired tattoo and craft a highly detailed, optimized prompt for image generation.

INSTRUCTIONS:
- Create vivid, specific descriptions with strong visual language
- Include style-specific terminology (e.g., "bold outlines" for Traditional, "photorealistic shading" for Realism)
- Specify composition based on aspect ratio
- Account for output type (stencil = emphasis on linework, color = emphasis on shading/color)
- Incorporate mood into visual atmosphere
- Keep prompt under 500 words
- Focus on visual elements, not emotions or abstract concepts

Return ONLY the enhanced prompt, nothing else.`;

export const buildLLMUserPrompt = (request: PromptEnhancementRequest): string => {
  return `Generate an enhanced tattoo design prompt based on these inputs:

GENERATOR TYPE: ${request.generatorType.toUpperCase()}

DESIGN CONCEPT:
Question 1: "${request.questionOne}"
Question 2: "${request.questionTwo}"

STYLE SPECIFICATIONS:
- Style: ${request.style}
- Color: ${request.color}
- Placement: ${request.placement || 'Not specified'}
- Size: ${request.size || 'Not specified'}

MOOD & ATMOSPHERE:
- Mood: ${request.mood}

TECHNICAL REQUIREMENTS:
- Output Type: ${request.outputType}
- Aspect Ratio: ${request.aspectRatio}

Create the enhanced prompt now:`;
};


/**
 * EXAMPLE RESPONSE
 */
export const EXAMPLE_ENHANCEMENT_RESPONSE: PromptEnhancementResponse = {
  enhancedPrompt: `A traditional American tattoo style rose design in black and grey, featuring a single large bloom with elegantly curved petals and sharp thorns along the stem. The composition is centered and balanced for square format, with bold outlines characteristic of traditional tattooing. Delicate gradient shading creates depth in the petals, ranging from deep blacks in the shadows to soft greys in the highlights. The rose should have a timeless, classic appearance with clean linework suitable for stencil application. The thorns are prominent but refined, adding subtle strength without overwhelming the elegance of the flower. The design captures a nostalgic, memorial quality while maintaining the bold, lasting nature of traditional tattoo art. Optimized for medium-sized forearm placement on medium skin tone, ensuring strong contrast and visibility in black and grey ink.`,
  
  negativePrompt: 'color, watercolor, realistic photo, blurry lines, weak outlines, overly feminine, too modern, abstract, unclear details'
};


/**
 * COMPLETE DATA FLOW
 * 
 * STEP 1: COLLECT FROM UI
 * ├─ generatorType (from GeneratorPage - selectedGenerator)
 * ├─ questionOne (from SourceCard)
 * ├─ questionTwo (from SourceCard)
 * ├─ style (from StylePlacementSelector)
 * ├─ color (from SizeColorSelector)
 * ├─ placement (from StylePlacementSelector)
 * ├─ size (from SizeColorSelector)
 * ├─ mood (from MoodSelector)
 * └─ aspectRatio (from AspectRatio)
 * 
 * STEP 2: SEND TO LLM API
 * POST {LLM_ENDPOINT}
 * Body: PromptEnhancementRequest
 * 
 * STEP 3: RECEIVE FROM LLM
 * Response: { enhancedPrompt: string, negativePrompt?: string }
 * 
 * STEP 4: SEND TO IMAGE GENERATION API
 * POST {IMAGE_GEN_ENDPOINT}
 * Body: {
 *   prompt: enhancedPrompt (from LLM),
 *   negative_prompt: negativePrompt (from LLM),
 *   aspect_ratio: aspectRatio (from user input),
 *   model: selectedModel (from ModelPicker),
 *   output_format: "png"
 * }
 * 
 * STEP 5: RECEIVE IMAGE
 * Response: { image: base64String }
 */


/**
 * REQUIRED vs OPTIONAL FIELDS
 */
export const FIELD_REQUIREMENTS = {
  // ALWAYS REQUIRED
  REQUIRED: [
    'generatorType',    // 'tattty' | 'freestyle'
    'questionOne',      // Min 50 characters
    'questionTwo',      // Min 50 characters
  ],
  
  // REQUIRED FOR TATTTY (with defaults)
  TATTTY_REQUIRED: [
    'style',           // Default: 'Traditional'
    'color',           // Default: 'Black & Grey'
    'mood',            // Default: 'Happy'
  ],
  
  // OPTIONAL (but always sent with defaults)
  OPTIONAL_WITH_DEFAULTS: [
    'outputType',      // Default: 'stencil'
    'aspectRatio',     // Default: '1:1'
  ],
  
  // TRULY OPTIONAL (may be undefined)
  OPTIONAL: [
    'placement',       // No default
    'size',            // No default
  ]
};
