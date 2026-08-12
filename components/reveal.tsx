'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Fades and slides its children up into place the first time they scroll
 * into view. Used to wrap section headings so they animate in as you
 * scroll down the page. Respects prefers-reduced-motion (shows content
 * immediately, no animation).
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [skipAnimation, setSkipAnimation] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setSkipAnimation(true)
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        !skipAnimation && 'transition-all duration-700 ease-out',
        !skipAnimation && (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'),
        className,
      )}
    >
      {children}
    </div>
  )
}