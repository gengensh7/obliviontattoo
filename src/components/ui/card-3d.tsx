import type { ComponentProps, CSSProperties } from 'react'
import { cn } from '@/lib/utils'

// Adapted from https://www.shadcn.io/ui/card-3d for ambient motion.
export function Card3D({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-3d" className={cn('card-3d flex items-center justify-center', className)} {...props} />
}

export function Card3DBody({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-3d-body" className={cn('relative transform-3d *:transform-3d', className)} {...props} />
}

export function Card3DItem({ className, style, translateZ, ...props }: ComponentProps<'div'> & { translateZ: number }) {
  return (
    <div
      data-slot="card-3d-item"
      className={cn('motion-safe:transform-(--card-3d-item)', className)}
      style={{ ...style, '--card-3d-item': `translateZ(${translateZ}px)` } as CSSProperties}
      {...props}
    />
  )
}
