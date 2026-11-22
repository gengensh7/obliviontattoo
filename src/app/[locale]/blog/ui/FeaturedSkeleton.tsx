import { Skeleton } from '@/components/ui/skeleton'

export function FeaturedSkeleton() {
  return (
    <div aria-hidden="true" className="grid overflow-hidden rounded-xl border border-white/10 bg-zinc-900 md:grid-cols-2">
      <Skeleton className="aspect-video rounded-none bg-zinc-800 motion-reduce:animate-none" />
      <div className="grid content-center gap-4 p-6 sm:p-10">
        <Skeleton className="h-4 w-28 bg-zinc-800 motion-reduce:animate-none" />
        <Skeleton className="h-12 w-5/6 bg-zinc-800 motion-reduce:animate-none" />
        <Skeleton className="h-4 w-2/3 bg-zinc-800 motion-reduce:animate-none" />
      </div>
    </div>
  )
}
