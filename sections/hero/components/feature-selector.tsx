"use client"

/**
 * FeatureSelector Component - Extracted from monolithic hero
 * Displays interactive feature cards (API, App White-Label, Web App)
 * Isolated component with proper TypeScript interfaces
 */

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Feature } from '@/core/types/section.types'

interface FeatureSelectorProps {
  features: Feature[]
  onFeatureClick?: (feature: Feature) => void
  className?: string
}

export const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  features,
  onFeatureClick,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 transform scale-[0.80] pt-5",
      className
    )}>
      {features.map((feature, index) => (
        <motion.div
          key={feature.text}
          className="flex items-center gap-4 group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
          onClick={() => onFeatureClick?.(feature)}
        >
          <div
            className={cn(
              "p-3 rounded-xl bg-gradient-to-br from-[#2a281f] to-[#4b4631]",
              "transition-all duration-300 group-hover:scale-105",
              "group-hover:shadow-[0_0_15px_rgba(255,249,225,0.3)]",
            )}
          >
            <feature.icon className={cn(
              "w-6 h-6 text-[#FFF9E1] transition-all duration-300",
              "drop-shadow-[0_0_2px_rgba(255,249,225,0.5)]",
              "group-hover:drop-shadow-[0_0_6px_rgba(255,249,225,0.7)]"
            )} />
          </div>
          <span
            className={cn(
              "text-lg font-medium text-white/60 transition-colors duration-300",
              "group-hover:text-white"
            )}
          >
            {feature.text}
          </span>
        </motion.div>
      ))}
    </div>
  )
}