import { RouteSkeleton, SkeletonBlock, SkeletonButton, SkeletonHeading, SkeletonText } from '@/shared/LoadingSkeleton'

export default function PiercingLoading() {
  return (
    <RouteSkeleton>
      <div className="container grid items-center gap-8 pt-28 pb-12 sm:gap-10 sm:pt-32 sm:pb-16 lg:min-h-svh lg:grid-cols-12 lg:gap-8 lg:pt-24 xl:gap-12">
        <div className="grid gap-6 sm:gap-8 lg:col-span-5">
          <div className="grid gap-3 sm:gap-4">
            <div className="grid gap-2">
              <SkeletonHeading />
              <SkeletonHeading className="w-1/2 sm:hidden lg:block" />
            </div>
            <SkeletonText />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <SkeletonButton className="w-full sm:w-40" />
            <SkeletonButton className="w-full sm:w-32" />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 border-t border-white/15 pt-4 sm:pt-5">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-5 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-12 items-center gap-2 sm:gap-3 lg:col-span-7 lg:gap-4">
          <SkeletonBlock className="col-span-8 aspect-4/5 rounded-xl sm:aspect-square lg:aspect-4/5" />
          <div className="col-span-4 grid gap-2 pt-5 sm:gap-3 sm:pt-8 lg:gap-4 lg:pt-14">
            <SkeletonBlock className="aspect-square rounded-xl" />
            <SkeletonBlock className="aspect-5/4 w-11/12 justify-self-end rounded-xl" />
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-12 sm:py-16 lg:py-20">
        <div className="container"><SkeletonHeading className="md:w-1/2" /></div>
      </div>
    </RouteSkeleton>
  )
}
