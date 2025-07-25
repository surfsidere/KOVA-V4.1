"use client"

/**
 * HeroHeader Component - Extracted from monolithic hero
 * Navigation header with responsive mobile menu
 * Isolated component with clean API contract
 */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NavigationProps } from '@/core/types/section.types'

interface HeroHeaderProps extends NavigationProps {
  logo?: React.ComponentType<{ className?: string }>
}

const KovaLogo = ({ className }: { className?: string }) => {
  return <div className={cn("text-2xl font-bold text-white", className)}>KOVA</div>
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ 
  items, 
  logo: LogoComponent = KovaLogo,
  className 
}) => {
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
    <header className={className}>
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
                <LogoComponent />
              </a>
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {items.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="text-white/70 hover:text-white block duration-150">
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Mobile Navigation */}
            <AnimatePresence>
              {menuState && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "bg-black/80 backdrop-blur-lg lg:hidden mt-4 w-full",
                    "flex-wrap items-center justify-end space-y-8 rounded-3xl",
                    "border border-white/10 p-6 shadow-2xl shadow-black/20"
                  )}
                >
                  <ul className="space-y-6 text-base">
                    {items.map((item, index) => (
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