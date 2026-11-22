import { RouteSkeleton, SkeletonBlock, SkeletonButton, SkeletonHeading, SkeletonText } from '@/shared/LoadingSkeleton'

export default function PermanentLoading() {
  return (
    <RouteSkeleton>
      <div aria-hidden="true" className="permanent-hero-shell">
        <div className="container permanent-hero-layout">
          <div className="grid justify-items-start gap-5 sm:gap-8 lg:col-span-5">
            <div className="grid w-full gap-2">
              <SkeletonHeading />
              <SkeletonHeading className="w-2/5" />
              <SkeletonBlock className="h-6 w-36 sm:h-8" />
            </div>
            <SkeletonText className="max-w-sm" />
            <SkeletonButton className="w-60" />
          </div>

          <ul className="permanent-hero-services">
            {['brows', 'lips', 'eyelids'].map((service) => (
              <li key={service} data-service={service}>
                <SkeletonBlock className="rounded-md" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RouteSkeleton>
  )
}
