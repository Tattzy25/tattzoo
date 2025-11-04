/**
 * Mock Data Generator - NO BACKEND CALLS
 * Generates mock tattoo designs and AI responses locally
 */

export interface GenerateParams {
  prompt?: string;
  model?: string;
  style?: string;
  placement?: string | null;
  size?: string | null;
  color?: string;
  mood?: string;
  skintone?: number;
  outputType?: 'color' | 'stencil';
  images?: File[]; // File objects, NOT base64 strings
  generatorType?: string;
}

/**
 * Generate mock tattoo image based on inputs
 * Returns placeholder image URL
 */
export async function generateMockTattooImage(params: GenerateParams): Promise<string> {
  // Simulate API delay (1-3 seconds)
  const delay = 1000 + Math.random() * 2000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  console.log('🎨 Generating mock tattoo with params:', params);
  
  // TODO: In production, this will be replaced with actual AI-generated images
  // For now, return empty string to indicate no mock image available
  // This function should not be used in production - connect to real backend instead
  console.warn('⚠️ Mock data generator is being used - connect to real backend for production');
  return '';
}

/**
 * Generate multiple mock variations
 */
export async function generateMockVariations(
  baseImage: string,
  count: number = 3
): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`🔄 Generating ${count} variations`);
  
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    results.push(await generateMockTattooImage({}));
  }
  
  return results;
}

/**
 * Mock AI chat response
 */
export async function generateMockAIResponse(
  message: string,
  context: 'optimize' | 'idea' | 'brainstorm'
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const responses = {
    optimize: {
      short: "Here's an optimized version: A minimalist black and grey tattoo design featuring geometric shapes with clean lines. Recommended placement: forearm or upper arm. Size: 3-4 inches for clarity.",
      medium: "Let me enhance that concept:\n\n**Style**: Minimalist blackwork with subtle shading\n**Placement**: Inner forearm for visibility\n**Size**: 3x4 inches - perfect balance\n**Details**: Clean lines, negative space emphasis\n**Estimated sessions**: 1-2 hours",
      long: "I've refined your idea into a cohesive design:\n\n**Concept**: Your vision translated into a modern minimalist piece\n**Visual Elements**:\n- Bold geometric base structure\n- Delicate line work accents\n- Strategic negative space\n\n**Technical Specs**:\n- Black ink primary, grey wash secondary\n- Fine line technique (3RL to 5RL)\n- Forearm placement (5-6 inches)\n\n**Why this works**: Clean geometry ages well, high contrast pops on skin, adaptable if you want to expand later."
    },
    idea: {
      concepts: "Here are 3 fresh concepts:\n\n1. **Celestial Minimalism**: Moon phases arranged in an arc with tiny stars\n2. **Nature Abstract**: Mountain silhouette dissolving into geometric triangles\n3. **Typography Flow**: Meaningful word in elegant script with watercolor accents",
      detailed: "Let me break down these ideas:\n\n**Option A - Geometric Mandala**\nCircular design with sacred geometry, 4-5 inch diameter, best on shoulder or thigh.\n\n**Option B - Floral Line Art**\nSingle flower in continuous line style, perfect for wrist or ankle, 2-3 inches.\n\n**Option C - Abstract Watercolor**\nColor splash with minimal black outline, dynamic and unique, 5-6 inches.",
      personalized: "Based on your style, I suggest:\n\n**Modern Minimalist Route**:\n- Clean geometric forms\n- Single color (black) for timeless appeal\n- Small to medium (2-4\")\n- Placement: wrist, forearm, or behind ear\n\n**Bold Statement Route**:\n- Large scale design (6-8\")\n- High contrast blackwork\n- Placement: upper arm, thigh, or back\n- Can expand into sleeve later"
    },
    brainstorm: {
      starter: "Great starting point! Let's explore directions:\n\n• What draws you to tattoos? Personal meaning, aesthetics, or both?\n• Any existing tattoos or is this your first?\n• Preferred vibe: bold & statement, or subtle & intimate?",
      deep: "Let me help you refine this:\n\n**Theme Exploration**:\n- Personal symbols or memories?\n- Natural elements (flora, fauna)?\n- Abstract concepts?\n- Cultural or spiritual significance?\n\n**Style Considerations**:\n- Traditional vs modern?\n- Realistic vs stylized?\n- Color or black/grey?\n\nTell me more about what resonates with you!",
      collaborative: "I love where this is going! Here's my take:\n\n**Combining Your Ideas**:\nWe could merge the geometric base with organic flourishes - imagine sacred geometry as the foundation, with nature-inspired details flowing through it.\n\n**Placement Strategy**:\nConsidering the concept's complexity, I'd recommend a larger canvas like upper arm or shoulder blade.\n\n**Next Steps**:\nWant me to sketch out how these elements would work together?"
    }
  };
  
  // Select response based on context and message length
  const contextResponses = responses[context];
  const messageLength = message.length;
  
  if (messageLength < 50) {
    return contextResponses[Object.keys(contextResponses)[0]];
  } else if (messageLength < 150) {
    return contextResponses[Object.keys(contextResponses)[1]] || contextResponses[Object.keys(contextResponses)[0]];
  } else {
    return contextResponses[Object.keys(contextResponses)[2]] || contextResponses[Object.keys(contextResponses)[0]];
  }
}

/**
 * Mock streaming AI response (for chat interfaces)
 */
export async function* streamMockAIResponse(
  message: string,
  context: 'optimize' | 'idea' | 'brainstorm'
): AsyncGenerator<string, void, unknown> {
  const fullResponse = await generateMockAIResponse(message, context);
  const words = fullResponse.split(' ');
  
  for (const word of words) {
    yield word + ' ';
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
  }
}

