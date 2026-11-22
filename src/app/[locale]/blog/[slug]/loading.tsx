import { RouteSkeleton, SkeletonBlock, SkeletonHeading, SkeletonText } from '@/shared/LoadingSkeleton'

export default function BlogPostLoading() {
  return (
    <RouteSkeleton className="min-h-screen">
      <div className="container pt-24 pb-16 sm:pt-28 sm:pb-24">
        <div className="grid gap-6 border-b border-zinc-800 pb-8">
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonHeading />
          <SkeletonText />
          <SkeletonBlock className="h-4 w-40" />
        </div>
        <div className="grid gap-6 py-12 pl-6 sm:pl-10">
          <SkeletonBlock className="h-7 w-3/4" />
          <SkeletonText />
          <SkeletonText />
        </div>
      </div>
    </RouteSkeleton>
  )
}
