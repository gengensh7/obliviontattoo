'use client'

import { useRef, useState, type ReactNode } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import FoldText from '@/shared/FoldText'

type Step = {
  title: string
  description: string
  panelTitle: string
  content: ReactNode
  inlineContent?: ReactNode
}

const formatStep = (step: number) => String(step).padStart(2, '0')

// Adapted from Aceternity UI Sticky Scroll Reveal.
export function StickyScroll({ steps, children }: { steps: Step[]; children: ReactNode }) {
  const [activeStep, setActiveStep] = useState(0)
  const track = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({
    target: track,
    // Switch when the next row reaches the reading line inside the pinned panel.
    offset: ['start 0.55', 'end 0.55']
  })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setActiveStep(Math.min(Math.floor(progress * steps.length), steps.length - 1))
  })

  return (
    <div className="grid w-full gap-x-12 gap-y-8 lg:sticky-scroll:grid-cols-2 xl:gap-x-20">
      <ol ref={track} className="grid min-w-0 lg:sticky-scroll:auto-rows-fr">
        {steps.map(({ title, description, inlineContent }, index) => (
          <li key={title} data-active={index === activeStep ? '' : undefined} className="group border-white/10 last:border-b lg:sticky-scroll:min-h-88 lg:sticky-scroll:last:border-b-0">
            <div className="sticky-scroll-step flex items-start gap-4 border-t border-white/10 py-6 sm:gap-6 lg:py-7 lg:sticky-scroll:sticky">
              <span aria-hidden="true" className="w-8 shrink-0 pt-1 montserrat text-lg font-semibold text-brand-red tabular-nums motion-safe:transition-colors motion-safe:duration-200 lg:sticky-scroll:text-zinc-400 lg:sticky-scroll:group-data-active:text-brand-red">
                {formatStep(index + 1)}
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-white motion-safe:transition-colors motion-safe:duration-200 sm:text-2xl lg:text-3xl lg:sticky-scroll:text-zinc-400 lg:sticky-scroll:group-data-active:text-white">
                  <FoldText text={title} subtle />
                </h3>
                <p className="text-base/relaxed text-zinc-300 motion-safe:transition-colors motion-safe:duration-200 lg:text-lg lg:sticky-scroll:text-zinc-400 lg:sticky-scroll:group-data-active:text-zinc-200">
                  {description}
                </p>
                {inlineContent && <div className="lg:sticky-scroll:hidden">{inlineContent}</div>}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* This column bounds the sticky panel to the three steps. */}
      <div className="min-w-0">
        <div className="sticky-scroll-panel flex flex-col items-start gap-4 lg:sticky-scroll:sticky lg:sticky-scroll:border-t lg:sticky-scroll:border-white/10 lg:sticky-scroll:bg-linear-to-br lg:sticky-scroll:from-zinc-900/85 lg:sticky-scroll:to-zinc-950 lg:sticky-scroll:px-6 lg:sticky-scroll:py-6 xl:sticky-scroll:px-8">
          <p className="hidden items-center gap-2 text-sm font-semibold text-zinc-400 tabular-nums lg:sticky-scroll:flex">
            <span className="text-brand-red">{formatStep(activeStep + 1)}</span> / {formatStep(steps.length)}
          </p>
          <div className="hidden self-stretch lg:sticky-scroll:grid">
            {steps.map(({ title, panelTitle, content }, index) => (
              <div
                key={title}
                aria-hidden={index !== activeStep}
                className="col-start-1 row-start-1 flex flex-col gap-2 aria-hidden:pointer-events-none aria-hidden:opacity-0 motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out"
              >
                <h4 className="text-2xl font-semibold tracking-tight xl:text-3xl">
                  <FoldText text={panelTitle} subtle active={index === activeStep} />
                </h4>
                {content}
              </div>
            ))}
          </div>
          <div className="w-full lg:sticky-scroll:border-t lg:sticky-scroll:border-white/10 lg:sticky-scroll:pt-4">
            {children}
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="border-t border-white/10 lg:sticky-scroll:col-span-2" />
    </div>
  )
}