/**
 * Mock image edit operations
 */
export async function mockEditImage(
  imageUrl: string,
  action: 'upscale-2x-fast' | 'upscale-2x-conservative' | 'upscale-4x-creative' | 
         'inpaint' | 'outpaint' | 'erase' | 'remove-background' | 'replace-background' | 'relight'
): Promise<string> {
  // Simulate processing time based on action
  const delays: Record<string, number> = {
    'upscale-2x-fast': 2000,
    'upscale-2x-conservative': 3000,
    'upscale-4x-creative': 5000,
    'inpaint': 4000,
    'outpaint': 5000,
    'erase': 3000,
    'remove-background': 2000,
    'replace-background': 4000,
    'relight': 3000
  };
  
  await new Promise(resolve => setTimeout(resolve, delays[action] || 2000));
  
  console.log(`✨ Applied ${action} to image`);
  
  // In a real app, this would return the edited image
  // For now, return the original URL (no actual editing)
  return imageUrl;
}

/**
 * PLACEHOLDER Mood/Theme Data
 * TODO: Replace with database call when backend is connected
 * This data structure matches what will be returned from the database
 */
import { 
  Smile, 
  Moon, 
  Waves, 
  Zap, 
  HeartHandshake, 
  Sparkle, 
  Flame, 
  Minus,
  Skull,
  Flower2,
  Mountain,
  Stars,
  Compass,
  Gem,
  Feather,
  Wind,
  Sun,
  CloudRain,
  Heart,
  Eye
} from 'lucide-react';
import { Mood } from '../types/mood';

export const PLACEHOLDER_MOODS: Mood[] = [
  { id: 'happy', label: 'Happy', icon: Smile },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'calm', label: 'Calm', icon: Waves },
  { id: 'bold', label: 'Bold', icon: Zap },
  { id: 'romantic', label: 'Romantic', icon: HeartHandshake },
  { id: 'spiritual', label: 'Spiritual', icon: Sparkle },
  { id: 'energetic', label: 'Energetic', icon: Flame },
  { id: 'minimalist', label: 'Minimalist', icon: Minus },
  { id: 'mysterious', label: 'Mysterious', icon: Skull },
  { id: 'playful', label: 'Playful', icon: Flower2 },
  { id: 'fierce', label: 'Fierce', icon: Mountain },
  { id: 'peaceful', label: 'Peaceful', icon: Stars },
  { id: 'adventurous', label: 'Adventurous', icon: Compass },
  { id: 'elegant', label: 'Elegant', icon: Gem },
  { id: 'free', label: 'Free', icon: Feather },
  { id: 'wild', label: 'Wild', icon: Wind },
  { id: 'joyful', label: 'Joyful', icon: Sun },
  { id: 'melancholy', label: 'Melancholy', icon: CloudRain },
  { id: 'passionate', label: 'Passionate', icon: Heart },
  { id: 'mystic', label: 'Mystic', icon: Eye },
  { id: 'rebellious', label: 'Rebellious', icon: Zap },
  { id: 'serene', label: 'Serene', icon: Waves },
  { id: 'powerful', label: 'Powerful', icon: Flame },
  { id: 'dreamy', label: 'Dreamy', icon: Moon },
];

/**
 * Fetch moods from database
 * TODO: Implement when database is connected
 */
export async function fetchMoodsFromDatabase(): Promise<Mood[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // TODO: Replace with actual database call
  // const response = await fetch('/api/moods');
  // return response.json();
  
  console.log('📊 Using placeholder mood data. TODO: Connect to database');
  return PLACEHOLDER_MOODS;
}

/**
 * PLACEHOLDER Aspect Ratio Data
 * TODO: Replace with database call when backend is connected
 * This data structure matches what will be returned from the database
 */
import { 
  ArrowLeftRight, 
  ArrowUpDown, 
  Maximize2 
} from 'lucide-react';
import { AspectRatioOption } from '../types/aspectRatio';

export const PLACEHOLDER_ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '21:9', label: '21:9', value: '21:9', icon: ArrowLeftRight, gridPosition: 1, centerEffect: 'left' },
  { id: '16:9', label: '16:9', value: '16:9', icon: ArrowLeftRight, gridPosition: 2, centerEffect: 'top' },
  { id: '3:2', label: '3:2', value: '3:2', icon: ArrowLeftRight, gridPosition: 3, centerEffect: 'bottom' },
  { id: '5:4', label: '5:4', value: '5:4', icon: Maximize2, gridPosition: 4, centerEffect: 'right' },
  { id: '1:1', label: '1:1', value: '1:1', icon: Maximize2, gridPosition: 5, centerEffect: 'top-left' },
  { id: '4:5', label: '4:5', value: '4:5', icon: ArrowUpDown, gridPosition: 6, centerEffect: 'bottom-right' },
  { id: '9:16', label: '9:16', value: '9:16', icon: ArrowUpDown, gridPosition: 7, centerEffect: 'bottom-left' },
  { id: '9:21', label: '9:21', value: '9:21', icon: ArrowUpDown, gridPosition: 8, centerEffect: 'top-right' },
];

/**
 * Fetch aspect ratios from database
 * TODO: Implement when database is connected
 */
export async function fetchAspectRatiosFromDatabase(): Promise<AspectRatioOption[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // TODO: Replace with actual database call
  // const response = await fetch('/api/aspect-ratios');
  // return response.json();
  
  console.log('📊 Using placeholder aspect ratio data. TODO: Connect to database');
  return PLACEHOLDER_ASPECT_RATIOS;
}
