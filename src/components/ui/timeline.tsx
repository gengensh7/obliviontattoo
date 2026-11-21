'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'

export interface TimelineEntry {
  title: string
  content: ReactNode
}

// Adapted from https://ui.aceternity.com/components/timeline
export function Timeline({ data }: { data: TimelineEntry[] }) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 10%', 'end 50%']
  })
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div ref={timelineRef} className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute top-4 bottom-0 left-3 w-0.5 -translate-x-1/2 overflow-hidden rounded-full bg-zinc-800 md:left-4">
        <motion.div
          style={{ scaleY: scrollYProgress, opacity }}
          className="h-full origin-top rounded-full bg-brand-red motion-reduce:hidden"
        />
      </div>

      <ol role="list" className="grid gap-10 sm:gap-12 md:gap-16">
        {data.map(({ title, content }) => (
          <li key={title} className="grid gap-4 md:grid-cols-3 md:gap-6 xl:gap-10">
            <h3 className="relative z-10 self-start py-0.5 pl-8 text-2xl leading-tight font-bold tracking-tight text-balance wrap-break-word hyphens-auto sm:pl-10 md:sticky md:top-28 md:pr-2 md:pl-12 lg:pl-14 lg:text-3xl xl:text-4xl 2xl:text-5xl">
              <span aria-hidden="true" className="absolute top-1 left-0 grid size-6 place-items-center rounded-full bg-zinc-950 md:top-0 md:size-8">
                <span className="size-3 rounded-full border border-zinc-500 bg-zinc-800" />
              </span>
              <FoldText text={title} />
            </h3>

            <FadeContent
              effect="focus"
              duration={0.44}
              initialOpacity={0.3}
              className="min-w-0 pl-8 sm:pl-10 md:col-span-2 md:pl-0"
            >
              {content}
            </FadeContent>
          </li>
        ))}
      </ol>
    </div>
  )
}
