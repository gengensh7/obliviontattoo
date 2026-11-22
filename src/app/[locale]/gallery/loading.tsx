import { RouteSkeleton, SkeletonActions, SkeletonBlock, SkeletonText } from '@/shared/LoadingSkeleton'
import { GalleryGridSkeleton } from './ui/GalleryGridSkeleton'

export default function GalleryLoading() {
  return (
    <RouteSkeleton>
      <div className="flex min-h-screen items-center pt-24 pb-10 sm:pt-28 sm:pb-12">
        <div className="container grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="grid gap-3 lg:col-span-7 lg:gap-4">
            <SkeletonBlock className="h-10 w-5/6 sm:h-14 xl:h-20" />
            <SkeletonBlock className="h-10 w-3/4 sm:h-14 xl:h-20" />
            <SkeletonBlock className="h-10 w-2/3 sm:h-14 xl:h-20" />
            <SkeletonBlock className="h-10 w-1/2 sm:hidden lg:block lg:h-14 xl:h-20" />
          </div>
          <div className="grid gap-4 lg:col-span-5">
            <SkeletonBlock className="h-7 w-4/5 sm:h-9" />
            <SkeletonText />
            <div className="pt-3"><SkeletonActions /></div>
          </div>
        </div>
      </div>
      <div className="container py-10 sm:py-14"><GalleryGridSkeleton /></div>
    </RouteSkeleton>
  )
}
