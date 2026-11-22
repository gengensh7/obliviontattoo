import { RouteSkeleton, SkeletonActions, SkeletonBlock, SkeletonHeading, SkeletonText } from '@/shared/LoadingSkeleton'
import { FeaturedSkeleton } from '../ui/FeaturedSkeleton'

export default function BlogLoading() {
  return (
    <RouteSkeleton>
      <div className="grid min-h-screen items-center border-b border-white/15 pt-32 pb-12 sm:pb-16">
        <div className="container grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
          <SkeletonHeading className="lg:col-span-7" />
          <div className="grid gap-5 lg:col-span-5 lg:gap-6">
            <div className="grid gap-2">
              <SkeletonBlock className="h-7 w-5/6" />
              <SkeletonText />
            </div>
            <SkeletonActions />
          </div>
        </div>
      </div>
      <div className="container grid gap-6 py-10 sm:gap-8 sm:py-14 lg:pb-20">
        <SkeletonBlock className="h-10 w-52 max-w-full" />
        <FeaturedSkeleton />
      </div>
    </RouteSkeleton>
  )
}
