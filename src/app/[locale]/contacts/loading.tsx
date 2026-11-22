import { RouteSkeleton, SkeletonActions, SkeletonBlock, SkeletonHeading, SkeletonText } from '@/shared/LoadingSkeleton'

export default function ContactsLoading() {
  return (
    <RouteSkeleton className="grid min-h-svh items-center pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div className="container grid items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-14">
        <div className="grid gap-6 sm:gap-8 lg:col-span-7">
          <div className="grid gap-4 sm:gap-6">
            <div className="grid gap-2"><SkeletonHeading /><SkeletonHeading className="w-2/5" /></div>
            <SkeletonText />
          </div>
          <SkeletonActions />
          <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-5">
            {[1, 2, 3].map((benefit) => <SkeletonBlock key={benefit} className="h-4 w-24" />)}
          </div>
        </div>
        <div className="grid gap-5 rounded-xl border border-white/15 bg-zinc-900/80 p-5 sm:p-7 lg:col-span-5">
          <div className="grid gap-2">
            <SkeletonBlock className="h-8 w-3/4" />
            <SkeletonText />
          </div>
          <div className="grid gap-4 border-t border-white/15 pt-5 sm:max-lg:grid-cols-2 xl:grid-cols-2">
            <div className="grid gap-2"><SkeletonText /><SkeletonBlock className="h-5 w-24" /></div>
            <SkeletonText />
          </div>
          <div className="divide-y divide-white/10 border-y border-white/15">
            {['telegram', 'instagram', 'phone'].map((channel) => (
              <div key={channel} className="flex h-12 items-center justify-between">
                <SkeletonBlock className="h-4 w-1/4" /><SkeletonBlock className="h-4 w-2/5" />
              </div>
            ))}
          </div>
          <div className="flex h-11 items-center"><SkeletonBlock className="h-4 w-1/2" /></div>
        </div>
      </div>
    </RouteSkeleton>
  )
}
