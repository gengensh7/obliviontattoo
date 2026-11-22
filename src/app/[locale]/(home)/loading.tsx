import { RouteSkeleton, SkeletonBlock, SkeletonButton } from '@/shared/LoadingSkeleton'

export default function HomeLoading() {
  return (
    <RouteSkeleton>
      <div className="relative container flex min-h-screen flex-col justify-center gap-6 py-28">
        <SkeletonBlock className="h-9 w-2/5 md:h-12" />
        <div className="grid gap-2 lg:gap-4">
          <SkeletonBlock className="h-7 w-5/6 lg:h-20" />
          <SkeletonBlock className="h-7 w-3/5 sm:hidden lg:block lg:h-20" />
        </div>
        <div className="grid max-w-3xl gap-3">
          <SkeletonBlock className="h-4" />
          <SkeletonBlock className="h-4 sm:hidden" />
          <SkeletonBlock className="h-4 sm:hidden" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>
        <SkeletonButton className="w-32" />
        <div className="absolute inset-x-0 bottom-16 container flex items-center gap-6 sm:bottom-4">
          <SkeletonBlock className="size-10 rounded-full" />
          <SkeletonBlock className="h-3 w-20 rounded-full" />
          <SkeletonBlock className="size-10 rounded-full" />
          <SkeletonBlock className="size-10 rounded-full" />
        </div>
      </div>
    </RouteSkeleton>
  )
}
