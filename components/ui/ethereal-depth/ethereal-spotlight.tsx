"use client"

import type React from "react"

import { memo } from "react"
import { motion, type MotionValue } from "framer-motion"
import { ETHEREAL_SPOTLIGHT_CONFIG } from "./config"

interface EtherealSpotlightProps {
  smoothedMouseX: MotionValue<number>
  smoothedMouseY: MotionValue<number>
}

// REFINEMENT: Define variants for the spotlight animation.
const spotlightVariants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
}

// Component: EtherealSpotlight
export const EtherealSpotlight: React.FC<EtherealSpotlightProps> = memo(({ smoothedMouseX, smoothedMouseY }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        translateX: smoothedMouseX,
        translateY: smoothedMouseY,
        x: "-50%",
        y: "-50%",
        width: 400,
        height: 400,
        background: ETHEREAL_SPOTLIGHT_CONFIG.background,
        borderRadius: "50%",
        filter: "blur(1px)",
        mixBlendMode: "screen",
        zIndex: ETHEREAL_SPOTLIGHT_CONFIG.zIndex,
        willChange: "transform",
      }}
      // REFINEMENT: Use variants for controlled animation.
      variants={spotlightVariants}
    />
  )
})

EtherealSpotlight.displayName = "EtherealSpotlight"
