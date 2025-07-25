/**
 * Section Helper Utilities
 * Common utilities for section development and management
 */

import type { SectionId, SectionConfig } from '@/core/types/section.types'
import { isFeatureEnabled } from '@/core/constants/feature-flags'

/**
 * Generate section-specific class names
 */
export function getSectionClassName(sectionId: SectionId, additionalClasses?: string): string {
  const baseClass = `section-${sectionId}`
  return additionalClasses ? `${baseClass} ${additionalClasses}` : baseClass
}

/**
 * Generate data attributes for sections
 */
export function getSectionDataAttributes(sectionId: SectionId) {
  return {
    'data-section': sectionId,
    'data-testid': `section-${sectionId}`,
    'data-enabled': isFeatureEnabled(sectionId as any).toString()
  }
}

/**
 * Validate section props against configuration
 */
export function validateSectionProps(
  props: Record<string, any>, 
  config: SectionConfig
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check required props
  Object.entries(config.props).forEach(([propName, propType]) => {
    if (!(propName in props)) {
      errors.push(`Missing required prop: ${propName} (${propType})`)
    }
  })
  
  // Validate prop types (basic validation)
  Object.entries(props).forEach(([propName, propValue]) => {
    if (propName in config.props) {
      const expectedType = config.props[propName]
      const actualType = Array.isArray(propValue) ? 'array' : typeof propValue
      
      if (expectedType.includes('[]') && !Array.isArray(propValue)) {
        errors.push(`Prop ${propName} should be an array, got ${actualType}`)
      } else if (!expectedType.includes('[]') && expectedType !== actualType && actualType !== 'undefined') {
        // Allow undefined for optional props
        if (!(expectedType.endsWith('?') && actualType === 'undefined')) {
          errors.push(`Prop ${propName} should be ${expectedType}, got ${actualType}`)
        }
      }
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Performance monitoring for sections
 */
export function measureSectionPerformance<T>(
  sectionId: SectionId, 
  operation: string, 
  fn: () => T
): T {
  const startTime = performance.now()
  
  try {
    const result = fn()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${sectionId}] ${operation}: ${duration.toFixed(2)}ms`)
    }
    
    // Could send to analytics in production
    if (duration > 100) {
      console.warn(`[${sectionId}] ${operation} took ${duration.toFixed(2)}ms (slow)`)
    }
    
    return result
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.error(`[${sectionId}] ${operation} failed after ${duration.toFixed(2)}ms:`, error)
    throw error
  }
}

/**
 * Deep merge objects for section configuration
 */
export function mergeDeep<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  
  Object.keys(source).forEach(key => {
    const sourceValue = source[key]
    const targetValue = result[key]
    
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = mergeDeep(targetValue, sourceValue)
    } else {
      result[key] = sourceValue as any
    }
  })
  
  return result
}

/**
 * Debounce utility for section interactions
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Generate unique IDs for section elements
 */
export function generateSectionElementId(sectionId: SectionId, elementName: string): string {
  return `${sectionId}-${elementName}-${Math.random().toString(36).substr(2, 9)}`
}