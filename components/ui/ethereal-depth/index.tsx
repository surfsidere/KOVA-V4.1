"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion"
import { BACKGROUND_GRADIENT, SCROLL_ANIMATION_CONFIG, MASK_CONFIG, ARC_CONFIGURATIONS } from "./config"
import { CelestialArc } from "./celestial-arc"
import { EtherealSpotlight } from "./ethereal-spotlight"

const containerVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1.5,
      staggerChildren: 0.2,
    },
  },
}

// Component: EtherealDepth (Container)
export const EtherealDepth: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 30, mass: 1 }
  const smoothedMouseX = useSpring(mouseX, springConfig)
  const smoothedMouseY = useSpring(mouseY, springConfig)

  const normalizedMouseX = useTransform(smoothedMouseX, (val) => {
    if (typeof window !== 'undefined') {
      return (val / window.innerWidth - 0.5) * 2
    }
    return 0
  })
  const normalizedMouseY = useTransform(smoothedMouseY, (val) => {
    if (typeof window !== 'undefined') {
      return (val / window.innerHeight - 0.5) * 2
    }
    return 0
  })

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], SCROLL_ANIMATION_CONFIG.scale),
    SCROLL_ANIMATION_CONFIG.spring,
  )
  const y = useSpring(useTransform(scrollYProgress, [0, 1], SCROLL_ANIMATION_CONFIG.y), SCROLL_ANIMATION_CONFIG.spring)
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], SCROLL_ANIMATION_CONFIG.opacity),
    SCROLL_ANIMATION_CONFIG.spring,
  )
  const maskOpacity = useSpring(
    useTransform(scrollYProgress, [0.8, 1], SCROLL_ANIMATION_CONFIG.maskOpacity),
    SCROLL_ANIMATION_CONFIG.spring,
  )

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen overflow-hidden"
      style={{
        background: BACKGROUND_GRADIENT,
        perspective: "1000px",
        scale,
        opacity,
        y,
        willChange: "transform, opacity",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        variants={containerVariants}
        initial="initial"
        animate={isLoaded ? "animate" : "initial"}
      >
        {ARC_CONFIGURATIONS.map((config) => (
          <CelestialArc
            key={config.zIndex}
            smoothedMouseX={normalizedMouseX}
            smoothedMouseY={normalizedMouseY}
            config={config}
          />
        ))}
        {isLoaded && <EtherealSpotlight smoothedMouseX={smoothedMouseX} smoothedMouseY={smoothedMouseY} />}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: MASK_CONFIG.background,
            opacity: maskOpacity,
            zIndex: MASK_CONFIG.zIndex,
            willChange: "opacity",
          }}
        />
        <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />
      </motion.div>
    </motion.div>
  )
}
