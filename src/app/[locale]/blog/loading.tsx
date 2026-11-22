import { Skeleton } from '@/components/ui/skeleton'
import { FeaturedSkeleton } from './ui/FeaturedSkeleton'

export default function BlogLoading() {
  return (
    <main aria-busy="true" className="bg-zinc-950">
      <div aria-hidden="true" className="container grid min-h-screen content-center items-end gap-6 pt-32 pb-12 lg:grid-cols-2">
        <Skeleton className="h-28 w-4/5 bg-zinc-900 motion-reduce:animate-none" />
        <Skeleton className="h-20 w-3/4 bg-zinc-900 motion-reduce:animate-none" />
      </div>
      <div className="container grid gap-6 py-10 sm:py-14">
        <Skeleton className="h-10 w-52 bg-zinc-900 motion-reduce:animate-none" />
        <FeaturedSkeleton />
      </div>
    </main>
  )
}
