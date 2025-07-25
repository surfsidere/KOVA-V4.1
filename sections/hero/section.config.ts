/**
 * Hero Section Configuration
 * Defines section metadata, dependencies, and API contract
 */

import type { SectionConfig } from '@/core/types/section.types'

export const heroSectionConfig: SectionConfig = {
  id: 'hero',
  name: 'Hero Section',
  version: '1.0.0',
  enabled: true,
  dependencies: ['ethereal-depth'], // Requires background system
  props: {
    title: 'string',
    subtitle: 'string', 
    description: 'string',
    features: 'Feature[]',
    dynamicWords: 'string[]'
  },
  order: 1, // First section on landing page
  component: null as any // Will be set by the section export
}