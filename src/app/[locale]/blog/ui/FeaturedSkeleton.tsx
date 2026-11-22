import { SkeletonBlock, SkeletonText } from '@/shared/LoadingSkeleton'

export function FeaturedSkeleton() {
  return (
    <div aria-hidden="true" className="grid overflow-hidden rounded-xl border border-white/10 bg-zinc-900 md:grid-cols-2">
      <SkeletonBlock className="aspect-video rounded-none md:aspect-auto md:min-h-80" />
      <div className="grid content-center gap-4 p-5 sm:gap-5 sm:p-8 xl:p-12">
        <SkeletonBlock className="h-4 w-2/5" />
        <SkeletonBlock className="h-8 w-5/6 xl:h-10" />
        <SkeletonText />
        <div className="flex h-12 items-center"><SkeletonBlock className="h-4 w-28" /></div>
      </div>
    </div>
  )
}
