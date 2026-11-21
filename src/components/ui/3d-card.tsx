'use client'

// Aceternity UI 3D Card Effect by Manu Arora, adapted for subtle pointer motion.
// https://ui.aceternity.com/registry/3d-card.json
import { createContext, useContext, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, ElementType, PointerEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const MouseEnterContext = createContext<boolean | undefined>(undefined)
const tiltMedia = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const maxTilt = 5

function supportsTilt(event: PointerEvent<HTMLDivElement>) {
  return event.pointerType === 'mouse' && window.matchMedia(tiltMedia).matches
}

export const CardContainer = ({
  children,
  className,
  containerClassName
}: {
  children: ReactNode
  className?: string
  containerClassName?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !supportsTilt(event)) return

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, (event.clientX - left - width / 2) / (width / 2)))
    const y = Math.max(-1, Math.min(1, (event.clientY - top - height / 2) / (height / 2)))
    containerRef.current.style.transform = `rotateY(${x * maxTilt}deg) rotateX(${y * maxTilt}deg)`
  }

  const resetTilt = () => {
    setIsMouseEntered(false)
    containerRef.current?.style.removeProperty('transform')
  }

  return (
    <MouseEnterContext.Provider value={isMouseEntered}>
      <div
        className={cn('flex items-center justify-center py-20 perspective-distant', containerClassName)}
        onPointerEnter={(event) => setIsMouseEntered(supportsTilt(event))}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onPointerCancel={resetTilt}
      >
        <div
          ref={containerRef}
          className={cn(
            'relative flex transform-3d items-center justify-center transition-transform duration-200 ease-out motion-reduce:transform-none! motion-reduce:transition-none',
            className
          )}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  )
}

export const CardBody = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('h-96 w-96 transform-3d *:transform-3d', className)}>{children}</div>
)

type CardItemProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  className?: string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export const CardItem = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  style,
  ...props
}: CardItemProps<T>) => {
  const Tag = as ?? 'div'
  const isMouseEntered = useContext(MouseEnterContext)
  if (isMouseEntered === undefined) throw new Error('CardItem must be used within CardContainer')

  const transform = isMouseEntered
    ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    : undefined

  return (
    <Tag
      {...props}
      className={cn(
        'w-fit transition-transform duration-200 ease-out motion-reduce:transform-none! motion-reduce:transition-none',
        className
      )}
      style={{ ...style, transform: transform ?? style?.transform }}
    >
      {children}
    </Tag>
  )
}
