import { RouteSkeleton, SkeletonActions, SkeletonBlock, SkeletonButton, SkeletonHeading, SkeletonText } from '@/shared/LoadingSkeleton'

export default function CourseLoading() {
  return (
    <RouteSkeleton className="bg-zinc-900">
      <div className="flex h-dvh flex-col overflow-clip bg-zinc-950 pt-25 sm:pt-28 lg:pt-30">
        <div className="container flex grow flex-col justify-center gap-4 py-5 sm:gap-5 sm:py-8">
          <div className="grid gap-2 lg:w-11/12 xl:w-5/6">
            <SkeletonHeading className="w-full" />
            <SkeletonHeading className="w-2/3" />
          </div>
          <SkeletonText className="lg:w-2/3 xl:w-1/2" />
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <SkeletonActions />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((benefit) => <SkeletonBlock key={benefit} className="h-8 w-24 rounded-full" />)}
            </div>
          </div>
        </div>
      </div>
      <div className="container grid gap-3.5 pb-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-4 lg:pb-20">
        {['tattoo', 'permanent', 'piercing'].map((course) => (
          <div key={course} className={`flex flex-col gap-4 rounded-2xl border border-white/10 p-4 sm:p-5 ${course === 'tattoo' ? 'md:col-span-2 lg:col-span-7 lg:row-span-2 lg:p-8' : 'lg:col-span-5'}`}>
            <div className="flex items-start justify-between gap-4">
              <SkeletonBlock className="h-7 w-3/5" />
              <SkeletonBlock className="h-7 w-1/5" />
            </div>
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonText />
            <SkeletonText className="w-4/5" />
            {course === 'tattoo' && <SkeletonBlock className="h-28 grow rounded-lg sm:h-40" />}
            <div className="border-t border-white/10 pt-3"><SkeletonButton /></div>
          </div>
        ))}
      </div>
    </RouteSkeleton>
  )
}
