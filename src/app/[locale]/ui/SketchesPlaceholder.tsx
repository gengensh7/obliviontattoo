import { SkeletonBlock } from '@/shared/LoadingSkeleton'

export const SketchesPlaceholder = () => (
  <div aria-hidden="true" className="@container grid min-w-0 gap-4">
    <div className="sketches-track flex items-center justify-center gap-3 overflow-hidden sm:gap-4 lg:gap-6">
      {['previous', 'current', 'next'].map((position) => (
        <SkeletonBlock key={position} className={`sketches-slide aspect-3/4 shrink-0 rounded-sm ${position === 'current' ? '' : 'scale-90 bg-zinc-800/60'}`} />
      ))}
    </div>
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-4 sm:gap-x-6">
      <div className="grow basis-44"><SkeletonBlock className="h-5 w-3/4" /></div>
      <div className="ms-auto flex items-center gap-2 sm:gap-4">
        <SkeletonBlock className="h-4 w-12" />
        <div className="flex gap-1 sm:gap-2">
          <SkeletonBlock className="size-11 rounded-full motion-reduce:hidden" />
          <SkeletonBlock className="size-11 rounded-full" />
          <SkeletonBlock className="size-11 rounded-full" />
        </div>
      </div>
    </div>
  </div>
)
