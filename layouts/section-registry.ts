/**
 * Section Registry System
 * Manages available landing page sections and their composition
 * Enables dynamic section loading and safe incremental development
 */

import type { SectionConfig, SectionId, SectionRegistryEntry } from '@/core/types/section.types'
import { isFeatureEnabled } from '@/core/constants/feature-flags'

// Pre-register available sections to avoid build-time import errors
const AVAILABLE_SECTIONS: SectionId[] = ['hero'] // Only include implemented sections

class SectionRegistryManager {
  private sections: Map<SectionId, SectionRegistryEntry> = new Map()
  private loadPromises: Map<SectionId, Promise<SectionRegistryEntry>> = new Map()

  /**
   * Register a section with the registry
   */
  register(id: SectionId, entry: SectionRegistryEntry): void {
    this.sections.set(id, entry)
  }

  /**
   * Get a specific section by ID
   */
  getSection(id: SectionId): SectionRegistryEntry | undefined {
    return this.sections.get(id)
  }

  /**
   * Get all registered sections
   */
  getAllSections(): SectionRegistryEntry[] {
    return Array.from(this.sections.values())
  }

  /**
   * Get enabled sections only (respects feature flags)
   */
  getEnabledSections(): SectionRegistryEntry[] {
    return this.getAllSections()
      .filter(entry => isFeatureEnabled(entry.config.id as any))
      .sort((a, b) => a.config.order - b.config.order)
  }

  /**
   * Get sections in render order
   */
  getSectionsInOrder(): SectionRegistryEntry[] {
    return this.getEnabledSections()
      .sort((a, b) => a.config.order - b.config.order)
  }

  /**
   * Check if a section is registered
   */
  hasSection(id: SectionId): boolean {
    return this.sections.has(id)
  }

  /**
   * Check if a section is enabled
   */
  isSectionEnabled(id: SectionId): boolean {
    return this.hasSection(id) && isFeatureEnabled(id as any)
  }

  /**
   * Dynamically load a section (for code splitting)
   */
  async loadSection(id: SectionId): Promise<SectionRegistryEntry | null> {
    // Check if section is available
    if (!AVAILABLE_SECTIONS.includes(id)) {
      console.warn(`Section ${id} is not implemented yet`)
      return null
    }

    // Check if already loaded
    const existing = this.getSection(id)
    if (existing) {
      return existing
    }

    // Check if already loading
    const loadPromise = this.loadPromises.get(id)
    if (loadPromise) {
      return loadPromise
    }

    // Start loading
    const promise = this.dynamicImport(id)
    this.loadPromises.set(id, promise)

    try {
      const entry = await promise
      this.register(id, entry)
      return entry
    } catch (error) {
      console.error(`Failed to load section: ${id}`, error)
      return null
    } finally {
      this.loadPromises.delete(id)
    }
  }

  /**
   * Dynamic import for code splitting
   * Only imports sections that are available
   */
  private async dynamicImport(id: SectionId): Promise<SectionRegistryEntry> {
    switch (id) {
      case 'hero':
        const heroModule = await import('@/sections/hero')
        return {
          config: heroModule.heroSectionConfig,
          component: heroModule.default
        }
      default:
        throw new Error(`Section ${id} is not available for import`)
    }
  }

  /**
   * Validate section dependencies
   */
  validateDependencies(): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const sections = this.getEnabledSections()

    for (const entry of sections) {
      for (const dep of entry.config.dependencies) {
        if (!this.hasSection(dep as SectionId)) {
          errors.push(`Section "${entry.config.id}" requires missing dependency: "${dep}"`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Get section load status
   */
  getLoadStatus(): Record<SectionId, 'loaded' | 'loading' | 'not-loaded' | 'error'> {
    const status = {} as Record<SectionId, 'loaded' | 'loading' | 'not-loaded' | 'error'>
    
    const allSectionIds: SectionId[] = ['hero', 'features', 'pricing', 'testimonials', 'contact']
    
    for (const id of allSectionIds) {
      if (this.hasSection(id)) {
        status[id] = 'loaded'
      } else if (this.loadPromises.has(id)) {
        status[id] = 'loading'
      } else {
        status[id] = 'not-loaded'
      }
    }

    return status
  }
}

// Singleton instance
export const sectionRegistry = new SectionRegistryManager()

// Export for type checking
export type { SectionRegistryManager }