"use client"

/**
 * Hero Section - Main Export
 * Composed from isolated components with clean API contract
 * Implements section interface for modular architecture
 */

import { HeroHeader } from './components/hero-header'
import { HeroContent } from './components/hero-content' 
import { heroSectionConfig } from './section.config'
import { withErrorBoundary } from '@/core/components/error-boundary'
import type { HeroSectionProps, MenuItem, Feature } from '@/core/types/section.types'
import { Zap, Layers, Globe } from "lucide-react"

// Default data - can be overridden via props
const defaultMenuItems: MenuItem[] = [
  { name: "Features", href: "#features" },
  { name: "Solutions", href: "#solutions" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
]

const defaultFeatures: Feature[] = [
  { icon: Zap, text: "API" },
  { icon: Layers, text: "App White-Label" },
  { icon: Globe, text: "Web App" },
]

const defaultDynamicWords = ["relevantes.", "digitales.", "personalizados."]

/**
 * Hero Section Component
 * Combines header navigation and hero content
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  id,
  className,
  title = "La Nueva Generacion De",
  subtitle = "Beneficios", 
  description = "KOVA es la plataforma digital que moderniza los programas de lealtad. Respaldados por 20 años de experiencia en alianzas estratégicas, conectamos a instituciones financieras con marcas líderes para ofrecer beneficios personalizables y así generar una conexión real con los usuarios.",
  features = defaultFeatures,
  dynamicWords = defaultDynamicWords,
  onFeatureClick,
  'data-testid': testId
}) => {
  return (
    <section 
      id={id}
      className={className}
      data-testid={testId || `section-${id}`}
    >
      <HeroHeader items={defaultMenuItems} />
      <HeroContent
        title={title}
        subtitle={subtitle}
        description={description}
        features={features}
        dynamicWords={dynamicWords}
        onFeatureClick={onFeatureClick}
      />
    </section>
  )
}

// Wrap with error boundary for fault tolerance
const HeroSectionWithErrorBoundary = withErrorBoundary(HeroSection, 'hero')

// Export section configuration
export { heroSectionConfig }

// Default export for section registry
export default HeroSectionWithErrorBoundary