"use client"

/**
 * Modular Landing Page Layout
 * Orchestrates sections using the registry system
 * Provides dynamic composition with error boundaries
 */

import { useEffect, useState } from 'react'
import { sectionRegistry } from './section-registry'
import { SectionErrorBoundary } from '@/core/components/error-boundary'
import { EtherealDepth } from "@/components/ui/ethereal-depth"
import type { SectionRegistryEntry } from '@/core/types/section.types'

interface LandingPageProps {
  className?: string
}

/**
 * Section Loading Component
 */
const SectionLoader: React.FC<{ sectionId: string }> = ({ sectionId }) => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
      <p className="text-white/60 text-sm">Loading {sectionId} section...</p>
    </div>
  </div>
)

/**
 * Section Error Fallback
 */
const SectionErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="min-h-[200px] flex items-center justify-center bg-red-50/5 border border-red-200/10 rounded-lg mx-4">
    <div className="text-center p-8">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-white mb-2">Section Failed to Load</h3>
      <p className="text-white/60 mb-4 max-w-md">
        This section encountered an error. The rest of the page continues to work normally.
      </p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
)

/**
 * Main Landing Page Component
 */
export const LandingPage: React.FC<LandingPageProps> = ({ className }) => {
  const [sections, setSections] = useState<SectionRegistryEntry[]>([])
  const [loadingStatus, setLoadingStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeSections = async () => {
      try {
        // Load hero section (always enabled)
        const heroEntry = await sectionRegistry.loadSection('hero')
        if (heroEntry) {
          setSections([heroEntry])
          setLoadingStatus(prev => ({ ...prev, hero: 'loaded' }))
        }

        // Load other enabled sections
        const enabledSections = sectionRegistry.getEnabledSections()
        const additionalSections = enabledSections.filter(entry => entry.config.id !== 'hero')

        for (const entry of additionalSections) {
          setLoadingStatus(prev => ({ ...prev, [entry.config.id]: 'loading' }))
          try {
            const loadedEntry = await sectionRegistry.loadSection(entry.config.id as any)
            if (loadedEntry) {
              setSections(prev => [...prev, loadedEntry].sort((a, b) => a.config.order - b.config.order))
              setLoadingStatus(prev => ({ ...prev, [entry.config.id]: 'loaded' }))
            }
          } catch (error) {
            console.error(`Failed to load section: ${entry.config.id}`, error)
            setLoadingStatus(prev => ({ ...prev, [entry.config.id]: 'error' }))
          }
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize sections:', error)
        setIsInitialized(true)
      }
    }

    initializeSections()
  }, [])

  // Validate dependencies
  const dependencyValidation = sectionRegistry.validateDependencies()
  if (!dependencyValidation.valid) {
    console.warn('Section dependency validation failed:', dependencyValidation.errors)
  }

  return (
    <main className={`relative bg-[#020010] ${className || ''}`}>
      {/* Background System */}
      <EtherealDepth />
      
      {/* Sections Container */}
      <div className="relative z-10">
        {sections.map((entry) => {
          const SectionComponent = entry.component
          const status = loadingStatus[entry.config.id]

          // Show loader if still loading
          if (status === 'loading') {
            return (
              <div key={entry.config.id}>
                <SectionLoader sectionId={entry.config.id} />
              </div>
            )
          }

          // Show error fallback if failed
          if (status === 'error') {
            return (
              <div key={entry.config.id}>
                <SectionErrorFallback 
                  error={new Error(`Failed to load ${entry.config.id}`)}
                  retry={() => window.location.reload()}
                />
              </div>
            )
          }

          // Render section with error boundary
          return (
            <SectionErrorBoundary
              key={entry.config.id}
              sectionId={entry.config.id}
              fallback={SectionErrorFallback}
            >
              <SectionComponent
                id={entry.config.id}
                data-testid={`section-${entry.config.id}`}
                {...(entry.config.id === 'hero' ? {
                  title: "La Nueva Generacion De",
                  subtitle: "Beneficios",
                  description: "KOVA es la plataforma digital que moderniza los programas de lealtad. Respaldados por 20 años de experiencia en alianzas estratégicas, conectamos a instituciones financieras con marcas líderes para ofrecer beneficios personalizables y así generar una conexión real con los usuarios.",
                  features: [],
                  dynamicWords: ["relevantes.", "digitales.", "personalizados."]
                } : {})}
              />
            </SectionErrorBoundary>
          )
        })}

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-lg text-white p-3 rounded-lg text-xs font-mono max-w-xs">
            <div className="font-semibold mb-2">Modular Architecture Status</div>
            <div className="space-y-1">
              {Object.entries(loadingStatus).map(([sectionId, status]) => (
                <div key={sectionId} className="flex justify-between">
                  <span>{sectionId}:</span>
                  <span className={
                    status === 'loaded' ? 'text-green-400' :
                    status === 'loading' ? 'text-yellow-400' :
                    'text-red-400'
                  }>
                    {status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-white/20 text-xs text-white/60">
              Sections: {sections.length} loaded
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default LandingPage