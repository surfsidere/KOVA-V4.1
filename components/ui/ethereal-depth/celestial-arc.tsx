"use client"

import type React from "react"

import { memo } from "react"
import { motion, useTransform, type MotionValue } from "framer-motion"
import type { ArcConfig } from "./config"

interface CelestialArcProps {
  smoothedMouseX: MotionValue<number>
  smoothedMouseY: MotionValue<number>
  config: ArcConfig
}

// REFINEMENT: Define animation variants for orchestration by the parent.
const arcVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  // The 'animate' variant is now a function that receives the 'custom' prop.
  animate: (config: ArcConfig) => ({
    opacity: config.opacity,
    scale: config.scale,
    transition: { duration: 2, ease: "easeOut" },
  }),
}

// Component: CelestialArc
export const CelestialArc: React.FC<CelestialArcProps> = memo(({ smoothedMouseX, smoothedMouseY, config }) => {
  const x = useTransform(smoothedMouseX, (val) => val * config.parallaxStrength)
  const y = useTransform(smoothedMouseY, (val) => val * config.parallaxStrength)

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ x, y, zIndex: config.zIndex, transform: `scale(${config.scale})`, willChange: "transform, opacity" }}
      // REFINEMENT: Use variants for controlled animation.
      variants={arcVariants}
      // The 'custom' prop passes the unique config to the variant function.
      custom={config}
    >
      {config.gradients.map((gradient, index) => {
        const isPositionAnimation = gradient.animationType === "position"
        return (
          <motion.div
            key={index}
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
            style={{
              background: gradient.background,
              ...(isPositionAnimation && { backgroundSize: "200% 200%" }),
            }}
            animate={
              isPositionAnimation
                ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
                : { background: gradient.animationBackgrounds }
            }
            transition={{
              duration: gradient.animationDuration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </motion.div>
  )
})

CelestialArc.displayName = "CelestialArc"
