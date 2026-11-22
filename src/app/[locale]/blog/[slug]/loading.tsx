import { RouteSkeleton, SkeletonBlock, SkeletonText } from '@/shared/LoadingSkeleton'

export default function BlogPostLoading() {
  return (
    <RouteSkeleton className="min-h-screen bg-zinc-900 pt-30">
      <div className="container grid gap-8">
        <div className="grid gap-6">
          <SkeletonBlock className="h-9 w-5/6 md:h-10" />
          <SkeletonText />
        </div>
        {['w-2/3', 'w-1/2', 'w-3/5'].map((width) => (
          <div key={width} className="grid gap-4">
            <div className="border-b border-gray-700 pb-2">
              <SkeletonBlock className={`h-7 md:h-9 ${width}`} />
            </div>
            <SkeletonText />
            <SkeletonText className="w-11/12" />
          </div>
        ))}
      </div>
    </RouteSkeleton>
  )
}
