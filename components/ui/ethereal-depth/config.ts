"use client"

import type { SpringOptions } from "framer-motion"

// This file centralizes all static configuration for the EtherealDepth component,
// promoting easier maintenance and separation of concerns.

export const BACKGROUND_GRADIENT = "linear-gradient(135deg, #020010 0%, #0a0a23 50%, #020010 100%)"

export const SCROLL_ANIMATION_CONFIG = {
  spring: { stiffness: 100, damping: 20, mass: 0.5 } as SpringOptions,
  scale: [1, 1.5],
  y: [0, -200],
  opacity: [1, 0.8, 0],
  maskOpacity: [0, 1],
}

export const MASK_CONFIG = {
  background: "rgba(2, 0, 16, 0.9)",
  zIndex: 50,
}

export const ARC_CONFIGURATIONS = [
  {
    // REFINEMENT: Removed 'delay' property. Timing is now handled by the parent's staggerChildren.
    scale: 1.3,
    opacity: 0.8,
    zIndex: 5,
    parallaxStrength: -20,
    gradients: [
      {
        background: `linear-gradient(135deg, #2DD4BF 0%, #3B82F6 50%, #1E3A8A 100%)`,
        animationType: "position" as const,
        animationDuration: 18,
      },
    ],
  },
  {
    scale: 1.2,
    opacity: 0.3,
    zIndex: 10,
    parallaxStrength: -15,
    gradients: [
      {
        background: `radial-gradient(ellipse 80% 60% at 75% 25%, rgba(30, 58, 138, 0.5) 0%, rgba(59, 130, 246, 0.3) 25%, rgba(37, 99, 235, 0.2) 50%, transparent 70%)`,
        animationBackgrounds: [
          `radial-gradient(ellipse 80% 60% at 75% 25%, rgba(30, 58, 138, 0.5) 0%, rgba(59, 130, 246, 0.3) 25%, rgba(37, 99, 235, 0.2) 50%, transparent 70%)`,
          `radial-gradient(ellipse 82% 62% at 76% 26%, rgba(30, 58, 138, 0.55) 0%, rgba(59, 130, 246, 0.35) 25%, rgba(37, 99, 235, 0.25) 50%, transparent 70%)`,
          `radial-gradient(ellipse 80% 60% at 75% 25%, rgba(30, 58, 138, 0.5) 0%, rgba(59, 130, 246, 0.3) 25%, rgba(37, 99, 235, 0.2) 50%, transparent 70%)`,
        ],
        animationDuration: 8,
      },
    ],
  },
  {
    scale: 1.0,
    opacity: 0.5,
    zIndex: 20,
    parallaxStrength: -8,
    gradients: [
      {
        background: `radial-gradient(ellipse 70% 50% at 70% 30%, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.4) 30%, transparent 60%)`,
        animationBackgrounds: [
          `radial-gradient(ellipse 70% 50% at 70% 30%, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.4) 30%, transparent 60%)`,
          `radial-gradient(ellipse 72% 52% at 71% 31%, rgba(59, 130, 246, 0.65) 0%, rgba(37, 99, 235, 0.45) 30%, transparent 60%)`,
          `radial-gradient(ellipse 70% 50% at 70% 30%, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.4) 30%, transparent 60%)`,
        ],
        animationDuration: 7,
      },
    ],
  },
  {
    scale: 0.8,
    opacity: 0.7,
    zIndex: 30,
    parallaxStrength: -3,
    gradients: [
      {
        background: `radial-gradient(ellipse 60% 40% at 65% 35%, rgba(96, 165, 250, 0.7) 0%, rgba(59, 130, 246, 0.5) 25%, transparent 50%)`,
        animationBackgrounds: [
          `radial-gradient(ellipse 60% 40% at 65% 35%, rgba(96, 165, 250, 0.7) 0%, rgba(59, 130, 246, 0.5) 25%, transparent 50%)`,
          `radial-gradient(ellipse 62% 42% at 66% 36%, rgba(96, 165, 250, 0.75) 0%, rgba(59, 130, 246, 0.55) 25%, transparent 50%)`,
          `radial-gradient(ellipse 60% 40% at 65% 35%, rgba(96, 165, 250, 0.7) 0%, rgba(59, 130, 246, 0.5) 25%, transparent 50%)`,
        ],
        animationDuration: 6,
      },
    ],
  },
]

export const ETHEREAL_SPOTLIGHT_CONFIG = {
  background: `radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.08) 25%, transparent 60%)`,
  zIndex: 50,
}

// Type alias for a single arc configuration for cleaner props
export type ArcConfig = (typeof ARC_CONFIGURATIONS)[0]
