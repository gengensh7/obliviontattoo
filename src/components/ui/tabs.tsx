'use client'

import { motion, useReducedMotion } from 'motion/react'
import { type KeyboardEvent, type ReactNode, useId, useState } from 'react'
import { cn } from '@/lib/utils'

export type Tab = {
  title: string
  value: string
  content: ReactNode
  preview?: ReactNode
}

export type TabPanelsProps = {
  tabs: Tab[]
  active: Tab
  hovered: Tab | undefined
  id: string
  animated: boolean
  reducedMotion: boolean
}

// Aceternity UI Tabs, https://ui.aceternity.com/components/tabs
export function Tabs({
  tabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  labelledBy,
  renderPanels
}: {
  tabs: Tab[]
  containerClassName?: string
  activeTabClassName?: string
  tabClassName?: string
  contentClassName?: string
  labelledBy?: string
  renderPanels?: (props: TabPanelsProps) => ReactNode
}) {
  const id = useId()
  const reducedMotion = useReducedMotion() ?? false
  const [selection, setSelection] = useState({ index: 0, animate: false })
  const [hoveredIndex, setHoveredIndex] = useState<number>()
  const active = tabs[selection.index]
  const hovered = hoveredIndex === undefined ? undefined : tabs[hoveredIndex]
  const animated = selection.animate && !reducedMotion

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let nextIndex: number

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = (selection.index + tabs.length - 1) % tabs.length
        break
      case 'ArrowRight':
        nextIndex = (selection.index + 1) % tabs.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = tabs.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    setHoveredIndex(undefined)
    setSelection({ index: nextIndex, animate: false })
    event.currentTarget.querySelectorAll<HTMLButtonElement>('button')[nextIndex]?.focus()
  }

  return (
    <>
      <div
        role="tablist"
        aria-labelledby={labelledBy}
        onKeyDown={handleTabKeyDown}
        onPointerLeave={() => setHoveredIndex(undefined)}
        className={cn(
          'relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] no-visible-scrollbar sm:overflow-visible',
          containerClassName
        )}
      >
        {tabs.map((tab, index) => {
          const isActive = active.value === tab.value

          return (
            <button
              key={tab.value}
              id={`${id}-tab-${tab.value}`}
              type="button"
              role="tab"
              aria-controls={`${id}-panel-${tab.value}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={(event) => {
                if (!isActive) setSelection({ index, animate: event.detail > 0 })
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setHoveredIndex(index)
              }}
              className={cn(
                'relative rounded-full px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red',
                tabClassName
              )}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {isActive && (
                <motion.div
                  aria-hidden="true"
                  layoutId={reducedMotion ? undefined : `${id}-clickedbutton`}
                  transition={animated ? { type: 'spring', bounce: 0.3, duration: 0.6 } : { duration: 0 }}
                  className={cn('absolute inset-0 rounded-full bg-gray-200 dark:bg-zinc-800', activeTabClassName)}
                />
              )}
              <span className={cn('relative block', renderPanels ? 'text-current' : 'text-black dark:text-white')}>
                {tab.title}
              </span>
            </button>
          )
        })}
      </div>
      {renderPanels ? (
        renderPanels({ tabs, active, hovered, id, animated, reducedMotion })
      ) : (
        <FadeInDiv
          key={active.value}
          tabs={[active, ...tabs.filter((tab) => tab.value !== active.value)]}
          active={active}
          hovering={!!hovered}
          className={cn('mt-32', contentClassName)}
          id={id}
          animated={animated}
          reducedMotion={reducedMotion}
        />
      )}
    </>
  )
}

export function FadeInDiv({
  className,
  tabs,
  active,
  hovering,
  id,
  animated = true,
  reducedMotion = false
}: {
  className?: string
  tabs: Tab[]
  active: Tab
  hovering?: boolean
  id?: string
  animated?: boolean
  reducedMotion?: boolean
}) {
  return (
    <div className="relative h-full w-full">
      {tabs.map((tab, index) => {
        const isActive = tab.value === active.value

        return (
          <motion.div
            key={tab.value}
            layoutId={reducedMotion ? undefined : `${id}-${tab.value}`}
            id={id ? `${id}-panel-${tab.value}` : undefined}
            role={id ? 'tabpanel' : undefined}
            aria-labelledby={id ? `${id}-tab-${tab.value}` : undefined}
            aria-hidden={isActive ? undefined : true}
            inert={!isActive}
            tabIndex={isActive && id ? 0 : undefined}
            style={{
              scale: 1 - index * 0.1,
              top: hovering && !reducedMotion ? index * -50 : 0,
              zIndex: -index,
              opacity: index < 3 ? 1 - index * 0.1 : 0
            }}
            animate={{ y: isActive && animated && !reducedMotion ? [0, 40, 0] : 0 }}
            className={cn(
              'absolute top-0 left-0 h-full w-full',
              !isActive && 'motion-reduce:opacity-0!',
              className
            )}
          >
            {tab.content}
          </motion.div>
        )
      })}
    </div>
  )
}
