/**
 * Feature flag system for safe incremental development
 * Allows sections to be developed and tested independently
 */

export const FEATURE_FLAGS = {
  HERO_SECTION: true,
  FEATURES_SECTION: false,     // Under development
  PRICING_SECTION: false,      // Not started
  TESTIMONIALS_SECTION: false, // Not started
  CONTACT_SECTION: false,      // Not started
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS

/**
 * Check if a feature is enabled
 * In development mode, all features can be enabled for testing
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  if (process.env.NODE_ENV === 'development') {
    // Allow override in development
    const envOverride = process.env[`FEATURE_${feature}`]
    if (envOverride !== undefined) {
      return envOverride === 'true'
    }
  }
  
  return FEATURE_FLAGS[feature]
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return (Object.keys(FEATURE_FLAGS) as FeatureFlag[])
    .filter(feature => isFeatureEnabled(feature))
}

/**
 * Development utility to override feature flags
 */
export function setFeatureFlag(feature: FeatureFlag, enabled: boolean): void {
  if (process.env.NODE_ENV === 'development') {
    // Only allow in development
    (FEATURE_FLAGS as any)[feature] = enabled
  }
}