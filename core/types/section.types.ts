/**
 * Core section types for modular landing page architecture
 * Ensures type safety and contract compliance across all sections
 */

export interface BaseSectionProps {
  id: string
  className?: string
  'data-testid'?: string
}

export interface SectionConfig {
  id: string
  name: string
  version: string
  enabled: boolean
  dependencies: string[]
  props: Record<string, string>
  order: number
  component: React.ComponentType<any>
}

export interface Feature {
  icon: React.ComponentType<{ className?: string }>
  text: string
  href?: string
}

export interface HeroSectionProps extends BaseSectionProps {
  title: string
  subtitle: string
  description: string
  features: Feature[]
  dynamicWords: string[]
  onFeatureClick?: (feature: Feature) => void
}

export interface MenuItem {
  name: string
  href: string
}

export interface NavigationProps {
  items: MenuItem[]
  logo?: React.ComponentType<{ className?: string }>
  className?: string
}

// Animation and interaction types
export interface BlurTextProps {
  text?: string
  delay?: number
  className?: string
  animateBy?: "words" | "letters"
  direction?: "top" | "bottom"
  threshold?: number
  rootMargin?: string
  animationFrom?: Record<string, string | number>
  animationTo?: Array<Record<string, string | number>>
  easing?: (t: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
}

// Section registry types
export type SectionId = 'hero' | 'features' | 'pricing' | 'testimonials' | 'contact'

export interface SectionRegistryEntry {
  config: SectionConfig
  component: React.ComponentType<any>
}

export type SectionRegistry = Map<SectionId, SectionRegistryEntry>