import { RouteSkeleton, SkeletonBlock, SkeletonButton, SkeletonHeading, SkeletonText } from '@/shared/LoadingSkeleton'

export default function CourseDetailLoading() {
  return (
    <RouteSkeleton>
      <div className="container grid gap-5 pt-24 pb-12 sm:gap-7 sm:pt-28 sm:pb-16">
        <div className="flex h-11 items-center"><SkeletonBlock className="h-4 w-48" /></div>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="grid gap-5 sm:gap-6 lg:col-span-6">
            <div className="grid gap-2">
              <SkeletonHeading className="w-full" />
              <SkeletonHeading className="w-3/4" />
            </div>
            <SkeletonText />
            <div className="flex gap-10 border-y border-zinc-800 py-4">
              <SkeletonBlock className="h-10 w-20" />
              <SkeletonBlock className="h-10 w-20" />
            </div>
            <SkeletonButton />
          </div>
          <SkeletonBlock className="aspect-4/3 rounded-xl lg:col-span-6" />
        </div>
      </div>
    </RouteSkeleton>
  )
}
