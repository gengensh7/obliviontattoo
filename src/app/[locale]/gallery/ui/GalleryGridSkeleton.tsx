import { SkeletonBlock } from '@/shared/LoadingSkeleton'

export function GalleryGridSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => <SkeletonBlock key={index} className="aspect-4/5 rounded-xl" />)}
    </div>
  )
}
