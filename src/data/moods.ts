/**
 * MOODS DATA
 * All mood/theme options for tattoo generator
 * 
 * TODO: Replace with database call
 * Example: const { data } = await supabase.from('moods').select('*').order('label');
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

/**
 * All available moods
 * NOTE: Icon mapping will need special handling when fetching from database
 * Consider storing icon name as string and mapping to actual icon component
 */
export const moods: Mood[] = [
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
 * Icon name mapping for database storage
 * When storing in database, save icon name as string
 * When fetching, use this map to convert back to icon component
 */
export const iconMap: Record<string, any> = {
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
  Eye,
};
