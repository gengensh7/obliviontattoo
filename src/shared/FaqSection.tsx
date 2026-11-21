import { Minus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import FoldText from './FoldText'

type FaqSectionProps = {
  titleId: string
  title: string
  items: { question: string; answer: string }[]
  className?: string
  children?: ReactNode
}

export function FaqSection({ titleId, title, items, className = 'pb-20', children }: FaqSectionProps) {
  return (
    <section aria-labelledby={titleId} className={`bg-zinc-900 ${className}`}>
      <div className="container grid items-start gap-6 text-left lg:grid-cols-12 lg:gap-x-10">
        <h2
          id={titleId}
          className="text-3xl leading-tight font-bold tracking-tight text-balance text-white lg:col-span-4 lg:max-w-xs lg:pt-3 lg:text-4xl"
        >
          <FoldText text={title} />
        </h2>
        <Accordion type="single" collapsible defaultValue="item-1" className="border-t border-zinc-700 lg:col-span-8">
          {items.map(({ question, answer }, index) => (
            <AccordionItem key={question} value={`item-${index + 1}`} className="border-zinc-700">
              <AccordionTrigger className="text-base font-semibold text-white hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid! focus-visible:outline-rose-200 sm:text-lg">
                <FoldText text={question} subtle />
                <Plus aria-hidden="true" className="size-5 shrink-0 text-zinc-400 group-aria-expanded:hidden" strokeWidth={1.5} />
                <Minus aria-hidden="true" className="hidden size-5 shrink-0 text-zinc-400 group-aria-expanded:block" strokeWidth={1.5} />
              </AccordionTrigger>
              <AccordionContent>
                <p className="pb-5 leading-relaxed text-zinc-300">{answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {children && <div className="lg:col-span-8 lg:col-start-5">{children}</div>}
      </div>
    </section>
  )
}
