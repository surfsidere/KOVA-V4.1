"use client"

/**
 * HeroContent Component - Extracted from monolithic hero
 * Main hero content with animated text and feature display
 * Clean, isolated component with proper props interface
 */

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { BlurText } from './blur-text'
import { FeatureSelector } from './feature-selector'
import type { HeroSectionProps } from '@/core/types/section.types'

interface HeroContentProps {
  title: string
  subtitle: string
  description: string
  features: HeroSectionProps['features']
  dynamicWords: string[]
  onFeatureClick?: HeroSectionProps['onFeatureClick']
  className?: string
}

export const HeroContent: React.FC<HeroContentProps> = ({
  title,
  subtitle,
  description,
  features,
  dynamicWords,
  onFeatureClick,
  className
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [dynamicWords.length])

  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center px-6 pt-24", className)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center max-w-4xl mx-auto"
      >
        {/* Main Title */}
        <BlurText
          text={title}
          delay={100}
          animateBy="words"
          direction="bottom"
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
        />

        {/* Subtitle with Dynamic Words */}
        <div className="text-4xl md:text-6xl lg:text-7xl font-bold mb-12">
          <div
            className="grid items-center justify-center"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "0.5rem",
            }}
          >
            <BlurText 
              text={subtitle} 
              delay={150} 
              animateBy="words" 
              direction="bottom" 
              className="text-white" 
            />
            <div className="text-left">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "2px #FFF9E1",
                    textShadow: "0 0 10px rgba(255, 249, 225, 0.4)",
                  }}
                >
                  {dynamicWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <BlurText
            text={description}
            delay={50}
            animateBy="words"
            direction="bottom"
            className="text-lg md:text-xl text-white/80 text-center leading-relaxed"
          />
        </motion.div>

        {/* Feature Selector */}
        <FeatureSelector 
          features={features} 
          onFeatureClick={onFeatureClick}
        />
      </motion.div>
    </div>
  )
}