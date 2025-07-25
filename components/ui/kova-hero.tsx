"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState, useMemo } from "react"
import { Menu, X, Zap, Layers, Globe } from "lucide-react"

type BlurTextProps = {
  text?: string
  delay?: number
  className?: string
  animateBy?: "words" | "letters"
  direction?: "top" | "bottom"
  threshold?: number
  rootMargin?: string
  animationFrom?: Record<string, string | number>
  animationTo?: Array<Record<string, string | number>>
  easing?: (t: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
}

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>,
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))])
  const keyframes: Record<string, Array<string | number>> = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("")
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current as Element)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const defaultFrom = useMemo(
    () =>
      direction === "top" ? { filter: "blur(10px)", opacity: 0, y: -50 } : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  )
  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo
  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)
        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        }
        return (
          <motion.span
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{
              display: "inline-block",
              willChange: "transform, filter, opacity",
            }}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        )
      })}
    </p>
  )
}

const features = [
  { icon: Zap, text: "API" },
  { icon: Layers, text: "App White-Label" },
  { icon: Globe, text: "Web App" },
]

// BRAND UPDATE: FeatureSelector now uses the "Liquid Gold" palette.
const FeatureSelector: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 transform scale-[0.80] pt-5">
      {features.map((feature, index) => (
        <motion.div
          key={feature.text}
          className="flex items-center gap-4 group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
        >
          <div
            className={cn(
              "p-3 rounded-xl bg-gradient-to-br from-[#2a281f] to-[#4b4631] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,249,225,0.3)]",
            )}
          >
            <feature.icon className="w-6 h-6 text-[#FFF9E1] transition-all duration-300 drop-shadow-[0_0_2px_rgba(255,249,225,0.5)] group-hover:drop-shadow-[0_0_6px_rgba(255,249,225,0.7)]" />
          </div>
          <span
            className={cn("text-lg font-medium text-white/60 transition-colors duration-300 group-hover:text-white")}
          >
            {feature.text}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

const menuItems = [
  { name: "Features", href: "#link" },
  { name: "Solutions", href: "#link" },
  { name: "Pricing", href: "#link" },
  { name: "About", href: "#link" },
]

const KovaLogo = ({ className }: { className?: string }) => {
  return <div className={cn("text-2xl font-bold text-white", className)}>KOVA</div>
}

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  return (
    <header>
      <nav data-state={menuState ? "active" : "inactive"} className="fixed z-20 w-full px-2 group">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled && "bg-black/50 max-w-4xl rounded-2xl border border-white/10 backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center space-x-2">
                <KovaLogo />
              </a>
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="text-white/70 hover:text-white block duration-150">
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <AnimatePresence>
              {menuState && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-black/80 backdrop-blur-lg lg:hidden mt-4 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-6 shadow-2xl shadow-black/20"
                >
                  <ul className="space-y-6 text-base">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <a href={item.href} className="text-white/70 hover:text-white block duration-150">
                          <span>{item.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  )
}

interface KovaHeroProps {
  className?: string
}

const KovaHero: React.FC<KovaHeroProps> = ({ className = "" }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  const dynamicWords = ["relevantes.", "digitales.", "personalizados."]

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
        <BlurText
          text="La Nueva Generacion De"
          delay={100}
          animateBy="words"
          direction="bottom"
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
        />

        <div className="text-4xl md:text-6xl lg:text-7xl font-bold mb-12">
          <div
            className="grid items-center justify-center"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "0.5rem",
            }}
          >
            <BlurText text="Beneficios" delay={150} animateBy="words" direction="bottom" className="text-white" />
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <BlurText
            text="KOVA es la plataforma digital que moderniza los programas de lealtad. Respaldados por 20 años de experiencia en alianzas estratégicas, conectamos a instituciones financieras con marcas líderes para ofrecer beneficios personalizables y así generar una conexión real con los usuarios."
            delay={50}
            animateBy="words"
            direction="bottom"
            className="text-lg md:text-xl text-white/80 text-center leading-relaxed"
          />
        </motion.div>
        <FeatureSelector />
      </motion.div>
    </div>
  )
}

export default function KovaPage() {
  return (
    <>
      <HeroHeader />
      <KovaHero />
    </>
  )
}
