import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function LoadingStatus() {
  const t = useTranslations()
  return <span role="status" className="sr-only">{t('loadingState')}</span>
}

export function RouteSkeleton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <>
      <LoadingStatus />
      <main aria-busy="true" className={cn('bg-zinc-950', className)}>{children}</main>
    </>
  )
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <Skeleton aria-hidden="true" className={cn('bg-zinc-800 motion-reduce:animate-none', className)} />
}

export function SkeletonHeading({ className }: { className?: string }) {
  return <SkeletonBlock className={cn('h-9 w-4/5 sm:h-12 xl:h-14', className)} />
}

export function SkeletonText({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('grid w-full gap-2', className)}>
      <SkeletonBlock className="h-4" />
      <SkeletonBlock className="h-4 w-3/4" />
    </div>
  )
}

export function SkeletonButton({ className }: { className?: string }) {
  return <SkeletonBlock className={cn('h-12 w-40 max-w-full', className)} />
}

export function SkeletonActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SkeletonButton />
      <SkeletonButton className="w-32" />
    </div>
  )
}
