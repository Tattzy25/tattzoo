"use client"

import { Hero } from "@/components/hero"
import { GradientBars } from "@/components/gradient-bars"

export function HeroSection() {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-y-auto">
      <GradientBars numBars={20} color="var(--primary)" />
      <Hero />
    </div>
  )
}
