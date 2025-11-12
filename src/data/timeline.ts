/**
 * TIMELINE DATA
 * "How It Works" section steps
 * 
 * TODO: Replace with database call
 * Example: const { data } = await supabase.from('timeline_steps').select('*').order('step_order');
 */

import { Sparkles, Wand2, Download } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TimelineStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const timelineSteps: TimelineStep[] = [
  {
    icon: Sparkles,
    title: "Get Your Key on van nuys",
    description: "Unlock unlimited access to all TaTTTy features with a one-time $9.99 license key."
  },
  {
    icon: Wand2,
    title: "Bring Your Memory & Vision to Life",
    description: "Tell us your tattoo idea, upload references, set the mood, and customize every detail."
  },
  {
    icon: Sparkles,
    title: "AI Creates Your Unique Design",
    description: "Our AI generates one-of-a-kind tattoo designs tailored to your exact specifications."
  },
  {
    icon: Download,
    title: "Download & Get That Shit Tatted",
    description: "Save your favorite designs and bring them to your tattoo artist for the final ink."
  }
];
