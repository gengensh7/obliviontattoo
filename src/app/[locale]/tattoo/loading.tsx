import { RouteSkeleton, SkeletonActions, SkeletonBlock, SkeletonHeading, SkeletonText } from '@/shared/LoadingSkeleton'

export default function TattooLoading() {
  return (
    <RouteSkeleton className="flex min-h-svh items-center bg-zinc-900">
      <div className="container grid gap-9 pt-28 pb-12 sm:gap-11 sm:pt-32 lg:gap-12 lg:pt-36 lg:pb-16">
        <div className="grid gap-5">
          <SkeletonHeading className="w-3/4 sm:w-2/5" />
          <SkeletonText className="lg:w-3/4" />
          <div className="flex flex-col gap-x-8 gap-y-4 sm:flex-row sm:items-center">
            <SkeletonActions />
            <SkeletonBlock className="h-4 w-28" />
          </div>
        </div>
        <div className="grid gap-3 md:grid-flow-col md:grid-cols-2 md:grid-rows-2 lg:grid-cols-12 lg:gap-4">
          <div className="relative flex min-h-54 flex-col justify-between gap-5 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/35 p-5 md:row-span-2 md:p-6 lg:col-span-7 lg:p-8">
            <SkeletonBlock className="absolute inset-y-0 right-0 w-2/5 rounded-none" />
            <SkeletonBlock className="h-8 w-1/2" />
            <SkeletonText className="w-1/2" />
            <SkeletonBlock className="h-5 w-1/3" />
          </div>
          {['cover-up', 'custom'].map((card) => (
            <div key={card} className="grid gap-3 rounded-2xl border border-white/10 bg-zinc-950/35 px-5 py-4 lg:col-span-5 lg:px-6">
              <SkeletonBlock className="h-5 w-1/2" />
              <SkeletonText />
              <SkeletonBlock className="h-4 w-28 self-center" />
            </div>
          ))}
        </div>
      </div>
    </RouteSkeleton>
  )
}
