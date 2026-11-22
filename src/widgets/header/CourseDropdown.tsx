'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { GooeyNavItem } from './GooeyNav'

export function CourseDropdown({ catalog, items, activeCoursePath, active }: {
  catalog: GooeyNavItem
  items: GooeyNavItem[]
  activeCoursePath?: string
  active: boolean
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const linksRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open) return

    function closeOnOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (rootRef.current?.contains(document.activeElement)) event.preventDefault()
      if (linksRef.current?.contains(document.activeElement)) triggerRef.current?.focus()
      setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className={cn(
        'group/course relative inline-flex items-stretch whitespace-nowrap rounded-full text-white',
        active && 'bg-brand-red motion-safe:group-data-gooey/gooey:bg-transparent'
      )}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setOpen(true)
      }}
      onPointerLeave={() => {
        if (!linksRef.current?.contains(document.activeElement) && !rootRef.current?.querySelector(':focus-visible')) setOpen(false)
      }}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(true)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <Link
        href={catalog.href}
        aria-current={catalog.destination === activeCoursePath && !open ? 'page' : undefined}
        data-gtm="nav-link"
        data-gtm-destination={catalog.destination}
        className={cn(
          'relative inline-flex items-center rounded-full py-2 ps-3 pe-1 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          !active && 'hover:text-brand-red motion-safe:transition-colors'
        )}
        onClick={() => setOpen(false)}
      >
        {catalog.label}
      </Link>
      <button
        ref={triggerRef}
        type="button"
        aria-label={catalog.label}
        aria-expanded={open}
        aria-controls={id}
        className={cn(
          'relative inline-flex cursor-pointer items-center rounded-full ps-0.5 pe-3 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          !active && 'hover:text-brand-red motion-safe:transition-colors'
        )}
        onClick={(event) => {
          if (event.detail === 0 && open) linksRef.current?.querySelector('a')?.focus()
          else setOpen(true)
        }}
      >
        <ChevronDown aria-hidden="true" className="size-3.5 shrink-0" />
      </button>

      <div hidden={!open} className="absolute top-full left-1/2 z-20 w-64 -translate-x-1/2 pt-1">
        <ul
          id={id}
          ref={linksRef}
          className="grid rounded-xl border border-white/15 bg-zinc-950 p-1.5 text-sm whitespace-normal shadow-lg shadow-black/35 motion-safe:transition-opacity motion-safe:duration-150 motion-safe:ease-out motion-safe:starting:opacity-0 group-has-focus-visible/course:transition-none"
        >
          {items.map(({ href, label, destination }) => {
            const active = destination === activeCoursePath
            return (
              <li key={destination}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  data-gtm="nav-link"
                  data-gtm-destination={destination}
                  onClick={() => {
                    if (active) triggerRef.current?.focus()
                    setOpen(false)
                  }}
                  className={cn(
                    'flex min-h-11 items-center rounded-lg border border-transparent px-3 py-2 leading-snug focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-red motion-safe:transition-colors',
                    active ? 'border-brand-red/40 bg-brand-red/15 font-semibold text-white' : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
