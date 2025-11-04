/**
 * SOCIAL PROOF DATA
 * Stats and testimonials
 * 
 * TODO: Replace with database calls
 * Stats Example: const { data } = await supabase.from('site_stats').select('*').single();
 * Testimonials Example: const { data } = await supabase.from('testimonials').select('*').limit(10);
 */

import { Users, TrendingUp, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  avatar: string;
  rating: number;
}

/**
 * Stats for social proof section
 * TODO: Fetch real-time stats from database
 */
export const socialProofStats: StatItem[] = [
  { icon: Users, value: '50K+', label: 'Designs Created' },
  { icon: TrendingUp, value: '98%', label: 'Satisfaction Rate' },
  { icon: Shield, value: '100%', label: 'Original Designs' }
];

/**
 * Testimonials from users
 * TODO: Fetch from database with pagination
 */
export const testimonials: Testimonial[] = [
  {
    name: 'Marcus T.',
    location: 'Brooklyn, NY',
    text: 'This shit changed my life. Got exactly what I wanted, artist loved it.',
    avatar: '', // Imported from placeholder-images.ts - see testimonialAvatars.marcus
    rating: 5
  },
  {
    name: 'Sofia R.',
    location: 'Miami, FL',
    text: "Finally! No more Pinterest fails. My sleeve design came out perfect.",
    avatar: '', // Imported from placeholder-images.ts - see testimonialAvatars.sofia
    rating: 5
  }
];

/**
 * Homepage stats (1K+ Designs, 10K+ Created, 5K+ TaTTTied)
 * TODO: Fetch real-time counts from database
 */
export interface HomePageStat {
  value: string;
  label: string;
}

export const homePageStats: HomePageStat[] = [
  { value: '1K+', label: 'Designs' },
  { value: '10K+', label: 'Created' },
  { value: '5K+', label: 'TaTTTied' },
];
