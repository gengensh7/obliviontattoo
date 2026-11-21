'use client'

import { AnimatePresence, motion, type Transition } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Tabs, type Tab, type TabPanelsProps } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const panelTransition: Transition = { duration: 0.36, ease: [0.23, 1, 0.32, 1] }
const previewTransition: Transition = { ...panelTransition, duration: 0.28 }
const instant: Transition = { duration: 0 }
const previewStep = 36

function PricingPanels({ tabs, active, hovered, id, animated, reducedMotion }: TabPanelsProps) {
  const panels = useRef<HTMLDivElement>(null)
  const [heightsById, setHeightsById] = useState<Record<string, number>>({})
  const previews = hovered && !reducedMotion
    ? [hovered, ...tabs.filter((tab) => tab !== hovered)]
        .filter((tab) => tab !== active && tab.preview)
        .slice(0, 2)
        .reverse()
    : []
  const height = heightsById[`${id}-panel-${active.value}`]

  useEffect(() => {
    const container = panels.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const heights = Object.fromEntries(entries.map(({ target, borderBoxSize }) => [target.id, borderBoxSize[0].blockSize]))
      setHeightsById((previous) => ({ ...previous, ...heights }))
    })
    for (const panel of container.children) observer.observe(panel)

    return () => observer.disconnect()
  }, [tabs])

  return (
    <div className="relative isolate">
      <AnimatePresence initial={false}>
        {previews.map((tab, index) => (
          <motion.div
            key={tab.value}
            aria-hidden="true"
            initial={{ opacity: 0, y: previewStep, scale: 0.98 }}
            animate={{ opacity: 1, y: index * previewStep, scale: 1 }}
            exit={{ opacity: 0, y: previewStep, scale: 0.98 }}
            transition={reducedMotion ? instant : previewTransition}
            className={cn(
              'pointer-events-none absolute top-0 origin-top rounded-xl border px-4 pt-2 pb-6',
              index === 0
                ? 'inset-x-8 border-zinc-800 bg-zinc-900 sm:inset-x-12'
                : 'inset-x-4 border-zinc-700 bg-zinc-800 sm:inset-x-6'
            )}
          >
            {tab.preview}
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ height: previews.length * previewStep }}
        transition={reducedMotion ? instant : previewTransition}
      />
      <motion.div
        ref={panels}
        initial={false}
        animate={{ height: height ?? 'auto' }}
        transition={animated ? panelTransition : instant}
        className={cn('relative isolate overflow-clip rounded-xl', !animated && 'h-auto!')}
      >
        {tabs.map(({ value, content }) => {
          const isActive = value === active.value

          return (
            <motion.div
              key={value}
              id={`${id}-panel-${value}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${value}`}
              aria-hidden={isActive ? undefined : true}
              inert={!isActive}
              tabIndex={isActive ? 0 : -1}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -10 }}
              transition={animated ? panelTransition : instant}
              className={cn(
                'rounded-xl focus-visible:outline-2 -outline-offset-2 focus-visible:outline-brand-red',
                isActive ? 'relative z-10' : 'pointer-events-none absolute inset-x-0 top-0',
                !animated && (isActive ? 'transform-none! opacity-100!' : 'opacity-0!')
              )}
            >
              {content}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export function PricingTabs({ tabs, labelledBy }: { tabs: Tab[]; labelledBy: string }) {
  return (
    <Tabs
      tabs={tabs}
      labelledBy={labelledBy}
      containerClassName="flex-wrap gap-2 overflow-visible border-b border-zinc-800 pb-4"
      activeTabClassName="bg-brand-red dark:bg-brand-red"
      tabClassName="min-h-11 bg-zinc-900 text-sm font-semibold text-zinc-200 hover:text-white aria-selected:text-white"
      renderPanels={(props) => <PricingPanels {...props} />}
    />
  )
}
